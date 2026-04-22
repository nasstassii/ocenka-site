const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    host: 'smtp.yandex.ru',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Отправка уведомления АДМИНУ
async function sendToAdmin(type, data) {
    const adminEmail = process.env.EMAIL_USER;
    
    let subject = '';
    let html = '';
    
    if (type === 'new_request') {
        subject = `Новая заявка на оценку: ${data.objectName}`;
        html = `
            <h2>Новая заявка на оценку</h2>
            <p><strong>Клиент:</strong> ${data.clientName} (${data.clientEmail})</p>
            <p><strong>Телефон:</strong> ${data.clientPhone || 'не указан'}</p>
            <p><strong>Объект:</strong> ${data.objectName}</p>
            <p><strong>Тип заказчика:</strong> ${data.clientType}</p>
            <p><strong>Объект оценки:</strong> ${data.projectType}</p>
            <p><strong>Цель оценки:</strong> ${data.purpose}</p>
            <p><strong>Описание:</strong> ${data.description || '—'}</p>
            <p><strong>Дата создания:</strong> ${new Date().toLocaleString()}</p>
            <hr>
            <p><a href="http://localhost:5000">Перейти на сайт</a></p>
        `;
    }
    
    if (type === 'new_document') {
        subject = `Новый документ от клиента: ${data.clientName}`;
        html = `
            <h2>Клиент загрузил новый документ</h2>
            <p><strong>Клиент:</strong> ${data.clientName} (${data.clientEmail})</p>
            <p><strong>Заявка:</strong> ${data.requestName}</p>
            <p><strong>Загруженный файл:</strong> ${data.fileName}</p>
            <p><strong>Дата загрузки:</strong> ${new Date().toLocaleString()}</p>
            <hr>
            <p><a href="http://localhost:5000">Перейти на сайт</a></p>
        `;
    }
    
    if (type === 'signed_contract') {
        subject = `Подписанный договор от клиента: ${data.clientName}`;
        html = `
            <h2>Клиент загрузил подписанный договор</h2>
            <p><strong>Клиент:</strong> ${data.clientName} (${data.clientEmail})</p>
            <p><strong>Заявка:</strong> ${data.requestName}</p>
            <p><strong>Загруженный файл:</strong> ${data.fileName}</p>
            <p><strong>Дата загрузки:</strong> ${new Date().toLocaleString()}</p>
            <hr>
            <p><a href="http://localhost:5000">Перейти на сайт</a></p>
        `;
    }
    
    try {
        await transporter.sendMail({
            from: `"Ольга Бакаленко" <${process.env.EMAIL_USER}>`,
            to: adminEmail,
            subject: subject,
            html: html
        });
        console.log(`Уведомление админу отправлено: ${subject}`);
    } catch (error) {
        console.error('Ошибка отправки письма админу:', error.message);
    }
}

// Отправка уведомления КЛИЕНТУ
async function sendToClient(type, data) {
    let subject = '';
    let html = '';
    
    if (type === 'status_changed') {
        const statusMessages = {
            'new': 'Новая',
            'work': 'В работе',
            'waiting_docs': 'Ожидает документов',
            'waiting_payment': 'Ожидает оплаты',
            'report_ready': 'Завершено'
        };
        
        subject = `Статус заявки "${data.requestName}" изменён`;
        html = `
            <h2>Статус вашей заявки изменён</h2>
            <p><strong>Заявка:</strong> ${data.requestName}</p>
            <p><strong>Новый статус:</strong> ${statusMessages[data.newStatus] || data.newStatus}</p>
            ${data.comment ? `<p><strong>Комментарий оценщика:</strong> ${data.comment}</p>` : ''}
            <p><strong>Дата обновления:</strong> ${new Date().toLocaleString()}</p>
            <hr>
            <p><a href="http://localhost:5000">Перейти на сайт</a></p>
        `;
    }
    
    if (type === 'new_document') {
        const docName = data.documentType === 'contract' ? 'Договор' : 'Итоговый отчёт';
        subject = `Новый документ по заявке "${data.requestName}"`;
        html = `
            <h2>Оценщик загрузил новый документ</h2>
            <p><strong>Заявка:</strong> ${data.requestName}</p>
            <p><strong>Тип документа:</strong> ${docName}</p>
            <p><strong>Название файла:</strong> ${data.fileName}</p>
            <p><strong>Дата загрузки:</strong> ${new Date().toLocaleString()}</p>
            <p>Вы можете скачать документ в личном кабинете.</p>
            <hr>
            <p><a href="http://localhost:5000">Перейти на сайт</a></p>
        `;
    }
    
    try {
        await transporter.sendMail({
            from: `"Ольга Бакаленко" <${process.env.EMAIL_USER}>`,
            to: data.clientEmail,
            subject: subject,
            html: html
        });
        console.log(`Уведомление клиенту отправлено на ${data.clientEmail}: ${subject}`);
    } catch (error) {
        console.error('Ошибка отправки письма клиенту:', error.message);
    }
}

module.exports = { sendToAdmin, sendToClient };