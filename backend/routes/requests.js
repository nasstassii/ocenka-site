const express = require('express');
const path = require('path');
const fs = require('fs');
const db = require('../db');
const { sendToAdmin, sendToClient } = require('../config/mailer');
const { authMiddleware, adminOnly } = require('../middleware/auth');

const router = express.Router();

// ПОЛУЧИТЬ ВСЕ ЗАЯВКИ (только админ)
router.get('/', authMiddleware, adminOnly, async (req, res) => {
    try {
        const [requests] = await db.query(`
            SELECT r.*, u.fio as client_name, u.email as client_email, u.phone as client_phone
            FROM requests r
            JOIN users u ON r.users_id_user = u.id_user
            ORDER BY r.created_at DESC
        `);
        res.json(requests);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка получения заявок' });
    }
});

// ПОЛУЧИТЬ ЗАЯВКИ ПОЛЬЗОВАТЕЛЯ
router.get('/user/:userId', authMiddleware, async (req, res) => {
    const { userId } = req.params;
    
    if (req.user.id != userId && req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Доступ запрещён' });
    }
    
    try {
        const [requests] = await db.query(
            'SELECT * FROM requests WHERE users_id_user = ? ORDER BY created_at DESC',
            [userId]
        );
        res.json(requests);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка получения заявок' });
    }
});

// СОЗДАТЬ ЗАЯВКУ
router.post('/', authMiddleware, async (req, res) => {
    const { users_id_user, name, client_type, project_type, has_restrictions, purpose, description } = req.body;
    
    if (req.user.id != users_id_user && req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Доступ запрещён' });
    }

    try {
        const [result] = await db.query(
            `INSERT INTO requests 
            (users_id_user, name, client_type, project_type, has_restrictions, purpose, description, status) 
            VALUES (?, ?, ?, ?, ?, ?, ?, 'new')`,
            [users_id_user, name, client_type, project_type, has_restrictions || 0, purpose, description]
        );
        
        const [users] = await db.query('SELECT fio, email, phone FROM users WHERE id_user = ?', [users_id_user]);
        
        if (users.length > 0) {
            await sendToAdmin('new_request', {
                clientName: users[0].fio,
                clientEmail: users[0].email,
                clientPhone: users[0].phone,
                objectName: name,
                clientType: client_type,
                projectType: project_type,
                purpose: purpose,
                description: description
            });
        }
        
        res.json({ success: true, id: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка создания заявки' });
    }
});

// ОБНОВИТЬ СТАТУС (только админ)
router.put('/:id/status', authMiddleware, adminOnly, async (req, res) => {
    const { id } = req.params;
    const { status, admin_comment } = req.body;

    try {
        const [requests] = await db.query(
            `SELECT r.*, u.fio as client_name, u.email as client_email 
             FROM requests r
             JOIN users u ON r.users_id_user = u.id_user
             WHERE r.id_req = ?`,
            [id]
        );
        
        await db.query(
            'UPDATE requests SET status = ?, admin_comment = ? WHERE id_req = ?',
            [status, admin_comment, id]
        );
        
        if (requests.length > 0) {
            await sendToClient('status_changed', {
                clientEmail: requests[0].client_email,
                requestName: requests[0].name,
                newStatus: status,
                comment: admin_comment
            });
        }
        
        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка обновления статуса' });
    }
});

// УДАЛИТЬ ЗАЯВКУ (только админ)
router.delete('/:id', authMiddleware, adminOnly, async (req, res) => {
    const { id } = req.params;

    try {
        const [files] = await db.query('SELECT file_path FROM documents WHERE requests_id_req = ?', [id]);
        const uploadDir = path.join(__dirname, '..', 'uploads');
        for (const file of files) {
            const filePath = path.join(uploadDir, file.file_path);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }
        await db.query('DELETE FROM documents WHERE requests_id_req = ?', [id]);
        await db.query('DELETE FROM requests WHERE id_req = ?', [id]);
        
        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка удаления заявки' });
    }
});

module.exports = router;