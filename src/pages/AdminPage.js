import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function AdminPage() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('requests');
  const [allRequests, setAllRequests] = useState([]);
  const [heroText, setHeroText] = useState('');
  const [qualText, setQualText] = useState('');
  const [whyText, setWhyText] = useState('');
  const [uploadContext, setUploadContext] = useState({ type: null, requestId: null });
  const [showModal, setShowModal] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = sessionStorage.getItem('cabinet_user');
    if (!userData || JSON.parse(userData).role !== 'admin') {
      navigate('/');
      return;
    }
    setUser(JSON.parse(userData));
    loadRequests();
    loadContent();
  }, [navigate]);

  const loadRequests = () => {
    // ТОЛЬКО ОДНА заявка: Торговый центр "Заря"
    const defaultRequests = [
      { 
        id: 1, 
        date: '2025-04-08', 
        clientName: 'Анна С.', 
        clientEmail: 'anna@example.com', 
        object: 'Торговый центр "Заря"', 
        category: 'realty', 
        desc: 'Оценка для судебного разбирательства', 
        status: 'waiting_docs', 
        adminComment: 'Необходимо предоставить выписку из ЕГРН и технический паспорт', 
        clientDocs: [], 
        reportFile: null, 
        contractFile: null 
      }
    ];
    setAllRequests(defaultRequests);
    localStorage.setItem('admin_all_requests', JSON.stringify(defaultRequests));
  };

  const saveAllRequests = (requests) => {
    localStorage.setItem('admin_all_requests', JSON.stringify(requests));
    setAllRequests([...requests]);
  };

  const loadContent = () => {
    setHeroText(localStorage.getItem('content_hero') || 'Добро пожаловать! Я частнопрактикующий оценщик Ольга Бакаленко...');
    setQualText(localStorage.getItem('content_qual') || 'Моя квалификация: член СРО, аттестаты, страховка...');
    setWhyText(localStorage.getItem('content_why') || '14 лет опыта, 500+ отчётов, 100% принятие');
  };

  const saveHero = () => { localStorage.setItem('content_hero', heroText); alert('Сохранено'); };
  const saveQual = () => { localStorage.setItem('content_qual', qualText); alert('Сохранено'); };
  const saveWhy = () => { localStorage.setItem('content_why', whyText); alert('Сохранено'); };

  const updateRequestStatus = (id, newStatus) => {
    const updated = allRequests.map(r => r.id === id ? { ...r, status: newStatus } : r);
    saveAllRequests(updated);
  };

  const updateRequestComment = (id, comment) => {
    const updated = allRequests.map(r => r.id === id ? { ...r, adminComment: comment } : r);
    saveAllRequests(updated);
  };

  const openUploadModal = (type, requestId) => {
    setUploadContext({ type, requestId });
    setShowModal(true);
    setUploadFile(null);
  };

  const confirmUpload = () => {
    if (!uploadFile) {
      alert('Выберите файл');
      return;
    }
    const updated = allRequests.map(r => {
      if (r.id === uploadContext.requestId) {
        if (uploadContext.type === 'contract') return { ...r, contractFile: uploadFile.name };
        if (uploadContext.type === 'report') return { ...r, reportFile: uploadFile.name };
      }
      return r;
    });
    saveAllRequests(updated);
    alert(`Файл "${uploadFile.name}" загружен`);
    setShowModal(false);
    setUploadFile(null);
  };

  const getCategoryName = (cat) => {
    const map = { realty: 'Недвижимость', movable: 'Движимое имущество', business: 'Бизнес', art: 'Антиквариат' };
    return map[cat] || cat;
  };

  const handleLogout = () => {
    sessionStorage.removeItem('cabinet_user');
    navigate('/');
  };

  if (!user) return null;

  return (
    <>
      <div className="cabinet-header">
        <div className="container header-inner">
          <div className="logo-cabinet">
            <a href="/">Ольга Бакаленко</a>
            <span>админ-панель</span>
          </div>
          <div className="user-info">
            <span className="user-email">{user.email}</span>
            <button className="logout-btn" onClick={handleLogout}><i className="fas fa-sign-out-alt"></i> Выйти</button>
            <a href="/" className="back-link"><i className="fas fa-arrow-left"></i> На сайт</a>
          </div>
        </div>
      </div>

      <main className="cabinet-main">
        <div className="container">
          <div className="page-title">
            <h1>Админ-панель</h1>
            <p>Управление заявками и контентом сайта</p>
          </div>
          
          <div className="cabinet-tabs">
            <button className={`tab-btn ${activeTab === 'requests' ? 'active' : ''}`} onClick={() => setActiveTab('requests')}>Все заявки</button>
            <button className={`tab-btn ${activeTab === 'content' ? 'active' : ''}`} onClick={() => setActiveTab('content')}>Редактирование контента</button>
          </div>
          
          <div className={`cabinet-panel ${activeTab === 'requests' ? 'active' : ''}`}>
            <div className="panel-header">
              <h3>Заявки клиентов</h3>
            </div>
            {allRequests.map(req => (
              <div key={req.id} className="request-card">
                <div className="request-header">
                  <span className="request-object">{req.object}</span>
                  <select className="status-select" value={req.status} onChange={(e) => updateRequestStatus(req.id, e.target.value)}>
                    <option value="new">Новая</option>
                    <option value="work">В работе</option>
                    <option value="waiting_docs">Ожидает документов</option>
                    <option value="waiting_payment">Ожидает оплаты</option>
                    <option value="report_ready">Отчет загружен</option>
                  </select>
                </div>
                <div className="request-details">
                  <p><strong>Клиент:</strong> {req.clientName} ({req.clientEmail})</p>
                  <p><strong>Дата:</strong> {req.date}</p>
                  <p><strong>Категория:</strong> {getCategoryName(req.category)}</p>
                  <p><strong>Описание:</strong> {req.desc}</p>
                  <div><strong>Комментарий оценщика:</strong></div>
                  <textarea className="admin-comment-area" rows="2" placeholder="Добавить комментарий для клиента..." value={req.adminComment || ''} onChange={(e) => updateRequestComment(req.id, e.target.value)}></textarea>
                  <div className="file-section">
                    <span><i className="fas fa-paperclip"></i> Документы клиента:</span>
                    {req.clientDocs && req.clientDocs.length ? req.clientDocs.map(d => <span key={d} className="file-btn"><i className="fas fa-file"></i> {d}</span>) : <span>нет</span>}
                  </div>
                  <div className="file-section">
                    <span><i className="fas fa-file-contract"></i> Договор:</span>
                    {req.contractFile ? <span className="file-btn"><i className="fas fa-check"></i> Загружен</span> : <span>не загружен</span>}
                    <button className="file-btn" onClick={() => openUploadModal('contract', req.id)}><i className="fas fa-upload"></i> Загрузить договор</button>
                  </div>
                  <div className="file-section">
                    <span><i className="fas fa-file-pdf"></i> Итоговый отчёт:</span>
                    {req.reportFile ? <span className="file-btn"><i className="fas fa-check"></i> Загружен</span> : <span>не загружен</span>}
                    <button className="file-btn" onClick={() => openUploadModal('report', req.id)}><i className="fas fa-upload"></i> Загрузить отчёт</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className={`cabinet-panel ${activeTab === 'content' ? 'active' : ''}`}>
            <div className="panel-header">
              <h3>Редактирование страниц</h3>
            </div>
            <div className="content-editor">
              <h4>Главная страница — текст приветствия</h4>
              <textarea rows="4" value={heroText} onChange={(e) => setHeroText(e.target.value)}></textarea>
              <button onClick={saveHero}>Сохранить</button>
            </div>
            <div className="content-editor">
              <h4>Страница "О квалификации" — текст</h4>
              <textarea rows="4" value={qualText} onChange={(e) => setQualText(e.target.value)}></textarea>
              <button onClick={saveQual}>Сохранить</button>
            </div>
            <div className="content-editor">
              <h4>Блок "Почему выбирают меня" — преимущества</h4>
              <textarea rows="3" value={whyText} onChange={(e) => setWhyText(e.target.value)}></textarea>
              <button onClick={saveWhy}>Сохранить</button>
            </div>
          </div>
        </div>
      </main>

      <footer>
        <div className="container">
          <p>© 2026 Ольга Бакаленко — Частнопрактикующий оценщик недвижимости и движимого имущества</p>
        </div>
      </footer>

      {showModal && (
        <div className="auth-overlay" style={{ display: 'flex' }}>
          <div className="auth-modal">
            <button className="close-auth" onClick={() => setShowModal(false)}>&times;</button>
            <h3 style={{ marginBottom: '1rem', color: 'var(--blue)' }}>
              {uploadContext.type === 'contract' ? 'Загрузить договор' : 'Загрузить отчёт'}
            </h3>
            <input type="file" accept=".pdf,.jpg,.png" onChange={(e) => setUploadFile(e.target.files[0])} style={{ width: '100%', padding: '12px', margin: '8px 0', border: '1px solid var(--border)', borderRadius: '20px' }} />
            <div className="modal-buttons" style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
              <button onClick={confirmUpload} style={{ flex: 1, padding: '12px', borderRadius: '30px', border: 'none', background: 'var(--blue)', color: 'white', cursor: 'pointer', fontWeight: 600 }}>Загрузить</button>
              <button onClick={() => setShowModal(false)} style={{ flex: 1, padding: '12px', borderRadius: '30px', border: 'none', background: 'var(--blue-bg)', cursor: 'pointer', fontWeight: 600 }}>Отмена</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AdminPage;