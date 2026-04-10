import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AuthModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('login');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const getUsers = () => {
    const saved = localStorage.getItem('bakalenko_users');
    if (saved) return JSON.parse(saved);
    return [{ name: 'Администратор', email: 'admin@bakalenko.ru', phone: '', password: 'admin123', role: 'admin' }];
  };

  const saveUsers = (users) => {
    localStorage.setItem('bakalenko_users', JSON.stringify(users));
  };

  // Форматирование телефона
  const formatPhone = (value) => {
    let digits = value.replace(/\D/g, '');
    if (digits.length > 11) digits = digits.slice(0, 11);
    let formatted = '';
    if (digits.length > 0) formatted = '+7';
    if (digits.length > 1) formatted = '+7 (' + digits.slice(1, 4);
    if (digits.length > 4) formatted = '+7 (' + digits.slice(1, 4) + ') ' + digits.slice(4, 7);
    if (digits.length > 7) formatted = '+7 (' + digits.slice(1, 4) + ') ' + digits.slice(4, 7) + '-' + digits.slice(7, 9);
    if (digits.length > 9) formatted = '+7 (' + digits.slice(1, 4) + ') ' + digits.slice(4, 7) + '-' + digits.slice(7, 9) + '-' + digits.slice(9, 11);
    return formatted;
  };

  const handleRegPhoneChange = (e) => {
    setRegPhone(formatPhone(e.target.value));
  };

  const handleLogin = () => {
    const users = getUsers();
    const user = users.find(u => u.email === loginEmail && u.password === loginPassword);
    
    if (user) {
      sessionStorage.setItem('cabinet_user', JSON.stringify({ email: user.email, name: user.name, role: user.role }));
      onClose();
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/cabinet');
      }
    } else {
      setError('Неверный email или пароль');
    }
  };

  const handleRegister = () => {
    if (!regName) {
      setError('Укажите ФИО');
      return;
    }
    if (!regPassword) {
      setError('Введите пароль');
      return;
    }
    
    const users = getUsers();
    if (users.find(u => u.email === regEmail)) {
      setError('Пользователь уже существует');
      return;
    }
    
    const newUser = { name: regName, email: regEmail, phone: regPhone, password: regPassword, role: 'client' };
    users.push(newUser);
    saveUsers(users);
    
    sessionStorage.setItem('cabinet_user', JSON.stringify({ email: regEmail, name: regName, role: 'client' }));
    onClose();
    navigate('/cabinet');
  };

  if (!isOpen) return null;

  return (
    <div className="auth-overlay">
      <div className="auth-modal">
        <button onClick={onClose} className="close-auth">&times;</button>
        
        <div className="auth-tabs">
          <button onClick={() => { setActiveTab('login'); setError(''); }} className={`auth-tab ${activeTab === 'login' ? 'active' : ''}`}>Вход</button>
          <button onClick={() => { setActiveTab('register'); setError(''); }} className={`auth-tab ${activeTab === 'register' ? 'active' : ''}`}>Регистрация</button>
        </div>
        
        {activeTab === 'login' ? (
          <div className="auth-form active">
            <input type="email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} placeholder="Электронная почта" />
            <input type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} placeholder="Пароль" />
            <button onClick={handleLogin}>Войти</button>
          </div>
        ) : (
          <div className="auth-form active">
            <input type="text" value={regName} onChange={(e) => setRegName(e.target.value)} placeholder="Ваше ФИО" />
            <input type="email" value={regEmail} onChange={(e) => setRegEmail(e.target.value)} placeholder="Электронная почта" />
            <input type="tel" value={regPhone} onChange={handleRegPhoneChange} placeholder="+7 (___) ___-__-__" />
            <input type="password" value={regPassword} onChange={(e) => setRegPassword(e.target.value)} placeholder="Пароль" />
            <button onClick={handleRegister}>Зарегистрироваться</button>
          </div>
        )}
        
        {error && <div className="auth-error">{error}</div>}
      </div>
    </div>
  );
}

export default AuthModal;