import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

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
      if (userData.role === 'admin') navigate('/admin');
      else navigate('/cabinet');
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
          <button onClick={handleLeaveRequest} className="btn-primary btn-white">Оставить заявку <i className="fas fa-arrow-right"></i></button>
        </div>
      </section>

      <section className="contact" id="contact">
        <div className="container contact-wrapper">
          <div className="contact-info">
            <h2>Контакты</h2>
            <p>Есть вопросы? Напишите или позвоните — я отвечу в ближайшее время</p>
            <div className="contact-detail"><i className="fas fa-phone-alt"></i> <span>+7 (906) 185-96-69</span></div>
            <div className="contact-detail"><i className="fas fa-envelope"></i> <span>bakalenko-olga@yandex.ru</span></div>
            <div className="contact-detail"><i className="fas fa-map-marker-alt"></i> <span>Работаю онлайн по всей России</span></div>
            <div className="contact-detail hours"><i className="fas fa-clock"></i> <span>Пн–Пт: 9:00 – 17:00</span></div>
            <div className="privacy-link"><Link to="/privacy">Политика конфиденциальности</Link></div>
          </div>
          <div className="contact-form">
            <form onSubmit={handleSubmit}>
              <input type="text" value={feedbackName} onChange={(e) => setFeedbackName(e.target.value)} placeholder="Ваше имя" />
              <input type="email" value={feedbackEmail} onChange={(e) => setFeedbackEmail(e.target.value)} placeholder="Ваш Email" />
              <textarea rows="3" value={feedbackMessage} onChange={(e) => setFeedbackMessage(e.target.value)} placeholder="Ваш вопрос"></textarea>
              <div className="checkbox-wrapper">
                <input type="checkbox" id="feedbackAgreement" checked={feedbackAgreement} onChange={(e) => setFeedbackAgreement(e.target.checked)} />
                <label htmlFor="feedbackAgreement">Я принимаю условия <Link to="/privacy" target="_blank">Политики конфиденциальности</Link> и даю согласие на обработку персональных данных</label>
              </div>
              <button type="submit">Отправить вопрос <i className="fas fa-arrow-right"></i></button>
            </form>
            {feedbackResult && <div className="feedback-result">{feedbackResult}</div>}
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