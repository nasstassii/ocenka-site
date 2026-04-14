import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Footer() {
  const [feedbackName, setFeedbackName] = useState('');
  const [feedbackEmail, setFeedbackEmail] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackAgreement, setFeedbackAgreement] = useState(false);
  const [feedbackResult, setFeedbackResult] = useState('');
  const navigate = useNavigate();

  const handleLeaveRequest = () => {
    const user = sessionStorage.getItem('cabinet_user');
    if (user) {
      const userData = JSON.parse(user);
      if (userData.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/cabinet');
      }
    } else {
      const openAuthBtn = document.querySelector('.btn-open-auth');
      if (openAuthBtn) openAuthBtn.click();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!feedbackName || !feedbackEmail) {
      setFeedbackResult('Укажите имя и email');
      setTimeout(() => setFeedbackResult(''), 3000);
      return;
    }
    if (!feedbackAgreement) {
      setFeedbackResult('Необходимо согласие на обработку персональных данных');
      setTimeout(() => setFeedbackResult(''), 3000);
      return;
    }
    setFeedbackResult('Спасибо! Ваш вопрос отправлен.');
    setFeedbackName('');
    setFeedbackEmail('');
    setFeedbackMessage('');
    setFeedbackAgreement(false);
    setTimeout(() => setFeedbackResult(''), 3000);
  };

  return (
    <>
      <section className="cta-banner">
        <div className="container">
          <h3>Нужна оценка имущества?</h3>
          <p>Оставьте заявку — я рассчитаю стоимость и сроки в течение часа</p>
          <button onClick={handleLeaveRequest} className="btn-primary" style={{ background: 'white', color: 'var(--blue)', border: 'none', cursor: 'pointer' }}>
            Оставить заявку <i className="fas fa-arrow-right"></i>
          </button>
        </div>
      </section>

      <section className="contact" id="contact">
        <div className="container contact-wrapper">
          <div className="contact-info" style={{ flex: '1.2' }}>
            <h2>Контакты</h2>
            <p>Есть вопросы? Напишите или позвоните — я отвечу в ближайшее время</p>
            <div className="contact-detail"><i className="fas fa-phone-alt"></i> <span>+7 (906) 185-96-69</span></div>
            <div className="contact-detail"><i className="fas fa-envelope"></i> <span>bakalenko-olga@yandex.ru</span></div>
            <div className="contact-detail"><i className="fas fa-map-marker-alt"></i> <span>Работаю онлайн по всей России</span></div>
            <div className="contact-detail hours"><i className="fas fa-clock"></i> <span>Пн–Пт: 9:00 – 17:00</span></div>
          </div>
          <div className="contact-form" style={{ flex: '0.8' }}>
            <form onSubmit={handleSubmit}>
              <input type="text" value={feedbackName} onChange={(e) => setFeedbackName(e.target.value)} placeholder="Ваше имя" />
              <input type="email" value={feedbackEmail} onChange={(e) => setFeedbackEmail(e.target.value)} placeholder="Ваш Email" />
              <textarea rows="3" value={feedbackMessage} onChange={(e) => setFeedbackMessage(e.target.value)} placeholder="Ваш вопрос"></textarea>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
                <input 
                  type="checkbox" 
                  id="feedbackAgreement"
                  checked={feedbackAgreement} 
                  onChange={(e) => setFeedbackAgreement(e.target.checked)} 
                  style={{ width: '18px', height: '18px', cursor: 'pointer', margin: 0 }}
                />
                <label htmlFor="feedbackAgreement" style={{ fontSize: '0.8rem', color: 'var(--text-muted)', cursor: 'pointer', margin: 0 }}>
                  Я соглашаюсь на <a href="#" style={{ color: 'var(--blue)' }}>обработку персональных данных</a>
                </label>
              </div>
              
              <button type="submit">Отправить вопрос <i className="fas fa-arrow-right"></i></button>
            </form>
            {feedbackResult && <div style={{ marginTop: '1rem', fontSize: '0.8rem', color: 'var(--green)' }}>{feedbackResult}</div>}
          </div>
        </div>
      </section>

      <footer>
        <div className="container">
          <p>© 2026 Ольга Бакаленко — Частнопрактикующий оценщик недвижимости и движимого имущества</p>
        </div>
      </footer>
    </>
  );
}

export default Footer;