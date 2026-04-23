import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

function Header({ onOpenAuth }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleReviewsClick = (e) => {
    e.preventDefault();
    const currentPath = location.pathname;
    
    if (currentPath === '/') {
      const reviewsSection = document.getElementById('reviews');
      if (reviewsSection) {
        reviewsSection.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate('/#reviews');
    }
  };

  const handleContactsClick = (e) => {
    e.preventDefault();
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCabinetClick = (e) => {
    e.preventDefault();
    const user = sessionStorage.getItem('cabinet_user');
    if (user) {
      const userData = JSON.parse(user);
      if (userData.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/cabinet');
      }
    } else {
      onOpenAuth(); // Вызываем функцию открытия модалки
    }
  };

  return (
    <nav>
      <div className="container nav-inner">
        <div className="logo">
          <Link to="/">
            <h2>Ольга Бакаленко</h2>
            <p>частнопрактикующий оценщик</p>
          </Link>
        </div>
        <ul className="nav-links">
          <li><Link to="/">Главная</Link></li>
          <li><Link to="/services">Услуги и цены</Link></li>
          <li><Link to="/qualifications">Квалификационные документы</Link></li>
          <li><a href="#" onClick={handleReviewsClick}>Отзывы</a></li>
          <li><a href="#" onClick={handleContactsClick}>Контакты</a></li>
          <li>
            <button 
              onClick={handleCabinetClick} 
              className="btn-cabinet"
              style={{ background: 'var(--blue)', color: 'white', border: 'none' }}
            >
              <i className="fas fa-user-lock"></i> Личный кабинет
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Header;