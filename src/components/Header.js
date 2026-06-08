import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleContactsClick = (e) => {
    e.preventDefault();
    const contactSection = document.getElementById('contact');
    if (contactSection) contactSection.scrollIntoView({ behavior: 'smooth' });
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
          <li><a href="#" onClick={handleContactsClick}>Контакты</a></li>
        </ul>
      </div>
    </nav>
  );
}

export default Header;