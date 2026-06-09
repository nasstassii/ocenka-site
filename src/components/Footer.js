import React, { useState } from 'react';
import EmailSelector from './EmailSelector';
import { Link } from 'react-router-dom';

function Footer() {
  const openPhone = () => {
    window.location.href = 'tel:+79061859669';
  };

  return (
    <>
      <section className="cta-banner">
        <div className="container">
          <h3>Нужна оценка имущества?</h3>
          <p>Оставьте заявку — я рассчитаю стоимость и сроки в течение часа</p>
          <EmailSelector buttonText="Заказать оценку" className="btn-primary btn-white" />
        </div>
      </section>

      <section className="contact" id="contact">
        <div className="container">
          <div className="contact-flex">
            <div className="contact-col">
              <h3>Контакты</h3>
              <div className="contact-detail">
                <i className="fas fa-phone-alt"></i>
                <button onClick={openPhone} className="contact-phone-btn">+7 (906) 185-96-69</button>
              </div>
              <div className="contact-detail">
                <i className="fas fa-envelope"></i>
                <EmailSelector buttonText="bakalenko-olga@yandex.ru" className="contact-email-btn" />
              </div>
            </div>
            <div className="contact-col">
              <h3>Режим работы</h3>
              <div className="contact-detail">
                <i className="fas fa-clock"></i>
                <span>Пн–Пт: 9:00 – 17:00</span>
              </div>
              <div className="contact-detail">
                <i className="fas fa-map-marker-alt"></i>
                <span>Работаю онлайн по всей России</span>
              </div>
            </div>
            <div className="contact-col">
              <h3>Информация</h3>
              <div className="contact-detail">
                <i className="fas fa-shield-alt"></i>
                <Link to="/privacy" target="_blank" rel="noopener noreferrer">Политика конфиденциальности</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer>
        <div className="container">
          <p>© 2026 Ольга Бакаленко — Частнопрактикующий оценщик</p>
        </div>
      </footer>
    </>
  );
}

export default Footer;