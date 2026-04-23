const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(uploadDir));

// ПОДКЛЮЧАЕМ МАРШРУТЫ
const authRoutes = require('./routes/auth');
const requestsRoutes = require('./routes/requests');
const reviewsRoutes = require('./routes/reviews');
const contentRoutes = require('./routes/content');
const uploadRoutes = require('./routes/upload');
const feedbackRoutes = require('./routes/feedback');

app.use('/api/auth', authRoutes);
app.use('/api/requests', requestsRoutes);
app.use('/api/reviews', reviewsRoutes);
app.use('/api/content', contentRoutes); 
app.use('/api/upload', uploadRoutes);
app.use('/api/feedback', feedbackRoutes);

app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Сервер работает!' });
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
    console.log(`Папка для загрузок: ${uploadDir}`);
});