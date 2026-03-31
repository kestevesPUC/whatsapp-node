// --------------------
// WHATSAPP WEB JS
// --------------------
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const client = new Client({
    authStrategy: new LocalAuth(), // salva sessão automaticamente
});

client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('🤖 Bot conectado!');
});

client.on('message', msg => {
    if (msg.body === '!ping') {
        msg.reply('pong 🏓');
    }
});

client.initialize();


// --------------------
// EXPRESS (API)
// --------------------
const express = require('express');
const app = express();
app.use(express.json());

// ROTA POST PARA ENVIAR MENSAGEM
app.post('/send', async (req, res) => {
    const { number, message } = req.body;

    if (!number || !message) {
        return res.status(400).json({
            error: "Envie number e message no body JSON"
        });
    }

    // Formata o número automaticamente
    const chatId = number.includes('@c.us')
        ? number
        : `${number}@c.us`;

    try {
        await client.sendMessage(chatId, message);
        res.json({
            status: "enviado",
            para: number,
            mensagem: message
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});



// ROTA POST PARA ENVIAR MENSAGEM
app.post('/logout', async (req, res) => {
    client.logout();
});
