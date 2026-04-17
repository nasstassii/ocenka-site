const jwt = require('jsonwebtoken');

// Проверка токена для всех защищённых маршрутов
const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ error: 'Нет доступа. Требуется авторизация.' });
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Неверный или просроченный токен.' });
    }
};

// Проверка прав администратора
const adminOnly = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Доступ запрещён. Требуются права администратора.' });
    }
    next();
};

module.exports = { authMiddleware, adminOnly };