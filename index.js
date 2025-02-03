const express = require('express');
const puppeteer = require('puppeteer');

const app = express();
const PORT = process.env.PORT || 3000;

// Identifiants (à récupérer via un formulaire sécurisé à l'avenir)
const USERNAME = 'ton_email_vinted@example.com';
const PASSWORD = 'ton_mot_de_passe_vinted';

app.get('/', async (req, res) => {
    const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    
    // Aller sur la page de connexion Vinted
    await page.goto('https://www.vinted.fr/login', { waitUntil: 'networkidle2' });

    // Saisir les identifiants et se connecter
    await page.type('input[name="email"]', USERNAME);
    await page.type('input[name="password"]', PASSWORD);
    await page.click('button[type="submit"]');

    // Attendre la redirection vers le tableau de bord
    await page.waitForNavigation({ waitUntil: 'networkidle2' });

    // Aller sur la page du tableau de bord
    await page.goto('https://www.vinted.fr/member/dashboard', { waitUntil: 'networkidle2' });

    // Extraire les données du tableau de bord
    const data = await page.evaluate(() => {
        let soldItems = document.querySelector('.your-sold-items-selector'); // Adapter les sélecteurs
        let totalRevenue = document.querySelector('.total-revenue-selector');

        return {
            soldItems: soldItems ? soldItems.innerText : 'Données non trouvées',
            totalRevenue: totalRevenue ? totalRevenue.innerText : 'Données non trouvées'
        };
    });

    console.log("Données du tableau de bord récupérées :", data);

    await browser.close();
    
    res.json({ message: "Données du tableau de bord récupérées avec succès !", data });
});

app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});
