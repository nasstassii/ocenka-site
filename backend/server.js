const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Создаём папку для документов, если её нет
const documentsDir = path.join(__dirname, '../public/documents');
if (!fs.existsSync(documentsDir)) {
    fs.mkdirSync(documentsDir, { recursive: true });
}

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/documents', express.static(documentsDir));

// Подключаем маршруты
const contentRoutes = require('./routes/content');

app.use('/api/content', contentRoutes);

app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Сервер работает!' });
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});