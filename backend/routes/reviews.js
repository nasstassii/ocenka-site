const express = require('express');
const db = require('../db');

const router = express.Router();

// ПОЛУЧИТЬ ВСЕ ОТЗЫВЫ (последние 10)
router.get('/', async (req, res) => {
    try {
        const [reviews] = await db.query(`
            SELECT 
                r.*, 
                u.fio as author 
            FROM reviews r
            JOIN users u ON r.users_id_user = u.id_user
            ORDER BY r.created_at DESC
            LIMIT 10
        `);
        res.json(reviews);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка получения отзывов' });
    }
});

// ДОБАВИТЬ НОВЫЙ ОТЗЫВ
router.post('/', async (req, res) => {
    const { users_id_user, text, rating } = req.body;

    try {
        const [result] = await db.query(
            'INSERT INTO reviews (users_id_user, text, rating) VALUES (?, ?, ?)',
            [users_id_user, text, rating]
        );
        res.json({ success: true, id: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка добавления отзыва' });
    }
});

// УДАЛИТЬ ОТЗЫВ (ДОБАВЛЕНО ДЛЯ АДМИНА)
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        await db.query('DELETE FROM reviews WHERE id_rev = ?', [id]);
        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка удаления отзыва' });
    }
});

module.exports = router;