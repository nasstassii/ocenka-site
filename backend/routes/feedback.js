const express = require('express');
const nodemailer = require('nodemailer');
require('dotenv').config();

const router = express.Router();

const transporter = nodemailer.createTransport({
    host: 'smtp.yandex.ru',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

router.post('/', async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ error: 'Заполните все поля' });
    }

    if (!email.includes('@') || !email.includes('.')) {
        return res.status(400).json({ error: 'Введите корректный email' });
    }

    try {
        await transporter.sendMail({
            from: `"Сайт Ольги Бакаленко" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_USER,
            replyTo: email,
            subject: `Новое сообщение от ${name}`,
            html: `
                <strong>Отправитель:</strong> ${name}<br>
                <strong>Email:</strong> ${email}<br><br>
                <strong>Сообщение:</strong><br>
                ${message.replace(/\n/g, '<br>')}
            `
        });

        console.log(`Письмо отправлено от ${name} (${email})`);
        res.json({ success: true, message: 'Сообщение отправлено' });
    } catch (error) {
        console.error('Ошибка отправки письма:', error);
        res.status(500).json({ error: 'Ошибка отправки сообщения' });
    }
});

module.exports = router;