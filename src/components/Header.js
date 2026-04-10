import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Header({ onOpenAuth }) {
  const navigate = useNavigate();

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
      onOpenAuth();
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
          <li><a href="/#reviews">Отзывы</a></li>
          <li><a href="/#contact">Контакты</a></li>
          <li><a href="#" onClick={handleCabinetClick} className="btn-cabinet"><i className="fas fa-user-lock"></i> Личный кабинет</a></li>
        </ul>
      </div>
    </nav>
  );
}

export default Header;