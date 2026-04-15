import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function RequestModal({ isOpen, onClose, userId, onSuccess }) {
  const [formData, setFormData] = useState({
    name: '', client_type: '', project_type: '', has_restrictions: false, purpose: '', description: '', agreement: false
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!formData.name) { setError('Укажите название объекта'); return; }
    if (!formData.client_type) { setError('Укажите тип заказчика'); return; }
    if (!formData.project_type) { setError('Укажите объект оценки'); return; }
    if (!formData.purpose) { setError('Укажите цель оценки'); return; }
    if (!formData.agreement) { setError('Необходимо согласие на обработку персональных данных'); return; }

    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          users_id_user: userId,
          name: formData.name,
          client_type: formData.client_type,
          project_type: formData.project_type,
          has_restrictions: formData.has_restrictions ? 1 : 0,
          purpose: formData.purpose,
          description: formData.description
        })
      });
      const data = await response.json();
      if (data.success) {
        onSuccess();
        onClose();
        setFormData({ name: '', client_type: '', project_type: '', has_restrictions: false, purpose: '', description: '', agreement: false });
      } else {
        setError(data.error || 'Ошибка создания заявки');
      }
    } catch (err) {
      setError('Ошибка подключения к серверу');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="auth-overlay">
      <div className="auth-modal" style={{ maxWidth: '600px', width: '90%' }}>
        <button className="close-auth" onClick={onClose}>&times;</button>
        <h3 style={{ marginBottom: '16px', color: 'var(--blue)' }}>Новая заявка на оценку</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Название объекта*"
            value={formData.name}
            onChange={handleChange}
            disabled={isLoading}
            style={{ width: '100%', marginBottom: '16px', padding: '12px 16px', borderRadius: '30px', border: '1px solid var(--border)', fontFamily: 'Inter, sans-serif', fontSize: '14px' }}
          />

          <select
            name="client_type"
            value={formData.client_type}
            onChange={handleChange}
            disabled={isLoading}
            style={{ width: '100%', marginBottom: '16px', padding: '12px 16px', borderRadius: '30px', border: '1px solid var(--border)', fontFamily: 'Inter, sans-serif', fontSize: '14px', background: 'white' }}
          >
            <option value="">Заказчик*</option>
            <option value="Юридическое лицо">Юридическое лицо</option>
            <option value="Физическое лицо">Физическое лицо</option>
          </select>

          <select
            name="project_type"
            value={formData.project_type}
            onChange={handleChange}
            disabled={isLoading}
            style={{ width: '100%', marginBottom: '16px', padding: '12px 16px', borderRadius: '30px', border: '1px solid var(--border)', fontFamily: 'Inter, sans-serif', fontSize: '14px', background: 'white' }}
          >
            <option value="">Объект оценки*</option>
            <option value="жилое помещение/здание">Жилое помещение/здание</option>
            <option value="нежилое помещение/здание">Нежилое помещение/здание</option>
            <option value="сооружение">Сооружение</option>
            <option value="земельный участок">Земельный участок</option>
            <option value="транспортное средство">Транспортное средство</option>
            <option value="оборудование">Оборудование</option>
          </select>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <input
              type="checkbox"
              name="has_restrictions"
              id="has_restrictions"
              checked={formData.has_restrictions}
              onChange={handleChange}
              disabled={isLoading}
              style={{ width: '18px', height: '18px', cursor: 'pointer', margin: 0 }}
            />
            <label htmlFor="has_restrictions" style={{ fontSize: '14px', color: 'var(--text-muted)', cursor: 'pointer', margin: 0 }}>
              Есть ограничения, обременения, аресты
            </label>
          </div>

          <select
            name="purpose"
            value={formData.purpose}
            onChange={handleChange}
            disabled={isLoading}
            style={{ width: '100%', marginBottom: '16px', padding: '12px 16px', borderRadius: '30px', border: '1px solid var(--border)', fontFamily: 'Inter, sans-serif', fontSize: '14px', background: 'white' }}
          >
            <option value="">Цель оценки*</option>
            <option value="реализация имущества путем проведения торгов">Реализация имущества путем проведения торгов</option>
            <option value="реализация имущества без проведения торгов">Реализация имущества без проведения торгов</option>
            <option value="приватизация">Приватизация</option>
            <option value="при вступлении в наследство">При вступлении в наследство</option>
            <option value="для органов опеки">Для органов опеки</option>
            <option value="для суда">Для суда</option>
          </select>

          <textarea
            name="description"
            rows="3"
            placeholder="Дополнительное описание"
            value={formData.description}
            onChange={handleChange}
            disabled={isLoading}
            style={{ width: '100%', marginBottom: '16px', padding: '12px 16px', borderRadius: '20px', border: '1px solid var(--border)', fontFamily: 'Inter, sans-serif', fontSize: '14px', resize: 'vertical' }}
          />

          {/* ЧЕКБОКС С СОГЛАСИЕМ НА ОБРАБОТКУ ПЕРСОНАЛЬНЫХ ДАННЫХ */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <input
              type="checkbox"
              name="agreement"
              id="modalAgreement"
              checked={formData.agreement}
              onChange={handleChange}
              disabled={isLoading}
              style={{ width: '18px', height: '18px', cursor: 'pointer', margin: 0 }}
            />
            <label htmlFor="modalAgreement" style={{ fontSize: '13px', color: 'var(--text-muted)', cursor: 'pointer', margin: 0 }}>
              Я принимаю условия <Link to="/privacy" target="_blank" style={{ color: 'var(--blue)' }}>Политики конфиденциальности</Link> и даю согласие на обработку персональных данных
            </label>
          </div>

          {error && <div style={{ color: '#c44', fontSize: '13px', marginBottom: '16px' }}>{error}</div>}

          <div style={{ display: 'flex', gap: '16px' }}>
            <button type="submit" disabled={isLoading} style={{ flex: 1, padding: '12px', borderRadius: '30px', border: 'none', background: 'var(--blue)', color: 'white', cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontWeight: '600' }}>
              {isLoading ? 'Отправка...' : 'Отправить заявку'}
            </button>
            <button type="button" onClick={onClose} style={{ flex: 1, padding: '12px', borderRadius: '30px', border: '1px solid var(--border)', background: 'white', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
              Отмена
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RequestModal;