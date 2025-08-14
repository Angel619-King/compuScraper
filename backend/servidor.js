
const express = require('express');
const cors = require('cors');

const { scrapeJobs } = require('./index'); 

const app = express();
const port= process.env.PORT|| 8080; 


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


        
        res.json(ofertas); 
    } catch (error) {
        console.error("Error en el servidor:", error);
        res.status(500).json({ error: "Ocurrió un error al realizar el scraping." });
    }
});

app.listen(port, "0.0.0.0", () => {
    console.log(`API escuchando en http://0.0.0.0:${port}`);
});
