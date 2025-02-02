const express = require('express');
const puppeteer = require('puppeteer');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', async (req, res) => {
    try {
        const browser = await puppeteer.launch({ 
            headless: "new", // Correction ici 
            args: ['--no-sandbox', '--disable-setuid-sandbox'] 
        });
        const page = await browser.newPage();
        
        await page.goto('https://www.vinted.fr/login', { timeout: 60000 });

        console.log('Page ouverte sur Vinted');
        
        await browser.close();
        res.send('Puppeteer a ouvert Vinted avec succès !');
    } catch (error) {
        console.error("Erreur lors de l'ouverture de la page :", error);
        res.status(500).send("Erreur interne du serveur");
    }
});

app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});
