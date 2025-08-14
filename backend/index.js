const puppeteer = require('puppeteer');

const BASE_URL = 'https://mx.computrabajo.com';

/**
 * @param {string} puesto
 * @returns {Promise<Array>}
 */
async function scrapeJobs(puesto) {
    const busqueda = puesto.trim().toLowerCase().replace(/\s+/g, '-');
    const urlBusqueda = `${BASE_URL}/trabajo-de-${busqueda}`;
    console.log(`\nIniciando búsqueda en: ${urlBusqueda}`);

    const resultados = await extraerOfertasCompletas(urlBusqueda);
    return resultados; 
}

async function extraerDetalleOferta(browser, idOferta, urlBase, paginaActual) {
    const pagina = await browser.newPage();
    const urlOferta = `${urlBase}#${idOferta}`;

    try {
        await pagina.goto(urlOferta, { 
            waitUntil: 'networkidle2', 
            timeout: 60000
        });
        
        await pagina.waitForSelector('article[data-id]', { timeout: 15000 });

        const datos = await pagina.evaluate(() => {
            const limpiarTexto = (texto) => texto ? texto.replace(/\s+/g, ' ').replace(/\n/g, ' ').trim() : null;

            const titulo = limpiarTexto(document.querySelector('h1.fs24')?.textContent) || 
                             limpiarTexto(document.querySelector('h2 a')?.textContent);

            const empresaElement = document.querySelector('a.dIB.mr10[target="_blank"]');
            let empresa = empresaElement ? limpiarTexto(empresaElement.textContent) : null;
            
            if (empresa && empresa.match(/^\d\.\d/)) {
                empresa = empresa.replace(/\n/g, ' ').trim();
            }

            const ubicacionElement = document.querySelector('p.fs16.mb5') || 
                                     document.querySelector('div.container > p.fs16');
            let ubicacion = ubicacionElement ? limpiarTexto(ubicacionElement.textContent) : null;
            if (ubicacion) {
                ubicacion = ubicacion.split('-').pop().trim();
            }

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
                titulo,
                empresa,
                ubicacion,
                publicado,
                enlace: window.location.href,
                contrato,
                requisitos: requisitos.length > 0 ? requisitos : null,
                descripcion,
                salario
            };
        });

        await pagina.close();
        return { ...datos, pagina: paginaActual };
    } catch (err) {
        console.error(`Error al extraer detalle de ${urlOferta}: ${err.message}`);
        await pagina.close();
        return null;
    }
}

async function extraerOfertasCompletas(urlBusqueda) {
    const navegador = await puppeteer.launch({ 
        headless: false,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        defaultViewport: null
    });
    const pagina = await navegador.newPage();
    
    await pagina.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');

    const resultados = [];
    let paginaActual = 1;
    let hayMasPaginas = true;
    let intentosFallidos = 0;
    const MAX_INTENTOS_FALLIDOS = 3;

    while (hayMasPaginas && intentosFallidos < MAX_INTENTOS_FALLIDOS) {
        try {
            console.log(`\nExtrayendo datos de la página ${paginaActual}...`);
            
            const urlPagina = paginaActual === 1 ? urlBusqueda : `${urlBusqueda}?p=${paginaActual}`;
            await pagina.goto(urlPagina, { 
                waitUntil: 'networkidle2', 
                timeout: 60000
            });
            
            await pagina.waitForSelector('article[data-id]', { timeout: 20000 });

            const idsOfertas = await pagina.evaluate(() => {
                return Array.from(document.querySelectorAll('article[data-id]')).map(el => el.getAttribute('data-id'));
            });

            if (idsOfertas.length === 0) {
                console.log('No se encontraron ofertas en esta página. Finalizando.');
                hayMasPaginas = false;
                break;
            }

            console.log(`Encontradas ${idsOfertas.length} ofertas en esta página.`);

            for (let idOferta of idsOfertas) {
                try {
                    const detalle = await extraerDetalleOferta(navegador, idOferta, urlBusqueda, paginaActual);
                    if (detalle) {
                        resultados.push(detalle);
                        console.log(`✅ ${detalle.titulo || 'Sin título'} - ${detalle.empresa || 'Sin empresa'}`);
                    }
                } catch (err) {
                    console.warn(`Error al procesar oferta ${idOferta}: ${err.message}`);
                }
                await new Promise(res => setTimeout(res, 1000));
            }

            const puedeAvanzar = await pagina.evaluate(() => {
                const botonSiguiente = document.querySelector('span.b_primary.w48.buildLink.cp[title="Siguiente"]');
                return botonSiguiente && !botonSiguiente.classList.contains('disabled');
            });

            if (puedeAvanzar) {
                paginaActual++;
                intentosFallidos = 0;
                console.log(`Avanzando a la página ${paginaActual}...`);
                
                const nextPageUrl = `${urlBusqueda}?p=${paginaActual}`;
                await pagina.goto(nextPageUrl, {
                    waitUntil: 'networkidle2',
                    timeout: 60000
                });
                
                await new Promise(res => setTimeout(res, 3000));
            } else {
                hayMasPaginas = false;
                console.log('No hay más páginas disponibles.');
            }
        } catch (error) {
            console.error(`Error al procesar la página ${paginaActual}:`, error.message);
            intentosFallidos++;
            if (intentosFallidos >= MAX_INTENTOS_FALLIDOS) {
                console.error('Demasiados intentos fallidos consecutivos. Terminando el scraping.');
                hayMasPaginas = false;
            } else {
                console.log(`Reintentando página ${paginaActual}...`);
                await new Promise(res => setTimeout(res, 5000));
            }
        }
    }

    console.log(`\nTotal de ofertas encontradas: ${resultados.length}`);
    await navegador.close();
    console.log('Navegador cerrado.');

    return resultados; 
}

module.exports = { scrapeJobs };