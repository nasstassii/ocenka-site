const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('../db');
const { sendToAdmin, sendToClient } = require('../config/mailer');

const router = express.Router();

const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Настройка multer для правильной обработки русских имён
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // Получаем имя файла в правильной кодировке
        const originalName = Buffer.from(file.originalname, 'latin1').toString('utf8');
        // Заменяем пробелы на подчеркивания
        const safeName = originalName.replace(/\s/g, '_');
        const uniqueName = Date.now() + '_' + safeName;
        cb(null, uniqueName);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Неподдерживаемый формат файла'), false);
        }
    }
});

// Загрузить файл
router.post('/:requestId/:type', upload.single('file'), async (req, res) => {
    const { requestId, type } = req.params;
    const { uploaded_by } = req.body;

    if (!req.file) {
        return res.status(400).json({ error: 'Файл не загружен' });
    }

    try {
        const filePath = req.file.filename;
        // Получаем оригинальное имя файла в правильной кодировке
        const fileName = Buffer.from(req.file.originalname, 'latin1').toString('utf8');

        const [requests] = await db.query(
            `SELECT r.*, u.fio as client_name, u.email as client_email, u.phone as client_phone
             FROM requests r
             JOIN users u ON r.users_id_user = u.id_user
             WHERE r.id_req = ?`,
            [requestId]
        );

        const [result] = await db.query(
            'INSERT INTO documents (requests_id_req, file_name, file_path, uploaded_by, file_type) VALUES (?, ?, ?, ?, ?)',
            [requestId, fileName, filePath, uploaded_by, type]
        );

        if (requests.length > 0) {
            if (uploaded_by === 'client') {
                if (type === 'contract_signed') {
                    await sendToAdmin('signed_contract', {
                        clientName: requests[0].client_name,
                        clientEmail: requests[0].client_email,
                        requestName: requests[0].name,
                        fileName: fileName
                    });
                } else {
                    await sendToAdmin('new_document', {
                        clientName: requests[0].client_name,
                        clientEmail: requests[0].client_email,
                        requestName: requests[0].name,
                        fileName: fileName
                    });
                }
            } else if (uploaded_by === 'admin') {
                await sendToClient('new_document', {
                    clientEmail: requests[0].client_email,
                    requestName: requests[0].name,
                    documentType: type,
                    fileName: fileName
                });
            }
        }

        res.json({ success: true, fileId: result.insertId, fileName: fileName });
    } catch (error) {
        console.error('Ошибка загрузки файла:', error);
        res.status(500).json({ error: 'Ошибка загрузки файла' });
    }
});

// Получить файлы
router.get('/:requestId/:type', async (req, res) => {
    const { requestId, type } = req.params;

    try {
        const [files] = await db.query(
            'SELECT id_doc, file_name, file_path, uploaded_by, date_add FROM documents WHERE requests_id_req = ? AND file_type = ? ORDER BY date_add DESC',
            [requestId, type]
        );
        res.json(files);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка получения файлов' });
    }
});

// Скачать файл
router.get('/download/:fileId', async (req, res) => {
    const { fileId } = req.params;

    try {
        const [files] = await db.query('SELECT file_name, file_path FROM documents WHERE id_doc = ?', [fileId]);
        
        if (files.length === 0) {
            return res.status(404).json({ error: 'Файл не найден' });
        }
        
        const file = files[0];
        const filePath = path.join(uploadDir, file.file_path);
        
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ error: 'Файл не найден на сервере' });
        }
        
        // Отправляем файл с правильным русским именем
        res.setHeader('Content-Type', 'application/octet-stream');
        res.setHeader('Content-Disposition', `attachment; filename*=UTF-8''${encodeURIComponent(file.file_name)}`);
        
        const fileStream = fs.createReadStream(filePath);
        fileStream.pipe(res);
        
    } catch (error) {
        console.error('Ошибка скачивания файла:', error);
        res.status(500).json({ error: 'Ошибка скачивания файла' });
    }
});

// Удалить файл
router.delete('/:fileId', async (req, res) => {
    const { fileId } = req.params;

    try {
        const [files] = await db.query('SELECT file_path FROM documents WHERE id_doc = ?', [fileId]);
        
        if (files.length > 0) {
            const filePath = path.join(uploadDir, files[0].file_path);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
            await db.query('DELETE FROM documents WHERE id_doc = ?', [fileId]);
        }
        
        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка удаления файла' });
    }
});

module.exports = router;