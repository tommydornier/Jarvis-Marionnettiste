const express = require('express');
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', async (req, res) => {
    const browser = await puppeteer.launch({ 
        args: ['--no-sandbox', '--disable-setuid-sandbox'], 
        headless: "new"
    });

    const page = await browser.newPage();
    await page.goto('https://www.vinted.fr/login');

    console.log('Page ouverte sur Vinted');

    // Prendre un screenshot et le sauvegarder temporairement
    const screenshotPath = path.join(__dirname, 'screenshot.png');
    await page.screenshot({ path: screenshotPath });

    await browser.close();

    // Générer une page HTML avec l'image
    res.send(`
        <h1>Puppeteer a ouvert Vinted avec succès et a pris un screenshot !</h1>
        <img src="/screenshot" alt="Screenshot de Vinted" width="400">
        <p><a href="/screenshot" download="screenshot.png">Télécharger l'image</a></p>
    `);
});

// Route pour afficher le screenshot
app.get('/screenshot', (req, res) => {
    const screenshotPath = path.join(__dirname, 'screenshot.png');
    if (fs.existsSync(screenshotPath)) {
        res.sendFile(screenshotPath);
    } else {
        res.status(404).send('Aucun screenshot trouvé.');
    }
});

app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});
