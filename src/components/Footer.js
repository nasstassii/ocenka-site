import React from 'react';

function Footer() {
  const openEmail = () => {
    window.location.href = 'mailto:bakalenko-olga@yandex.ru';
  };

  return (
    <>
      <section className="cta-banner">
        <div className="container">
          <h3>Нужна оценка имущества?</h3>
          <p>Свяжитесь со мной — я рассчитаю стоимость и сроки в течение часа</p>
          <button onClick={openEmail} className="btn-primary btn-white">
            <i className="fas fa-envelope"></i> Написать на почту
          </button>
        </div>
      </section>

      <section className="contact" id="contact">
        <div className="container contact-wrapper">
          <div className="contact-info" style={{ width: '100%', textAlign: 'center' }}>
            <h2>Контакты</h2>
            <p>Свяжитесь со мной любым удобным способом</p>
            <div className="contact-detail">
              <i className="fas fa-phone-alt"></i>
              <span>+7 (906) 185-96-69</span>
            </div>
            <div className="contact-detail">
              <i className="fas fa-envelope"></i>
              <a href="mailto:bakalenko-olga@yandex.ru" style={{ color: 'white', textDecoration: 'none' }}>
                bakalenko-olga@yandex.ru
              </a>
            </div>
            <div className="contact-detail">
              <i className="fas fa-map-marker-alt"></i>
              <span>Работаю онлайн по всей России</span>
            </div>
            <div className="contact-detail hours">
              <i className="fas fa-clock"></i>
              <span>Пн–Пт: 9:00 – 17:00</span>
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