const express = require('express');
const db = require('../db');

const router = express.Router();

// ========== КВАЛИФИКАЦИЯ (ОТДЕЛЬНЫЙ ЧЁТКИЙ МАРШРУТ) ==========
router.get('/qual/all', async (req, res) => {
    try {
        const [content] = await db.query(
            "SELECT section, text FROM content WHERE page = 'qual'"
        );
        const result = {};
        content.forEach(item => {
            result[item.section] = item.text;
        });
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка получения квалификации' });
    }
});

// ========== ЦЕНЫ НЕДВИЖИМОСТЬ ==========
router.get('/prices_needs/all', async (req, res) => {
    try {
        const [content] = await db.query(
            "SELECT section, text FROM content WHERE page = 'prices_needs'"
        );
        const prices = {};
        content.forEach(item => {
            try {
                prices[item.section] = JSON.parse(item.text);
            } catch (e) {
                prices[item.section] = item.text;
            }
        });
        res.json(prices);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка получения цен' });
    }
});

// ========== ЦЕНЫ ДВИЖИМОЕ ==========
router.get('/prices_movable/all', async (req, res) => {
    try {
        const [content] = await db.query(
            "SELECT section, text FROM content WHERE page = 'prices_movable'"
        );
        const prices = {};
        content.forEach(item => {
            try {
                prices[item.section] = JSON.parse(item.text);
            } catch (e) {
                prices[item.section] = item.text;
            }
        });
        res.json(prices);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка получения цен' });
    }
});

// ========== ОБНОВЛЕНИЕ КВАЛИФИКАЦИИ ==========
router.put('/qual/:section', async (req, res) => {
    const { section } = req.params;
    const { text } = req.body;

    try {
        await db.query(
            `UPDATE content SET text = ? WHERE page = 'qual' AND section = ?`,
            [text, section]
        );
        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка сохранения' });
    }
});

// ========== ОБНОВЛЕНИЕ ЦЕН НЕДВИЖИМОСТЬ ==========
router.put('/prices_needs/bulk', async (req, res) => {
    const { prices } = req.body;
    
    try {
        for (const [key, value] of Object.entries(prices)) {
            const valueToStore = typeof value === 'object' ? JSON.stringify(value) : value;
            await db.query(
                `UPDATE content SET text = ? WHERE page = 'prices_needs' AND section = ?`,
                [valueToStore, key]
            );
        }
        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка обновления цен' });
    }
});

// ========== ОБНОВЛЕНИЕ ЦЕН ДВИЖИМОЕ ==========
router.put('/prices_movable/bulk', async (req, res) => {
    const { prices } = req.body;
    
    try {
        for (const [key, value] of Object.entries(prices)) {
            const valueToStore = typeof value === 'object' ? JSON.stringify(value) : value;
            await db.query(
                `UPDATE content SET text = ? WHERE page = 'prices_movable' AND section = ?`,
                [valueToStore, key]
            );
        }
        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка обновления цен' });
    }
});

module.exports = router;