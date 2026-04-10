import React from 'react';
import Header from '../components/Header';

function QualificationsPage() {
  return (
    <>
      <Header onOpenAuth={() => {}} />
      
      <section className="page-hero">
        <div className="container">
          <h1>Квалификационные документы</h1>
          <p>Дипломы, аттестаты, сертификаты и свидетельства</p>
        </div>
      </section>

      <section className="welcome-section">
        <div className="container">
          <div className="welcome-card">
            <p>Добро пожаловать в мою оценочную практику! Меня зовут Бакаленко Ольга, и я – профессиональный оценщик с многолетним опытом в сфере оценки имущества.</p>
            <p>Моя квалификация соответствует всем требованиям законодательства, предъявляемым к частнопрактикующему оценщику:</p>
            <ul>
              <li>являюсь членом Ассоциации СРО «Национальная коллегия специалистов-оценщиков» (регистрационный номер 02082);</li>
              <li>имею квалификационные аттестаты по оценке недвижимости и оценке движимого имущества;</li>
              <li>моя профессиональная ответственность застрахована;</li>
              <li>имею стаж работы в оценочной деятельности с 2011 года.</li>
            </ul>
            <p><strong>Образование:</strong> высшее юридическое (РГЭУ «РИНХ», 2010) и диплом о профессиональной переподготовке по программе «Оценка собственности» (2010).</p>
          </div>
        </div>
      </section>

      <section className="welcome-section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="welcome-card">
            <h3 style={{ color: 'var(--blue)', marginBottom: '1.5rem', fontSize: '1.3rem' }}>Документы</h3>
            <div className="docs-block">
              <div className="doc-simple">
                <span className="doc-name">Квалификационный аттестат — Оценка недвижимости (№ 038432-1)</span>
                <a href="#" className="doc-link">Скачать PDF</a>
              </div>
              <div className="doc-simple">
                <span className="doc-name">Квалификационный аттестат — Оценка движимого имущества (№ 037098-2)</span>
                <a href="#" className="doc-link">Скачать PDF</a>
              </div>
              <div className="doc-simple">
                <span className="doc-name">Свидетельство СРО «НКСО» (рег. № 02082)</span>
                <a href="#" className="doc-link">Скачать PDF</a>
              </div>
              <div className="doc-simple">
                <span className="doc-name">Страховой полис СПАО «Ингосстрах»</span>
                <a href="#" className="doc-link">Скачать PDF</a>
              </div>
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

export default QualificationsPage;