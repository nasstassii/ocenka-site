const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('../db');

const router = express.Router();

// ========== НАСТРОЙКА ЗАГРУЗКИ ФАЙЛОВ ДЛЯ ДОКУМЕНТОВ ==========
const documentsDir = path.join(__dirname, '../../public/documents');

if (!fs.existsSync(documentsDir)) {
    fs.mkdirSync(documentsDir, { recursive: true });
}

const documentStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, documentsDir);
    },
    filename: (req, file, cb) => {
        const originalName = Buffer.from(file.originalname, 'latin1').toString('utf8');
        const safeName = originalName.replace(/\s+/g, '_');
        cb(null, safeName);
    }
});

const uploadDoc = multer({ storage: documentStorage });

// ========== ПРОВЕРКА ПАРОЛЯ ДЛЯ АДМИН-ПАНЕЛИ ==========
router.post('/admin/check', async (req, res) => {
    const { password } = req.body;
    if (password === process.env.ADMIN_PASSWORD) {
        res.json({ success: true });
    } else {
        res.status(401).json({ success: false });
    }
});

// ========== КВАЛИФИКАЦИЯ ==========
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

// ========== ДОКУМЕНТЫ ==========
router.get('/documents/list', async (req, res) => {
    try {
        const [documents] = await db.query(
            'SELECT id_doc, doc_key, doc_name, file_name, file_path FROM public_documents ORDER BY id_doc'
        );
        res.json(documents);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка получения документов' });
    }
});

router.post('/documents/upload', uploadDoc.single('file'), async (req, res) => {
    const { doc_key } = req.body;
    const file = req.file;
    
    if (!file || !doc_key) {
        return res.status(400).json({ error: 'Не все поля заполнены' });
    }
    
    try {
        const originalName = Buffer.from(file.originalname, 'latin1').toString('utf8');
        const safeName = originalName.replace(/\s+/g, '_');
        const filePath = `/documents/${encodeURIComponent(safeName)}`;
        
        await db.query(
            'UPDATE public_documents SET file_name = ?, file_path = ?, updated_at = NOW() WHERE doc_key = ?',
            [safeName, filePath, doc_key]
        );
        res.json({ success: true, filePath });
    } catch (error) {
        console.error('Ошибка при замене документа:', error);
        res.status(500).json({ error: 'Ошибка сохранения документа' });
    }
});

router.post('/documents/add', uploadDoc.single('file'), async (req, res) => {
    const { doc_key, doc_name } = req.body;
    const file = req.file;
    
    if (!file || !doc_key || !doc_name) {
        return res.status(400).json({ error: 'Не все поля заполнены' });
    }
    
    try {
        const [existing] = await db.query(
            'SELECT id_doc FROM public_documents WHERE doc_key = ?',
            [doc_key]
        );
        if (existing.length > 0) {
            return res.status(400).json({ error: 'Документ с таким doc_key уже существует' });
        }
        
        const originalName = Buffer.from(file.originalname, 'latin1').toString('utf8');
        const safeName = originalName.replace(/\s+/g, '_');
        const filePath = `/documents/${encodeURIComponent(safeName)}`;
        
        await db.query(
            `INSERT INTO public_documents (doc_key, doc_name, file_name, file_path) VALUES (?, ?, ?, ?)`,
            [doc_key, doc_name, safeName, filePath]
        );
        res.json({ success: true });
    } catch (error) {
        console.error('Ошибка при добавлении документа:', error);
        res.status(500).json({ error: 'Ошибка добавления документа' });
    }
});

router.delete('/documents/delete/:doc_key', async (req, res) => {
    const { doc_key } = req.params;
    try {
        const [doc] = await db.query(
            'SELECT file_path FROM public_documents WHERE doc_key = ?',
            [doc_key]
        );
        
        await db.query('DELETE FROM public_documents WHERE doc_key = ?', [doc_key]);
        
        if (doc.length > 0 && doc[0].file_path) {
            const fileName = decodeURIComponent(doc[0].file_path.replace('/documents/', ''));
            const filePath = path.join(documentsDir, fileName);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }
        
        res.json({ success: true });
    } catch (error) {
        console.error('Ошибка при удалении документа:', error);
        res.status(500).json({ error: 'Ошибка удаления документа' });
    }
});

module.exports = router;