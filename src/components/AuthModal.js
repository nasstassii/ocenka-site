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
  const [agreement, setAgreement] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState('');
  const [passwordHint, setPasswordHint] = useState('');
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

  // Улучшенная проверка сложности пароля
  const checkPasswordStrength = (password) => {
    if (!password) {
      setPasswordStrength('');
      setPasswordHint('');
      return;
    }
    
    let strength = 0;
    let missing = [];
    
    if (password.length >= 8) strength++;
    else missing.push('минимум 8 символов');
    
    if (password.match(/[a-z]/)) strength++;
    else missing.push('строчные буквы (a-z)');
    
    if (password.match(/[A-Z]/)) strength++;
    else missing.push('заглавные буквы (A-Z)');
    
    if (password.match(/[0-9]/)) strength++;
    else missing.push('цифры (0-9)');
    
    if (password.match(/[^a-zA-Z0-9]/)) strength++;
    else missing.push('специальные символы (!@#$%^&*)');
    
    if (strength <= 2) {
      setPasswordStrength('Слабый пароль');
      setPasswordHint(`Добавьте: ${missing.join(', ')}`);
    } else if (strength <= 4) {
      setPasswordStrength('Средний пароль');
      setPasswordHint(`Добавьте: ${missing.join(', ')}`);
    } else {
      setPasswordStrength('Надёжный пароль');
      setPasswordHint('');
    }
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
    
    // Проверка сложности пароля перед отправкой
    if (regPassword.length < 8) { setError('Пароль должен быть не менее 8 символов'); return; }
    if (!regPassword.match(/[a-z]/)) { setError('Пароль должен содержать строчные буквы'); return; }
    if (!regPassword.match(/[A-Z]/)) { setError('Пароль должен содержать заглавные буквы'); return; }
    if (!regPassword.match(/[0-9]/)) { setError('Пароль должен содержать цифры'); return; }
    
    if (!agreement) { setError('Необходимо согласие на обработку персональных данных'); return; }

    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fio: regName, email: regEmail, phone: regPhone, password: regPassword })
      });
      const data = await response.json();
      if (data.success) {
        sessionStorage.setItem('cabinet_user', JSON.stringify(data.user));
        onClose();
        navigate(data.user.role === 'admin' ? '/admin' : '/cabinet');
      } else {
        setError(data.error || 'Ошибка регистрации');
      }
    } catch (err) {
      setError('Не удалось подключиться к серверу');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async () => {
    setError('');
    if (!loginEmail) { setError('Введите email'); return; }
    if (!loginPassword) { setError('Введите пароль'); return; }

    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      });
      const data = await response.json();
      if (data.success) {
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
          <button onClick={() => { setActiveTab('register'); setError(''); setPasswordStrength(''); setPasswordHint(''); }} className={`auth-tab ${activeTab === 'register' ? 'active' : ''}`}>Регистрация</button>
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
            <div style={{ marginBottom: '16px' }}>
              <input 
                type="password" 
                value={regPassword} 
                onChange={handleRegPasswordChange} 
                placeholder="Пароль" 
                disabled={isLoading}
                style={{ width: '100%', padding: '12px 16px', border: '1px solid var(--border)', borderRadius: '30px', fontFamily: 'Inter, sans-serif', marginBottom: '8px' }}
              />
              {passwordStrength && (
                <div>
                  <div style={{ 
                    fontSize: '12px', 
                    marginBottom: '4px',
                    color: passwordStrength === 'Надёжный пароль' ? '#4A9E6E' : (passwordStrength === 'Средний пароль' ? '#E8A04A' : '#c44')
                  }}>
                    {passwordStrength}
                  </div>
                  {passwordHint && (
                    <div style={{ fontSize: '11px', color: '#A66907' }}>
                      {passwordHint}
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', fontSize: '13px', cursor: 'pointer' }}>
              <input type="checkbox" checked={agreement} onChange={(e) => setAgreement(e.target.checked)} disabled={isLoading} style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
              <span>Я соглашаюсь на <a href="#" style={{ color: 'var(--blue)' }}>обработку персональных данных</a></span>
            </label>
            
            <button onClick={handleRegister} disabled={isLoading} style={{ width: '100%', background: 'var(--blue)', color: 'white', border: 'none', padding: '12px', borderRadius: '30px', fontWeight: '600', cursor: 'pointer' }}>
              {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
            </button>
          </div>
        )}
        {error && <div className="auth-error">{error}</div>}
      </div>
    </div>
  );
}

export default AuthModal;