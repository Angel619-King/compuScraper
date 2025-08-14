
const express = require('express');
const cors = require('cors');

const { scrapeJobs } = require('./index'); 

const app = express();
const port = 3001; 


app.use(cors()); 
app.use(express.json()); 


app.post('/api/buscar', async (req, res) => {
    const { puesto } = req.body;

    if (!puesto) {
        return res.status(400).json({ error: "Debe proporcionar un puesto de trabajo para buscar." });
    }

    try {
        console.log(`Petición recibida para buscar: ${puesto}`);
        const ofertas = await scrapeJobs(puesto); 

        // Aquí puedes procesar los datos antes de enviarlos, por ejemplo,
        // para estandarizar el salario si lo necesitas.
        
        res.json(ofertas); 
    } catch (error) {
        console.error("Error en el servidor:", error);
        res.status(500).json({ error: "Ocurrió un error al realizar el scraping." });
    }
});

app.listen(port, () => {
    console.log(`API escuchando en http://localhost:${port}`);
});