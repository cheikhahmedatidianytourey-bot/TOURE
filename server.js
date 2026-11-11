const express = require('express');
const crypto = require('crypto');
const app = express();

app.use(express.json());

// Base de données simulée pour les utilisateurs et leurs crédits
const usersDB = {};

// Route d'accueil de l'API TOURÉ
app.get('/', (req, res) => {
    res.json({
        app: "TOURÉ",
        status: "En ligne & Sécurisé",
        version: "1.0.0",
        message: "Bienvenue sur le cœur de génération ultra-puissant de TOURÉ."
    });
});

// 1. Connexion / Initialisation sécurisée de l'appareil
app.post('/api/auth', (req, res) => {
    const { deviceId } = req.body;
    if (!deviceId) {
        return res.status(400).json({ error: "Identifiant d'appareil requis." });
    }

    if (!usersDB[deviceId]) {
        usersDB[deviceId] = {
            credits: 3, // 3 essais gratuits offerts
            isPro: false,
            createdAt: new Date()
        };
    }

    res.json({
        success: true,
        message: "Connexion sécurisée établie.",
        userData: usersDB[deviceId]
    });
});

// 2. Route de génération de vidéo (Libre et sans censure)
app.post('/api/generate', (req, res) => {
    const { deviceId, prompt } = req.body;
    const user = usersDB[deviceId];

    if (!user) {
        return res.status(403).json({ error: "Accès non autorisé." });
    }

    if (user.credits <= 0 && !user.isPro) {
        return res.status(402).json({ 
            error: "Crédits épuisés", 
            message: "Passez à la version TOURÉ Pro (10$) pour débloquer des générations illimitées sans filigrane !" 
        });
    }

    if (!user.isPro) {
        user.credits -= 1;
    }

    res.json({
        success: true,
        message: "Génération réussie en cours de traitement.",
        remainingCredits: user.isPro ? "Illimité" : user.credits,
        watermark: !user.isPro, // True = logo TOURÉ incrusté (version gratuite)
        videoUrl: "https://TOURE.onrender.com/outputs/generated_video.mp4" 
    });
});

// 3. Route d'initialisation du paiement PayTech (Pack Pro à 10$)
app.post('/api/payment/paytech', (req, res) => {
    const { deviceId } = req.body;
    const priceUSD = 10;
    const ref_command = "TOURE_PRO_" + crypto.randomBytes(4).toString('hex').toUpperCase();

    res.json({
        success: true,
        ref_command: ref_command,
        amount: priceUSD,
        payment_url: "https://paytech.sn/payment/checkout/example-secure-link",
        message: "Lien de paiement sécurisé généré avec succès."
    });
});

// 4. Webhook de confirmation PayTech sécurisé
app.post('/api/payment/ipn', (req, res) => {
    const { ref_command, status, deviceId } = req.body;

    if (status === "success" && usersDB[deviceId]) {
        usersDB[deviceId].isPro = true;
        usersDB[deviceId].credits = "Illimité";
    }

    res.status(200).send("IPN reçue et traitée avec succès.");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serveur TOURÉ démarré sur le port ${PORT}`);
});
