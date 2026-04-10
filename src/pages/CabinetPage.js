import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function CabinetPage() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('requests');
  const [profileName, setProfileName] = useState('');
  const [profileEmail, setProfileEmail] = useState('');
  const [profilePhone, setProfilePhone] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [selectedRating, setSelectedRating] = useState(0);
  const [reviewResult, setReviewResult] = useState('');
  const [emailError, setEmailError] = useState('');
  const navigate = useNavigate();

  // ОДНА заявка для клиента
  const [requests, setRequests] = useState([
    { 
      id: 1, 
      object: 'Торговый центр "Заря"', 
      date: '2025-04-08', 
      customer: 'Физическое лицо', 
      type: 'нежилое помещение/здание', 
      purpose: 'для суда', 
      desc: 'Оценка для судебного разбирательства', 
      status: 'waiting_docs', 
      adminComment: 'Необходимо предоставить выписку из ЕГРН и технический паспорт' 
    }
  ]);

  useEffect(() => {
    const userData = sessionStorage.getItem('cabinet_user');
    if (!userData) {
      navigate('/');
      return;
    }
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    setProfileName(parsedUser.name || '');
    setProfileEmail(parsedUser.email || '');
    
    // Загружаем телефон из localStorage
    const savedPhone = localStorage.getItem(`user_phone_${parsedUser.email}`);
    setProfilePhone(savedPhone || '');
  }, [navigate]);

  // Валидация email
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  // Форматирование телефона при вводе (маска)
  const handlePhoneChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);
    let formatted = '';
    if (value.length > 0) formatted = '+7';
    if (value.length > 1) formatted = '+7 (' + value.slice(1, 4);
    if (value.length > 4) formatted = '+7 (' + value.slice(1, 4) + ') ' + value.slice(4, 7);
    if (value.length > 7) formatted = '+7 (' + value.slice(1, 4) + ') ' + value.slice(4, 7) + '-' + value.slice(7, 9);
    if (value.length > 9) formatted = '+7 (' + value.slice(1, 4) + ') ' + value.slice(4, 7) + '-' + value.slice(7, 9) + '-' + value.slice(9, 11);
    setProfilePhone(formatted);
  };

  // Валидация email при вводе
  const handleEmailChange = (e) => {
    const email = e.target.value;
    setProfileEmail(email);
    if (email && !validateEmail(email)) {
      setEmailError('Введите корректный email (пример: name@domain.ru)');
    } else {
      setEmailError('');
    }
  };

  const saveProfile = () => {
    if (!validateEmail(profileEmail)) {
      setEmailError('Введите корректный email');
      return;
    }
    
    if (user) {
      // Обновляем имя и email пользователя
      const updatedUser = { ...user, name: profileName, email: profileEmail };
      sessionStorage.setItem('cabinet_user', JSON.stringify(updatedUser));
      
      // Обновляем в списке пользователей
      const users = JSON.parse(localStorage.getItem('bakalenko_users') || '[]');
      const userIndex = users.findIndex(u => u.email === user.email);
      if (userIndex !== -1) {
        users[userIndex].name = profileName;
        users[userIndex].email = profileEmail;
        localStorage.setItem('bakalenko_users', JSON.stringify(users));
      }
      
      localStorage.setItem(`user_phone_${profileEmail}`, profilePhone);
      alert('Профиль сохранён');
      setUser(updatedUser);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('cabinet_user');
    navigate('/');
  };

  const submitReview = () => {
    if (!reviewText.trim()) {
      setReviewResult('Напишите текст отзыва');
      return;
    }
    const savedReviews = localStorage.getItem('site_reviews');
    const reviews = savedReviews ? JSON.parse(savedReviews) : [];
    reviews.unshift({
      author: profileName,
      text: reviewText,
      rating: selectedRating || 5,
      date: new Date().toISOString()
    });
    localStorage.setItem('site_reviews', JSON.stringify(reviews.slice(0, 10)));
    setReviewResult('Спасибо за ваш отзыв!');
    setReviewText('');
    setSelectedRating(0);
    setTimeout(() => setReviewResult(''), 3000);
  };

  const uploadDoc = (id) => {
    alert(`Функция загрузки документа для заявки №${id}`);
  };

  const getStatusText = (status) => {
    const map = {
      new: 'Новая',
      work: 'В работе',
      waiting_docs: 'Ожидает документов',
      waiting_payment: 'Ожидает оплаты',
      report_ready: 'Отчет загружен'
    };
    return map[status] || status;
  };

  if (!user) return null;

  return (
    <>
      <div className="cabinet-header">
        <div className="container header-inner">
          <div className="logo-cabinet">
            <a href="/">Ольга Бакаленко</a>
            <span>личный кабинет клиента</span>
          </div>
          <div className="user-info">
            <span className="user-email">{user.email}</span>
            <button className="logout-btn" onClick={handleLogout}><i className="fas fa-sign-out-alt"></i> Выйти</button>
            <a href="/" className="back-link"><i className="fas fa-arrow-left"></i> На сайт</a>
          </div>
        </div>
      </div>

      <main className="cabinet-main">
        <div className="container">
          <div className="page-title">
            <h1>Личный кабинет</h1>
          </div>
          
          <div className="profile-section">
            <h3>Редактирование профиля</h3>
            <div className="profile-form">
              <input 
                type="text" 
                value={profileName} 
                onChange={(e) => setProfileName(e.target.value)} 
                placeholder="Ваше ФИО" 
              />
              <input 
                type="email" 
                value={profileEmail} 
                onChange={handleEmailChange}
                placeholder="Email" 
                style={{ borderColor: emailError ? '#c44' : 'var(--border)' }}
              />
              {emailError && <span style={{ color: '#c44', fontSize: '0.7rem', marginTop: '-0.5rem' }}>{emailError}</span>}
              <input 
                type="tel" 
                value={profilePhone} 
                onChange={handlePhoneChange}
                placeholder="+7 (___) ___-__-__" 
              />
              <button onClick={saveProfile}>Сохранить изменения</button>
            </div>
          </div>
          
          <div className="cabinet-tabs">
            <button className={`tab-btn ${activeTab === 'requests' ? 'active' : ''}`} onClick={() => setActiveTab('requests')}>Мои заявки</button>
            <button className={`tab-btn ${activeTab === 'review' ? 'active' : ''}`} onClick={() => setActiveTab('review')}>Оставить отзыв</button>
            <button className={`tab-btn ${activeTab === 'contract' ? 'active' : ''}`} onClick={() => setActiveTab('contract')}>Договор</button>
          </div>
          
          <div className={`cabinet-panel ${activeTab === 'requests' ? 'active' : ''}`}>
            <div className="panel-header">
              <h3>Мои заявки</h3>
              <button className="add-btn">+ Новая заявка</button>
            </div>
            {requests.map(req => (
              <div key={req.id} className="request-card">
                <div className="request-header">
                  <span className="request-object">{req.object}</span>
                  <span className="status">{getStatusText(req.status)}</span>
                </div>
                <div className="request-details">
                  <p><strong>Дата:</strong> {req.date}</p>
                  <p><strong>Заказчик:</strong> {req.customer}</p>
                  <p><strong>Объект оценки:</strong> {req.type}</p>
                  <p><strong>Ограничения:</strong> Нет</p>
                  <p><strong>Цель оценки:</strong> {req.purpose}</p>
                  <p><strong>Описание:</strong> {req.desc}</p>
                  <div className="admin-comment">
                    <i className="fas fa-comment-dots"></i> <strong>Комментарий оценщика:</strong> {req.adminComment}
                  </div>
                  <div className="file-section">
                    <span>Мои документы:</span>
                    <button className="file-btn" onClick={() => uploadDoc(req.id)}>
                      <i className="fas fa-upload"></i> Загрузить документ
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className={`cabinet-panel ${activeTab === 'review' ? 'active' : ''}`}>
            <div className="panel-header">
              <h3>Оставить отзыв</h3>
            </div>
            <textarea 
              value={reviewText} 
              onChange={(e) => setReviewText(e.target.value)} 
              rows="4" 
              placeholder="Напишите ваш отзыв о работе оценщика..." 
              style={{ width: '100%', padding: '12px', borderRadius: '20px', border: '1px solid var(--border)', marginBottom: '8px', fontFamily: 'Inter, sans-serif', resize: 'vertical' }}
            />
            <div className="star-rating">
              {[1,2,3,4,5].map(star => (
                <i key={star} className={`fas fa-star ${selectedRating >= star ? 'active' : ''}`} onClick={() => setSelectedRating(star)} style={{ cursor: 'pointer' }}></i>
              ))}
            </div>
            <button onClick={submitReview} className="btn-primary">Отправить отзыв</button>
            {reviewResult && <div style={{ marginTop: '1rem', fontSize: '0.8rem', color: 'var(--green)' }}>{reviewResult}</div>}
          </div>
          
          <div className={`cabinet-panel ${activeTab === 'contract' ? 'active' : ''}`}>
            <div className="panel-header">
              <h3>Договор на оказание оценочных услуг</h3>
            </div>
            <p style={{ marginBottom: '1rem' }}>Здесь вы можете ознакомиться с шаблоном договора</p>
            <button className="btn-primary" style={{ background: 'var(--blue)', color: 'white', border: 'none', padding: '8px 20px', borderRadius: '30px', cursor: 'pointer' }}>
              <i className="fas fa-download"></i> Скачать договор
            </button>
          </div>
        </div>
      </main>

      <footer>
        <div className="container">
          <p>© 2026 Ольга Бакаленко — Частнопрактикующий оценщик недвижимости и движимого имущества</p>
        </div>
      </footer>
    </>
  );
}

export default CabinetPage;