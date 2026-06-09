import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import EmailSelector from '../components/EmailSelector';
import AnimatedCounter from '../components/AnimatedCounter';

function HomePage() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash === '#reviews') {
      setTimeout(() => {
        const reviewsSection = document.getElementById('reviews');
        if (reviewsSection) {
          reviewsSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 200);
    }
  }, [location.hash]);

  return (
    <>
      <Header />
      
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-content">
            <div className="hero-badge">частнопрактикующий оценщик</div>
            <h1>Ольга Бакаленко<br /><span>объективная оценка</span> вашего имущества</h1>
            <p className="hero-desc">Добро пожаловать в мою оценочную практику! Меня зовут Бакаленко Ольга, и я – профессиональный оценщик с многолетним опытом в сфере оценки имущества.</p>
            <div>
              <EmailSelector buttonText="Заказать оценку" className="btn-primary btn-hero" />
              <a href="/services" className="btn-outline">Услуги</a>
            </div>
          </div>
          <div className="hero-photo">
            <img src="photo.jpg" alt="Ольга Бакаленко" className="hero-img" />
          </div>
        </div>
      </section>

      <section className="why-me">
        <div className="container">
          <div className="section-title"><h2>Почему выбирают меня</h2></div>
          <div className="why-grid">
            <div className="why-item">
              <div className="why-number"><AnimatedCounter end={15} suffix=" лет" /></div>
              <div className="why-label">оценочной деятельности</div>
            </div>
            <div className="why-item">
              <div className="why-number"><AnimatedCounter end={500} suffix="+" /></div>
              <div className="why-label">успешных отчётов</div>
            </div>
            <div className="why-item">
              <div className="why-number"><AnimatedCounter end={100} suffix="%" /></div>
              <div className="why-label">принятие в судах</div>
            </div>
            <div className="why-item">
              <div className="why-number"><AnimatedCounter end={15} suffix="+" /></div>
              <div className="why-label">регионов РФ</div>
            </div>
          </div>
        </div>
      </section>

      <section className="services">
        <div className="container">
          <div className="section-title"><h2>Услуги</h2></div>
          <div className="services-grid">
            <a href="/services#real-estate" className="service-card">
              <div className="service-img" style={{ backgroundImage: "url('build.jpg')" }}></div>
              <h3>Оценка недвижимости</h3>
              <p>квартиры, дома, коммерческая недвижимость, земельные участки, гаражи</p>
            </a>
            <a href="/services#movable" className="service-card">
              <div className="service-img" style={{ backgroundImage: "url('car.jpg')" }}></div>
              <h3>Оценка движимого имущества</h3>
              <p>автотранспорт, строительная техника, оборудование, спецтехника</p>
            </a>
            <a href="/services#rent-right" className="service-card">
              <div className="service-img" style={{ backgroundImage: "url('calc.jpg')" }}></div>
              <h3>Оценка права пользования</h3>
              <p>арендная плата, право пользования нежилыми помещениями</p>
            </a>
          </div>
          <div className="services-button">
            <a href="/services" className="btn-primary">Подробнее об услугах</a>
          </div>
        </div>
      </section>

      <section className="qualifications">
        <div className="container">
          <div className="section-title"><h2>Квалификация</h2></div>
          <div className="qualifications-grid">
            <div className="qual-left">
              <p><strong>Образование:</strong> высшее юридическое (РГЭУ «РИНХ») и профессиональная переподготовка по программе «Оценка собственности».</p>
              <h3>Квалификационные аттестаты</h3>
              <ul>
                <li>Оценка недвижимости (№ 038432‑1 от 07.06.2024)</li>
                <li>Оценка движимого имущества (№ 037098‑2 от 24.05.2024)</li>
              </ul>
              <h3>Членство в СРО</h3>
              <p>Ассоциация СРО «Национальная коллегия специалистов-оценщиков», регистрационный номер 02082 от 29.07.2011 г.</p>
              <h3>Страхование ответственности</h3>
              <p>СПАО «Ингосстрах», полис № 433-589-116108/25</p>
            </div>
            <div className="qual-right">
              <div className="doc-badge"><i className="fas fa-graduation-cap"></i><span>Диплом юриста</span></div>
              <div className="doc-badge"><i className="fas fa-file-alt"></i><span>Диплом оценщика</span></div>
              <div className="doc-badge"><i className="fas fa-certificate"></i><span>Аттестат недвижимость</span></div>
              <div className="doc-badge"><i className="fas fa-certificate"></i><span>Аттестат движимое имущество</span></div>
              <div className="doc-badge"><i className="fas fa-shield-alt"></i><span>Страховой полис</span></div>
              <a href="/qualifications" className="btn-primary qualifications-link">Подробнее о квалификации</a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default HomePage;