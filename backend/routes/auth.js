const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../db');

const router = express.Router();

// РЕГИСТРАЦИЯ
router.post('/register', async (req, res) => {
    const { fio, email, phone, password } = req.body;

    try {
        // Проверяем, есть ли уже такой email
        const [existing] = await db.query(
            'SELECT id_user FROM users WHERE email = ?',
            [email]
        );

        if (existing.length > 0) {
            return res.status(400).json({ error: 'Пользователь с таким email уже существует' });
        }

        // Хэшируем пароль (шифруем)
        const hashedPassword = await bcrypt.hash(password, 10);

        // Добавляем пользователя в базу
        const [result] = await db.query(
            'INSERT INTO users (fio, email, phone, password, role) VALUES (?, ?, ?, ?, ?)',
            [fio, email, phone, hashedPassword, 'client']
        );

        res.json({ 
            success: true, 
            message: 'Регистрация успешна',
            user: { 
                id: result.insertId, 
                fio, 
                email, 
                phone, 
                role: 'client' 
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// ВХОД
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Ищем пользователя по email
        const [users] = await db.query(
            'SELECT id_user, fio, email, phone, password, role FROM users WHERE email = ?',
            [email]
        );

        if (users.length === 0) {
            return res.status(401).json({ error: 'Неверный email или пароль' });
        }

        const user = users[0];

        // Сравниваем введённый пароль с зашифрованным в базе
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Неверный email или пароль' });
        }

        // Отправляем данные пользователя (без пароля)
        res.json({
            success: true,
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

// ПОЛУЧИТЬ ДАННЫЕ ПОЛЬЗОВАТЕЛЯ
router.get('/user/:id', async (req, res) => {
    const { id } = req.params;
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

// ОБНОВИТЬ ПРОФИЛЬ
router.put('/update', async (req, res) => {
    const { id, fio, phone } = req.body;
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

// СМЕНА ПАРОЛЯ
router.post('/change-password', async (req, res) => {
    const { userId, oldPassword, newPassword } = req.body;

    try {
        // Получаем текущий пароль пользователя
        const [users] = await db.query(
            'SELECT password FROM users WHERE id_user = ?',
            [userId]
        );

        if (users.length === 0) {
            return res.status(404).json({ error: 'Пользователь не найден' });
        }

        // Проверяем старый пароль
        const isPasswordValid = await bcrypt.compare(oldPassword, users[0].password);

        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Неверный текущий пароль' });
        }

        // Хэшируем новый пароль
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Обновляем пароль
        await db.query(
            'UPDATE users SET password = ? WHERE id_user = ?',
            [hashedPassword, userId]
        );

        res.json({ success: true, message: 'Пароль успешно изменён' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

module.exports = router;