import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { fetchPublic } from '../utils/api';

function AuthModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('login');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [agreement, setAgreement] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState('');
  const navigate = useNavigate();

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

  const checkPasswordStrength = (password) => {
    if (!password) { setPasswordStrength(''); return; }
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.match(/[a-z]/)) strength++;
    if (password.match(/[A-Z]/)) strength++;
    if (password.match(/[0-9]/)) strength++;
    if (password.match(/[^a-zA-Z0-9]/)) strength++;
    if (strength <= 2) setPasswordStrength('Слабый пароль');
    else if (strength <= 4) setPasswordStrength('Средний пароль');
    else setPasswordStrength('Надёжный пароль');
  };

  const handleRegPasswordChange = (e) => {
    const pwd = e.target.value;
    setRegPassword(pwd);
    checkPasswordStrength(pwd);
  };

  const handleRegPhoneChange = (e) => {
    setRegPhone(formatPhone(e.target.value));
  };

  const handleRegEmailChange = (e) => {
    setRegEmail(e.target.value.toLowerCase().replace(/\s/g, ''));
  };

  const handleLoginEmailChange = (e) => {
    setLoginEmail(e.target.value.toLowerCase().replace(/\s/g, ''));
  };

const handleRegister = async () => {
    setError('');
    if (!regName) { setError('Укажите ФИО'); return; }
    if (!regEmail) { setError('Укажите email'); return; }
    if (!regEmail.includes('@') || !regEmail.includes('.')) { setError('Введите корректный email'); return; }
    if (!regPassword) { setError('Введите пароль'); return; }
    if (regPassword.length < 8) { setError('Пароль должен быть не менее 8 символов'); return; }
    if (!regPassword.match(/[a-z]/)) { setError('Пароль должен содержать строчные буквы'); return; }
    if (!regPassword.match(/[A-Z]/)) { setError('Пароль должен содержать заглавные буквы'); return; }
    if (!regPassword.match(/[0-9]/)) { setError('Пароль должен содержать цифры'); return; }
    if (!agreement) { setError('Необходимо согласие на обработку персональных данных'); return; }

    setIsLoading(true);
    try {
        const response = await fetchPublic('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ fio: regName, email: regEmail, phone: regPhone, password: regPassword })
        });
        const data = await response.json();
        
        console.log('Регистрация ответ:', data);
        
        if (data.success) {
            // СОХРАНЯЕМ ТОКЕН
            if (data.token) {
                localStorage.setItem('token', data.token);
            }
            sessionStorage.setItem('cabinet_user', JSON.stringify(data.user));
            onClose();
            navigate(data.user.role === 'admin' ? '/admin' : '/cabinet');
        } else {
            setError(data.error || 'Ошибка регистрации');
        }
    } catch (err) {
        console.error('Ошибка:', err);
        setError('Не удалось подключиться к серверу');
    } finally {
        setIsLoading(false);
    }
};

  // ВХОД - СОХРАНЯЕМ ТОКЕН
  const handleLogin = async () => {
    setError('');
    if (!loginEmail) { setError('Введите email'); return; }
    if (!loginPassword) { setError('Введите пароль'); return; }

    setIsLoading(true);
    try {
      const response = await fetchPublic('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      });
      const data = await response.json();
      
      if (data.success) {
        localStorage.setItem('token', data.token);
        sessionStorage.setItem('cabinet_user', JSON.stringify(data.user));
        onClose();
        navigate(data.user.role === 'admin' ? '/admin' : '/cabinet');
      } else {
        setError(data.error || 'Неверный email или пароль');
      }
    } catch (err) {
      setError('Не удалось подключиться к серверу');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="auth-overlay">
      <div className="auth-modal">
        <button onClick={onClose} className="close-auth">&times;</button>
        <div className="auth-tabs">
          <button onClick={() => { setActiveTab('login'); setError(''); }} className={`auth-tab ${activeTab === 'login' ? 'active' : ''}`}>Вход</button>
          <button onClick={() => { setActiveTab('register'); setError(''); setPasswordStrength(''); }} className={`auth-tab ${activeTab === 'register' ? 'active' : ''}`}>Регистрация</button>
        </div>
        {activeTab === 'login' ? (
          <div className="auth-form active">
            <input type="email" value={loginEmail} onChange={handleLoginEmailChange} placeholder="Электронная почта" disabled={isLoading} />
            <input type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} placeholder="Пароль" disabled={isLoading} />
            <button onClick={handleLogin} disabled={isLoading}>{isLoading ? 'Вход...' : 'Войти'}</button>
          </div>
        ) : (
          <div className="auth-form active">
            <input type="text" value={regName} onChange={(e) => setRegName(e.target.value)} placeholder="Ваше ФИО" disabled={isLoading} />
            <input type="email" value={regEmail} onChange={handleRegEmailChange} placeholder="Электронная почта" disabled={isLoading} />
            <input type="tel" value={regPhone} onChange={handleRegPhoneChange} placeholder="+7 (___) ___-__-__" disabled={isLoading} />
            <div className="password-strength-wrapper">
              <input type="password" value={regPassword} onChange={handleRegPasswordChange} placeholder="Пароль" disabled={isLoading} />
              {passwordStrength && <div className={`password-strength ${passwordStrength === 'Надёжный пароль' ? 'strong' : (passwordStrength === 'Средний пароль' ? 'medium' : 'weak')}`}>{passwordStrength}</div>}
            </div>
            <div className="checkbox-wrapper">
              <input type="checkbox" id="registerAgreement" checked={agreement} onChange={(e) => setAgreement(e.target.checked)} disabled={isLoading} />
              <label htmlFor="registerAgreement">Я принимаю условия <Link to="/privacy" target="_blank">Политики конфиденциальности</Link> и даю согласие на обработку персональных данных</label>
            </div>
            <button onClick={handleRegister} disabled={isLoading}>{isLoading ? 'Регистрация...' : 'Зарегистрироваться'}</button>
          </div>
        )}
        {error && <div className="auth-error">{error}</div>}
      </div>
    </div>
  );
}

export default AuthModal;