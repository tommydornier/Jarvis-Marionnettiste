const express = require('express');
const puppeteer = require('puppeteer');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', async (req, res) => {
    const browser = await puppeteer.launch({ 
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        headless: "new" // Utilisation du mode headless recommandé
    });
    const page = await browser.newPage();
    
    await page.goto('https://www.vinted.fr/login', { waitUntil: 'networkidle2' });

    console.log('Page ouverte sur Vinted');
    
    // Capture un screenshot pour vérifier si la page se charge bien
    await page.screenshot({ path: 'screenshot.png' });

    await browser.close();
    res.send('Puppeteer a ouvert Vinted avec succès et a pris un screenshot !');
});

app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});
