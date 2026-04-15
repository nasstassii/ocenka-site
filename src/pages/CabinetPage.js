import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { fetchWithAuth, fetchFormData } from '../utils/api';
import RequestModal from '../components/RequestModal';
import Footer from '../components/Footer';

function CabinetPage() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('requests');
  const [profileName, setProfileName] = useState('');
  const [profilePhone, setProfilePhone] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [selectedRating, setSelectedRating] = useState(0);
  const [reviewResult, setReviewResult] = useState('');
  const [reviewAgreement, setReviewAgreement] = useState(false);
  const [requests, setRequests] = useState([]);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadingId, setUploadingId] = useState(null);
  const [uploadingType, setUploadingType] = useState(null);
  const [files, setFiles] = useState({});
  
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    const userData = sessionStorage.getItem('cabinet_user');
    if (!userData) {
      navigate('/');
      return;
    }
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    setProfileName(parsedUser.fio || parsedUser.name || '');
    setProfilePhone(parsedUser.phone || '');
    loadRequests(parsedUser.id);
  }, [navigate]);

  const loadRequests = async (userId) => {
    setIsLoading(true);
    try {
      const response = await fetchWithAuth(`/requests/user/${userId}`);
      const data = await response.json();
      setRequests(Array.isArray(data) ? data : []);
      
      for (const req of data) {
        await loadFiles(req.id_req);
      }
    } catch (err) {
      console.error('Ошибка загрузки заявок:', err);
      setRequests([]);
    } finally {
      setIsLoading(false);
    }
  };

  const loadFiles = async (requestId) => {
    try {
      const types = ['client_doc', 'contract', 'contract_signed', 'report'];
      const filesData = {};
      
      for (const type of types) {
        const response = await fetch(`http://localhost:5000/api/upload/${requestId}/${type}`);
        const data = await response.json();
        filesData[type] = Array.isArray(data) ? data : [];
      }
      
      setFiles(prev => ({ ...prev, [requestId]: filesData }));
    } catch (err) {
      console.error('Ошибка загрузки файлов:', err);
    }
  };

  const saveProfile = async () => {
    try {
      const response = await fetchWithAuth('/auth/update', {
        method: 'PUT',
        body: JSON.stringify({ id: user.id, fio: profileName, phone: profilePhone })
      });
      const data = await response.json();
      if (data.success) {
        alert('Профиль сохранён');
        const updatedUser = { ...user, fio: profileName, phone: profilePhone, name: profileName };
        sessionStorage.setItem('cabinet_user', JSON.stringify(updatedUser));
        setUser(updatedUser);
      } else {
        alert(data.error || 'Ошибка сохранения');
      }
    } catch (err) {
      alert('Ошибка подключения к серверу');
    }
  };

  const changePassword = async () => {
    setPasswordError('');
    setPasswordSuccess('');
    
    if (!oldPassword) { setPasswordError('Введите текущий пароль'); return; }
    if (!newPassword) { setPasswordError('Введите новый пароль'); return; }
    if (newPassword.length < 8) { setPasswordError('Пароль должен быть не менее 8 символов'); return; }
    if (newPassword !== confirmPassword) { setPasswordError('Новый пароль и подтверждение не совпадают'); return; }
    
    setIsChangingPassword(true);
    
    try {
      const response = await fetchWithAuth('/auth/change-password', {
        method: 'POST',
        body: JSON.stringify({ userId: user.id, oldPassword, newPassword })
      });
      const data = await response.json();
      if (data.success) {
        setPasswordSuccess('Пароль успешно изменён');
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setTimeout(() => {
          setShowPasswordForm(false);
          setPasswordSuccess('');
        }, 2000);
      } else {
        setPasswordError(data.error || 'Ошибка смены пароля');
      }
    } catch (err) {
      setPasswordError('Ошибка подключения к серверу');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('cabinet_user');
    navigate('/');
  };

  const submitReview = async () => {
    if (!reviewText.trim()) {
      setReviewResult('Напишите текст отзыва');
      setTimeout(() => setReviewResult(''), 3000);
      return;
    }
    
    if (!reviewAgreement) {
      setReviewResult('Необходимо согласие на обработку персональных данных');
      setTimeout(() => setReviewResult(''), 3000);
      return;
    }
    
    try {
      const response = await fetchWithAuth('/reviews', {
        method: 'POST',
        body: JSON.stringify({ users_id_user: user.id, text: reviewText, rating: selectedRating || 5 })
      });
      const data = await response.json();
      if (data.success) {
        setReviewResult('Спасибо за ваш отзыв!');
        setReviewText('');
        setSelectedRating(0);
        setReviewAgreement(false);
        setTimeout(() => setReviewResult(''), 3000);
      } else {
        setReviewResult('Ошибка при отправке отзыва');
      }
    } catch (err) {
      setReviewResult('Ошибка подключения к серверу');
    }
  };

  const uploadDocument = async (requestId, file, type) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('uploaded_by', 'client');

    setUploadingId(requestId);
    setUploadingType(type);

    try {
      const response = await fetch(`http://localhost:5000/api/upload/${requestId}/${type}`, {
        method: 'POST',
        body: formData
      });
      const data = await response.json();
      if (data.success) {
        alert('Файл успешно загружен');
        await loadFiles(requestId);
      } else {
        alert('Ошибка загрузки файла');
      }
    } catch (err) {
      console.error('Ошибка:', err);
      alert('Ошибка подключения к серверу');
    } finally {
      setUploadingId(null);
      setUploadingType(null);
    }
  };

  const deleteFile = async (fileId, requestId) => {
    if (window.confirm('Удалить этот файл?')) {
      try {
        const response = await fetchWithAuth(`/upload/${fileId}`, { method: 'DELETE' });
        const data = await response.json();
        if (data.success) {
          alert('Файл удалён');
          await loadFiles(requestId);
        } else {
          alert('Ошибка удаления файла');
        }
      } catch (err) {
        alert('Ошибка подключения к серверу');
      }
    }
  };

  const deleteRequest = async (id) => {
    if (window.confirm('Вы уверены? Заявка и все файлы будут удалены безвозвратно.')) {
      try {
        const response = await fetchWithAuth(`/requests/${id}`, { method: 'DELETE' });
        const data = await response.json();
        if (data.success) {
          alert('Заявка удалена');
          loadRequests(user.id);
        } else {
          alert('Ошибка удаления');
        }
      } catch (err) {
        alert('Ошибка подключения к серверу');
      }
    }
  };

  const handleFileSelect = (requestId, type) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,.jpg,.jpeg,.png';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const ext = file.name.split('.').pop().toLowerCase();
        if (['pdf', 'jpg', 'jpeg', 'png'].includes(ext)) {
          uploadDocument(requestId, file, type);
        } else {
          alert('Допустимые форматы: PDF, JPG, PNG');
        }
      }
    };
    input.click();
  };

  const downloadFile = async (fileId, fileName) => {
    try {
      const response = await fetch(`http://localhost:5000/api/upload/download/${fileId}`);
      if (!response.ok) throw new Error('Ошибка загрузки файла');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Ошибка скачивания:', error);
      alert('Не удалось скачать файл');
    }
  };

  const getStatusText = (status) => {
    const map = { new: 'Новая', work: 'В работе', waiting_docs: 'Ожидает документов', waiting_payment: 'Ожидает оплаты', report_ready: 'Завершено' };
    return map[status] || status;
  };

  if (!user) return null;

  return (
    <>
      <div className="cabinet-header">
        <div className="container header-inner">
          <div className="logo-cabinet"><a href="/">Ольга Бакаленко</a><span>личный кабинет клиента</span></div>
          <div className="user-info">
            <span className="user-email">{user.email}</span>
            <button className="logout-btn" onClick={handleLogout}><i className="fas fa-sign-out-alt"></i> Выйти</button>
            <a href="/" className="back-link"><i className="fas fa-arrow-left"></i> На сайт</a>
          </div>
        </div>
      </div>

      <main className="cabinet-main">
        <div className="container">
          <div className="page-title"><h1>Личный кабинет</h1></div>

          <div className="profile-section">
            <h3>Редактирование профиля</h3>
            <div className="profile-form-row">
              <input type="text" className="name-input" value={profileName} onChange={(e) => setProfileName(e.target.value)} placeholder="Ваше ФИО" />
              <input type="tel" className="phone-input" value={profilePhone} onChange={(e) => setProfilePhone(e.target.value)} placeholder="Телефон" />
              <button onClick={saveProfile} className="btn-save-profile">Сохранить изменения</button>
              {!showPasswordForm ? (
                <button onClick={() => setShowPasswordForm(true)} className="btn-change-password"><i className="fas fa-key"></i> Сменить пароль</button>
              ) : (
                <button onClick={() => setShowPasswordForm(false)} className="btn-change-password-cancel"><i className="fas fa-times"></i> Отмена</button>
              )}
            </div>
            {showPasswordForm && (
              <div className="password-change-form">
                <div className="password-change-row">
                  <input type="password" className="password-input" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} placeholder="Текущий пароль" disabled={isChangingPassword} />
                  <input type="password" className="password-input" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Новый пароль" disabled={isChangingPassword} />
                  <input type="password" className="password-input-confirm" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Подтвердите" disabled={isChangingPassword} />
                  <button onClick={changePassword} className="btn-save-password" disabled={isChangingPassword}>{isChangingPassword ? '...' : 'Сохранить'}</button>
                </div>
                {passwordError && <div className="password-error">{passwordError}</div>}
                {passwordSuccess && <div className="password-success">{passwordSuccess}</div>}
              </div>
            )}
          </div>

          <div className="cabinet-tabs">
            <button className={`tab-btn ${activeTab === 'requests' ? 'active' : ''}`} onClick={() => setActiveTab('requests')}>Мои заявки</button>
            <button className={`tab-btn ${activeTab === 'review' ? 'active' : ''}`} onClick={() => setActiveTab('review')}>Оставить отзыв</button>
            <button className={`tab-btn ${activeTab === 'contract' ? 'active' : ''}`} onClick={() => setActiveTab('contract')}>Договор</button>
          </div>

          <div className={`cabinet-panel ${activeTab === 'requests' ? 'active' : ''}`}>
            <div className="panel-header"><h3>Мои заявки</h3><button className="add-btn" onClick={() => setIsRequestModalOpen(true)}>+ Новая заявка</button></div>
            {isLoading ? <div className="loading-spinner">Загрузка...</div> : requests.length === 0 ? <div style={{ textAlign: 'center', padding: '20px', color: '#B8AFA0' }}>У вас пока нет заявок.</div> : requests.map(req => (
              <div key={req.id_req} className="request-card">
                <div className="request-header"><span className="request-object">{req.name}</span><div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}><span className="status" data-status={req.status}>{getStatusText(req.status)}</span><button onClick={() => deleteRequest(req.id_req)} className="delete-request-btn">✕</button></div></div>
                <div className="request-details">
                  <p><strong>Дата:</strong> {new Date(req.created_at).toLocaleDateString()}</p>
                  <p><strong>Заказчик:</strong> {req.client_type}</p>
                  <p><strong>Объект оценки:</strong> {req.project_type}</p>
                  <p><strong>Ограничения:</strong> {req.has_restrictions ? 'Да' : 'Нет'}</p>
                  <p><strong>Цель оценки:</strong> {req.purpose}</p>
                  <p><strong>Описание:</strong> {req.description || '—'}</p>
                  {req.admin_comment && <div className="admin-comment"><strong>Комментарий оценщика:</strong> {req.admin_comment}</div>}
                  <div className="file-section"><span>Мои документы:</span>{files[req.id_req]?.client_doc?.map((file) => (<div key={file.id_doc} className="file-item"><span className="file-name" onClick={() => downloadFile(file.id_doc, file.file_name)}>{file.file_name}</span><button className="delete-file" onClick={() => deleteFile(file.id_doc, req.id_req)}>✕</button></div>))}<button className="file-btn" onClick={() => handleFileSelect(req.id_req, 'client_doc')} disabled={uploadingId === req.id_req}><i className="fas fa-upload"></i> Загрузить документ</button></div>
                  <div className="file-section"><span>Договор (от оценщика):</span>{files[req.id_req]?.contract?.map((file) => (<div key={file.id_doc} className="file-item"><span className="file-name" onClick={() => downloadFile(file.id_doc, file.file_name)}>{file.file_name}</span></div>))}</div>
                  <div className="file-section"><span>Подписанный договор (от клиента):</span>{files[req.id_req]?.contract_signed?.map((file) => (<div key={file.id_doc} className="file-item"><span className="file-name" onClick={() => downloadFile(file.id_doc, file.file_name)}>{file.file_name}</span><button className="delete-file" onClick={() => deleteFile(file.id_doc, req.id_req)}>✕</button></div>))}<button className="file-btn" onClick={() => handleFileSelect(req.id_req, 'contract_signed')} disabled={uploadingId === req.id_req}><i className="fas fa-upload"></i> Загрузить подписанный договор</button></div>
                  <div className="file-section"><span>Итоговый отчёт:</span>{files[req.id_req]?.report?.map((file) => (<div key={file.id_doc} className="file-item"><span className="file-name" onClick={() => downloadFile(file.id_doc, file.file_name)}>{file.file_name}</span></div>))}</div>
                </div>
              </div>
            ))}
          </div>

          <div className={`cabinet-panel ${activeTab === 'review' ? 'active' : ''}`}>
            <div className="panel-header">
              <h3>Оставить отзыв</h3>
            </div>
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              rows="4"
              placeholder="Напишите ваш отзыв о работе оценщика..."
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '20px',
                border: '1px solid var(--border)',
                marginBottom: '8px',
                fontFamily: 'Inter, sans-serif',
                resize: 'vertical'
              }}
            />
            <div className="star-rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <i
                  key={star}
                  className={`fas fa-star ${selectedRating >= star ? 'active' : ''}`}
                  onClick={() => setSelectedRating(star)}
                  style={{ cursor: 'pointer' }}
                />
              ))}
            </div>
            
            {/* Чекбокс для согласия */}
            <div className="checkbox-wrapper" style={{ margin: '16px 0' }}>
              <input
                type="checkbox"
                id="reviewAgreement"
                checked={reviewAgreement}
                onChange={(e) => setReviewAgreement(e.target.checked)}
              />
              <label htmlFor="reviewAgreement">
                Я принимаю условия <Link to="/privacy" target="_blank" rel="noopener noreferrer">Политики конфиденциальности</Link>
                и даю согласие на обработку персональных данных
              </label>
            </div>
            
            <button onClick={submitReview} className="btn-primary">
              Отправить отзыв
            </button>
            
            {reviewResult && (
              <div style={{ marginTop: '16px', fontSize: '13px', color: 'var(--green)' }}>
                {reviewResult}
              </div>
            )}
          </div>

          <div className={`cabinet-panel ${activeTab === 'contract' ? 'active' : ''}`}>
            <div className="panel-header">
              <h3>Договор на оказание оценочных услуг</h3>
            </div>
            <p style={{ marginBottom: '24px' }}>
              Здесь вы можете ознакомиться с шаблоном договора
            </p>
            <button className="btn-primary">
              <i className="fas fa-download"></i> Скачать договор
            </button>
          </div>
        </div>
      </main>

      <RequestModal isOpen={isRequestModalOpen} onClose={() => setIsRequestModalOpen(false)} userId={user.id} onSuccess={() => loadRequests(user.id)} />
    </>
  );
}

export default CabinetPage;