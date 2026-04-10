import React from 'react';
import Header from '../components/Header';

function ServicesPage() {
  return (
    <>
      <Header onOpenAuth={() => {}} />
      
      <section className="page-hero">
        <div className="container">
          <h1>Услуги и цены</h1>
          <p>Прозрачные цены, фиксированные сроки, индивидуальный подход к каждому объекту</p>
        </div>
      </section>

      <section className="price-section">
        <div className="container">
          <div className="intro-text">
            <p>Оценщиком проводится оценка недвижимости и движимого имущества для различных целей: оценка для оформления наследственного имущества; оценка для родственного раздела имущества; оценка для предоставления в органы опеки; оценка для продажи; оценка для суда; оценка для определения стоимости права пользования и др.</p>
          </div>

          <div className="price-card">
            <h3>Оценка недвижимости</h3>
            <table className="price-table">
              <thead><tr><th>Услуга</th><th>Срок</th><th>Стоимость</th></tr></thead>
              <tbody>
                <tr className="section-header"><td colSpan="3">Квартиры, комнаты, доли</td></tr>
                <tr><td style={{paddingLeft:'20px'}}>Оценка квартиры, комнаты, доли — Базовый</td><td>4 рабочих дня</td><td>4 000 ₽</td></tr>
                <tr><td style={{paddingLeft:'20px'}}>Оценка квартиры, комнаты, доли — Удобный</td><td>2 рабочих дня</td><td>4 500 ₽</td></tr>
                <tr><td style={{paddingLeft:'20px'}}>Оценка квартиры, комнаты, доли — Срочный</td><td>1 сутки</td><td>5 000 ₽</td></tr>
                <tr className="section-header"><td colSpan="3">Жилые дома и коттеджи</td></tr>
                <tr><td style={{paddingLeft:'20px'}}>Оценка жилых домов — до 50 м²</td><td>3-4 рабочих дня</td><td>7 000 ₽</td></tr>
                <tr><td style={{paddingLeft:'20px'}}>Оценка жилых домов — 51-100 м²</td><td>3-4 рабочих дня</td><td>7 000-8 500 ₽</td></tr>
                <tr><td style={{paddingLeft:'20px'}}>Оценка жилых домов — 101-150 м²</td><td>3-4 рабочих дня</td><td>8 500-10 000 ₽</td></tr>
                <tr><td style={{paddingLeft:'20px'}}>Оценка жилых домов — более 150 м²</td><td>3-4 рабочих дня</td><td>от 10 000 ₽</td></tr>
                <tr className="section-header"><td colSpan="3">Земельные участки</td></tr>
                <tr><td style={{paddingLeft:'20px'}}>Оценка земельных участков</td><td>2-3 рабочих дня</td><td>от 5 000 ₽</td></tr>
                <tr><td style={{paddingLeft:'20px'}}>Оценка земельных участков под нежилую застройку</td><td>3-5 рабочих дней</td><td>от 10 000 ₽</td></tr>
              </tbody>
            </table>
            <div className="price-note">Расценки приведены для объектов в черте Зерноградского района Ростовской области.</div>
          </div>

          <div className="price-card">
            <h3>Оценка движимого имущества</h3>
            <table className="price-table">
              <thead><tr><th>Услуга</th><th>Срок</th><th>Стоимость</th></tr></thead>
              <tbody>
                <tr className="section-header"><td colSpan="3">Автотранспорт</td></tr>
                <tr><td style={{paddingLeft:'20px'}}>Оценка легковых автомобилей</td><td>2 рабочих дня</td><td>от 3 000 ₽</td></tr>
                <tr><td style={{paddingLeft:'20px'}}>Оценка грузовых автомобилей</td><td>3 рабочих дня</td><td>от 4 000 ₽</td></tr>
                <tr><td style={{paddingLeft:'20px'}}>Оценка строительной техники</td><td>3 рабочих дня</td><td>от 5 000 ₽</td></tr>
              </tbody>
            </table>
          </div>

          <div className="price-note" style={{ textAlign: 'center', marginTop: '1rem', padding: '1rem', background: 'var(--blue-bg)', borderRadius: '16px' }}>
            Настоящие расценки приведены для информации потенциальных клиентов и не являются публичной офертой.
          </div>
        </div>
      </section>

      <section className="docs-section">
        <div className="container">
          <div className="section-title"><h2>Документы для оценки</h2></div>
          <div className="docs-grid">
            <div className="doc-card">
              <h4>Для недвижимости</h4>
              <ul>
                <li>Выписка из ЕГРН</li>
                <li>Свидетельство о праве собственности</li>
                <li>Правоустанавливающие документы</li>
                <li>Технический паспорт</li>
              </ul>
            </div>
            <div className="doc-card">
              <h4>Для движимого имущества</h4>
              <ul>
                <li>Свидетельство о регистрации ТС</li>
                <li>Паспорт транспортного средства (ПТС)</li>
                <li>Данные о пробеге</li>
                <li>Документы на оборудование</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-banner">
        <div className="container">
          <h3>Нужна оценка имущества?</h3>
          <p>Оставьте заявку — я рассчитаю стоимость и сроки в течение часа</p>
          <a href="/#contact" className="btn-primary" style={{ background: 'white', color: 'var(--blue)' }}>Оставить заявку <i className="fas fa-arrow-right"></i></a>
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
          </div>
          <div className="contact-form">
            <form>
              <input type="text" placeholder="Ваше имя" />
              <input type="email" placeholder="Ваш Email" />
              <textarea rows="3" placeholder="Ваш вопрос"></textarea>
              <button type="submit">Отправить вопрос <i className="fas fa-arrow-right"></i></button>
            </form>
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

export default ServicesPage;