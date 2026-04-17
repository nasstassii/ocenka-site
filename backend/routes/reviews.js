const express = require('express');
const db = require('../db');
const { authMiddleware, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const [reviews] = await db.query(`
            SELECT r.*, u.fio as author 
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

router.post('/', authMiddleware, async (req, res) => {
    const { users_id_user, text, rating } = req.body;
    
    if (req.user.id != users_id_user && req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Доступ запрещён' });
    }

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

router.delete('/:id', authMiddleware, adminOnly, async (req, res) => {
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