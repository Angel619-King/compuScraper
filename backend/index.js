const puppeteer = require('puppeteer');
const { Cluster } = require('puppeteer-cluster');

const BASE_URL = 'https://mx.computrabajo.com';

const USER_AGENTS = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
];

async function configurarNavegador(pagina) {
    await pagina.setUserAgent(USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)]);
    await pagina.evaluateOnNewDocument(() => {
        Object.defineProperty(navigator, 'webdriver', { get: () => false });
    });
    await pagina.setViewport({ width: 1920, height: 1080 });
}

async function extraerDetalleOferta(browser, idOferta, urlBase) {
    const pagina = await browser.newPage();
    const urlOferta = `${urlBase}#${idOferta}`;
    
    try {
        await configurarNavegador(pagina);
        
        await pagina.setRequestInterception(true);
        pagina.on('request', (req) => {
            if (['image', 'stylesheet', 'font'].includes(req.resourceType())) {
                req.abort();
            } else {
                req.continue();
            }
        });

        await pagina.goto(urlOferta, {
            waitUntil: 'domcontentloaded',
            timeout: 60000
        });

        await pagina.waitForFunction(() => {
            const article = document.querySelector('article');
            return article && article.innerText.length > 50;
        }, { timeout: 30000 });

        return await pagina.evaluate(() => {
            const limpiarTexto = (texto) => texto ? texto.replace(/\s+/g, ' ').replace(/\n/g, ' ').trim() : null;

            const titulo = limpiarTexto(
                document.querySelector('h1.fs24')?.textContent || 
                document.querySelector('h2 a')?.textContent
            );

            const empresaElement = document.querySelector('a.dIB.mr10[target="_blank"]');
            let empresa = empresaElement ? limpiarTexto(empresaElement.textContent) : null;
            
            const ubicacionElement = document.querySelector('p.fs16.mb5') || 
                                     document.querySelector('div.container > p.fs16');
            let ubicacion = ubicacionElement ? limpiarTexto(ubicacionElement.textContent) : null;
            
            if (ubicacion) ubicacion = ubicacion.split('-').pop().trim();

            const salarioElement = document.querySelector('p.dFlex.mb10 span.icon.i_money')?.parentElement;
            const salario = salarioElement ? limpiarTexto(salarioElement.textContent) : 'A convenir';

            const fechaElement = document.querySelector('p.fc_aux.fs13.mtB') || 
                                 document.querySelector('p.fc_aux.fs13');
            const publicado = fechaElement ? limpiarTexto(fechaElement.textContent) : null;

            let contrato = null;
            document.querySelectorAll('p.dFlex.mb10').forEach(el => {
                const icono = el.querySelector('span.icon');
                if (icono?.classList.contains('i_find')) {
                    contrato = limpiarTexto(el.textContent);
                }
            });

            const descripcionElement = document.querySelector('div.fs16.t_word_wrap') || 
                                       document.querySelector('div.bWord');
            let descripcion = descripcionElement ? limpiarTexto(descripcionElement.textContent) : null;

            let requisitos = [];
            const requisitosElement = document.querySelector('ul.fs16.disc.mbB');
            
            if (requisitosElement) {
                requisitos = Array.from(requisitosElement.querySelectorAll('li'))
                    .map(li => limpiarTexto(li.textContent))
                    .filter(texto => texto && texto.length > 0);
            } else if (descripcion) {
                const regexRequisitos = /requisitos?:([\s\S]*?)(?=\n\n|$|beneficios|ofrecemos)/i;
                const match = descripcion.match(regexRequisitos);
                if (match) {
                    requisitos = match[1].split('\n')
                        .map(linea => limpiarTexto(linea))
                        .filter(linea => linea && linea.length > 0);
                }
            }

            return {
            titulo: titulo || "Sin título",
            empresa: empresa || "Empresa no especificada",
            ubicacion: ubicacion || "Ubicación no especificada",
            publicado: publicado || "Fecha no disponible",
            enlace: window.location.href,
            contrato: contrato || "Tipo de contrato no especificado",
            requisitos: requisitos.length > 0 ? requisitos : ["No se especificaron requisitos"],
            descripcion: descripcion || "Descripción no disponible",
            salario: salario || "Salario no especificado"
};
        });

    } catch (error) {
        console.error(`Error en oferta ${idOferta}: ${error.message}`);
        return null;
    } finally {
        await pagina.close();
    }
}

async function scrapeJobs(puesto) {
    const busqueda = puesto.trim().toLowerCase().replace(/\s+/g, '-');
    const urlBusqueda = `${BASE_URL}/trabajo-de-${busqueda}`;
    console.log(`Iniciando scraping en: ${urlBusqueda}`);

    const cluster = await Cluster.launch({
        concurrency: Cluster.CONCURRENCY_PAGE,
        maxConcurrency: 2,
        puppeteerOptions: {
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--window-size=1920,1080'
            ]
        }
    });

    const resultados = [];
    
    await cluster.task(async ({ page, data: { idOferta, urlBase } }) => {
        const datos = await extraerDetalleOferta(page.browser(), idOferta, urlBase);
        if (datos) resultados.push(datos);
    });

    const navegador = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const pagina = await navegador.newPage();
    await configurarNavegador(pagina);

    try {
        let paginaActual = 1;
        let hayMasPaginas = true;
        
        while (hayMasPaginas && paginaActual <= 5) {
            const urlPagina = paginaActual === 1 ? urlBusqueda : `${urlBusqueda}?p=${paginaActual}`;
            
            await pagina.goto(urlPagina, { 
                waitUntil: 'networkidle2', 
                timeout: 60000 
            });

            await pagina.waitForSelector('article[data-id]', { timeout: 30000 });

            const idsOfertas = await pagina.evaluate(() => {
                return Array.from(document.querySelectorAll('article[data-id]'))
                    .map(el => el.getAttribute('data-id'));
            });

            if (idsOfertas.length === 0) break;

            console.log(`Página ${paginaActual}: ${idsOfertas.length} ofertas encontradas`);
            
            for (const idOferta of idsOfertas) {
                await cluster.queue({ 
                    idOferta, 
                    urlBase: urlBusqueda 
                });
            }

            hayMasPaginas = await pagina.evaluate(() => {
                const boton = document.querySelector('span.b_primary.w48.buildLink.cp[title="Siguiente"]');
                return boton && !boton.classList.contains('disabled');
            });

            paginaActual++;
            
            // Reemplazo de waitForTimeout
            await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000));
        }

    } catch (error) {
        console.error('Error en el scraping principal:', error);
    } finally {
        await pagina.close();
        await navegador.close();
        await cluster.idle();
        await cluster.close();
        console.log(`Scraping completado. Total de ofertas: ${resultados.length}`);
    }

    return resultados;
}

module.exports = { scrapeJobs };