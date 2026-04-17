const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// РЕГИСТРАЦИЯ - теперь тоже возвращает токен
router.post('/register', async (req, res) => {
    const { fio, email, phone, password } = req.body;

    try {
        const [existing] = await db.query(
            'SELECT id_user FROM users WHERE email = ?',
            [email]
        );

        if (existing.length > 0) {
            return res.status(400).json({ error: 'Пользователь с таким email уже существует' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const [result] = await db.query(
            'INSERT INTO users (fio, email, phone, password, role) VALUES (?, ?, ?, ?, ?)',
            [fio, email, phone, hashedPassword, 'client']
        );

        // ГЕНЕРИРУЕМ ТОКЕН СРАЗУ ПОСЛЕ РЕГИСТРАЦИИ
        const token = jwt.sign(
            { id: result.insertId, email: email, role: 'client' },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({ 
            success: true, 
            token,
            message: 'Регистрация успешна',
            user: { id: result.insertId, fio, email, phone, role: 'client' }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// ВХОД (без изменений)
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const [users] = await db.query(
            'SELECT id_user, fio, email, phone, password, role FROM users WHERE email = ?',
            [email]
        );

        if (users.length === 0) {
            return res.status(401).json({ error: 'Неверный email или пароль' });
        }

        const user = users[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Неверный email или пароль' });
        }

        const token = jwt.sign(
            { id: user.id_user, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            success: true,
            token,
            user: {
                id: user.id_user,
                fio: user.fio,
                email: user.email,
                phone: user.phone,
                role: user.role
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// ОСТАЛЬНЫЕ МАРШРУТЫ БЕЗ ИЗМЕНЕНИЙ
router.get('/user/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    
    if (req.user.id != id && req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Доступ запрещён' });
    }
    
    try {
        const [users] = await db.query(
            'SELECT id_user, fio, email, phone, role FROM users WHERE id_user = ?',
            [id]
        );
        if (users.length === 0) {
            return res.status(404).json({ error: 'Пользователь не найден' });
        }
        res.json({ user: users[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

router.put('/update', authMiddleware, async (req, res) => {
    const { id, fio, phone } = req.body;
    
    if (req.user.id != id && req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Доступ запрещён' });
    }
    
    try {
        await db.query(
            'UPDATE users SET fio = ?, phone = ? WHERE id_user = ?',
            [fio, phone, id]
        );
        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка обновления' });
    }
});

router.post('/change-password', authMiddleware, async (req, res) => {
    const { userId, oldPassword, newPassword } = req.body;
    
    if (req.user.id != userId && req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Доступ запрещён' });
    }

    try {
        const [users] = await db.query(
            'SELECT password FROM users WHERE id_user = ?',
            [userId]
        );

        if (users.length === 0) {
            return res.status(404).json({ error: 'Пользователь не найден' });
        }

        const isPasswordValid = await bcrypt.compare(oldPassword, users[0].password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Неверный текущий пароль' });
        }

        if (newPassword.length < 8) {
            return res.status(400).json({ error: 'Пароль должен быть не менее 8 символов' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await db.query('UPDATE users SET password = ? WHERE id_user = ?', [hashedPassword, userId]);

        res.json({ success: true, message: 'Пароль успешно изменён' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

module.exports = router;