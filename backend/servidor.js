const express = require('express');
const cors = require('cors');
const { scrapeJobs } = require('./index');

const app = express();
const port = process.env.PORT || 8080;

// Configuración básica del servidor
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/', (req, res) => {
    res.json({ 
        status: 'API funcionando', 
        message: 'Bienvenido al API de CompuScraper',
        endpoints: {
            buscar: 'POST /api/buscar',
            health: 'GET /health'
        }
    });
});

// Health check específico
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'healthy' });
});

// Endpoint principal de búsqueda
app.post('/api/buscar', async (req, res) => {
    const { puesto } = req.body;

    if (!puesto) {
        return res.status(400).json({ error: "Debe proporcionar un puesto de trabajo para buscar." });
    }

    try {
        console.log(`Petición recibida para buscar: ${puesto}`);
        const ofertas = await scrapeJobs(puesto);
        res.json(ofertas);
    } catch (error) {
        console.error("Error en el servidor:", error);
        res.status(500).json({ 
            error: "Ocurrió un error al realizar el scraping.",
            details: error.message
        });
    }
});

// Manejo de errores para rutas no encontradas
app.use((req, res) => {
    res.status(404).json({ error: "Ruta no encontrada" });
});

// Manejadores globales de errores
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`API escuchando en http://localhost:${port}`);
});