import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function AdminPage() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('requests');
  const [allRequests, setAllRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadingId, setUploadingId] = useState(null);
  const [uploadingType, setUploadingType] = useState(null);
  const [files, setFiles] = useState({});
  const [editingComments, setEditingComments] = useState({});
  const [editingStatuses, setEditingStatuses] = useState({});
  
  const [qualTexts, setQualTexts] = useState({
    welcome_text: '',
    qual_list: '',
    education: '',
    law: '',
    valuation_objects: '',
    valuation_purposes: ''
  });
  
  const [pricesNeeds, setPricesNeeds] = useState({});
  const [pricesMovable, setPricesMovable] = useState({});
  const [reviews, setReviews] = useState([]);
  const [loadingPrices, setLoadingPrices] = useState(true);
  
  const navigate = useNavigate();

  useEffect(() => {
    const userData = sessionStorage.getItem('cabinet_user');
    if (!userData || JSON.parse(userData).role !== 'admin') {
      navigate('/');
      return;
    }
    setUser(JSON.parse(userData));
    loadRequests();
    loadQualification();
    loadPrices();
    loadReviews();
  }, [navigate]);

  const loadRequests = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/requests');
      const data = await response.json();
      setAllRequests(Array.isArray(data) ? data : []);
      
      const comments = {};
      const statuses = {};
      for (const req of data) {
        comments[req.id_req] = req.admin_comment || '';
        statuses[req.id_req] = req.status;
        await loadFiles(req.id_req);
      }
      setEditingComments(comments);
      setEditingStatuses(statuses);
    } catch (err) {
      console.error('Ошибка загрузки заявок:', err);
      setAllRequests([]);
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

  const loadQualification = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/content/qual/all');
      const data = await response.json();
      setQualTexts({
        welcome_text: data.welcome_text || '',
        qual_list: data.qual_list || '',
        education: data.education || '',
        law: data.law || '',
        valuation_objects: data.valuation_objects || '',
        valuation_purposes: data.valuation_purposes || ''
      });
    } catch (err) {
      console.error('Ошибка загрузки квалификации:', err);
    }
  };

  const loadPrices = async () => {
    setLoadingPrices(true);
    try {
      const [needsRes, movableRes] = await Promise.all([
        fetch('http://localhost:5000/api/content/prices_needs/all'),
        fetch('http://localhost:5000/api/content/prices_movable/all')
      ]);
      const needsData = await needsRes.json();
      const movableData = await movableRes.json();
      setPricesNeeds(needsData);
      setPricesMovable(movableData);
    } catch (err) {
      console.error('Ошибка загрузки цен:', err);
    } finally {
      setLoadingPrices(false);
    }
  };

  const loadReviews = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/reviews');
      const data = await response.json();
      setReviews(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Ошибка загрузки отзывов:', err);
    }
  };

  const saveQualContent = async (section) => {
    try {
      await fetch(`http://localhost:5000/api/content/qual/${section}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: qualTexts[section] })
      });
      alert('Сохранено');
    } catch (err) {
      alert('Ошибка сохранения');
    }
  };

  const savePriceNeeds = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/content/prices_needs/bulk', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prices: pricesNeeds })
      });
      const data = await response.json();
      if (data.success) {
        alert('Цены сохранены');
      } else {
        alert('Ошибка сохранения');
      }
    } catch (err) {
      console.error('Ошибка:', err);
      alert('Ошибка подключения к серверу');
    }
  };

  const savePriceMovable = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/content/prices_movable/bulk', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prices: pricesMovable })
      });
      const data = await response.json();
      if (data.success) {
        alert('Цены сохранены');
      } else {
        alert('Ошибка сохранения');
      }
    } catch (err) {
      console.error('Ошибка:', err);
      alert('Ошибка подключения к серверу');
    }
  };

  const deleteReview = async (reviewId) => {
    if (window.confirm('Удалить этот отзыв?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/reviews/${reviewId}`, {
          method: 'DELETE'
        });
        const data = await response.json();
        if (data.success) {
          alert('Отзыв удалён');
          loadReviews();
        } else {
          alert('Ошибка удаления');
        }
      } catch (err) {
        alert('Ошибка подключения к серверу');
      }
    }
  };

  const updateRequestStatus = async (id, status, admin_comment) => {
    try {
      await fetch(`http://localhost:5000/api/requests/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, admin_comment })
      });
      loadRequests();
    } catch (err) {
      console.error('Ошибка обновления:', err);
    }
  };

  const deleteRequest = async (id) => {
    if (window.confirm('Вы уверены? Заявка и все файлы будут удалены безвозвратно.')) {
      try {
        const response = await fetch(`http://localhost:5000/api/requests/${id}`, {
          method: 'DELETE'
        });
        const data = await response.json();
        if (data.success) {
          alert('Заявка удалена');
          loadRequests();
        } else {
          alert('Ошибка удаления');
        }
      } catch (err) {
        alert('Ошибка подключения к серверу');
      }
    }
  };

  const uploadAdminFile = async (requestId, file, type) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('uploaded_by', 'admin');

    setUploadingId(requestId);
    setUploadingType(type);

    try {
      const response = await fetch(`http://localhost:5000/api/upload/${requestId}/${type}`, {
        method: 'POST',
        body: formData
      });
      const data = await response.json();
      if (data.success) {
        alert('Файл загружен');
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
        const response = await fetch(`http://localhost:5000/api/upload/${fileId}`, {
          method: 'DELETE'
        });
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

  const handleFileSelect = (requestId, type) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,.jpg,.jpeg,.png';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const ext = file.name.split('.').pop().toLowerCase();
        if (['pdf', 'jpg', 'jpeg', 'png'].includes(ext)) {
          uploadAdminFile(requestId, file, type);
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

  const handleLogout = () => {
    sessionStorage.removeItem('cabinet_user');
    navigate('/');
  };

  const getStatusText = (status) => {
    const map = {
      new: 'Новая',
      work: 'В работе',
      waiting_docs: 'Ожидает документов',
      waiting_payment: 'Ожидает оплаты',
      report_ready: 'Завершено'
    };
    return map[status] || status;
  };

  const needsCategories = {
    'Квартиры, комнаты, доли': ['apartment_base', 'apartment_comfort', 'apartment_urgent'],
    'Жилые дома и коттеджи': ['house_50', 'house_100', 'house_150', 'house_more'],
    'Земельные участки': ['land', 'land_commercial'],
    'Гаражи и нежилые объекты': ['garage', 'non_residential_sale', 'non_residential_court', 'building_sale', 'building_court', 'built_in'],
    'Скидки': ['discount_2', 'discount_3', 'discount_more'],
    'Права пользования': ['rent_right']
  };

  const movableCategories = {
    'Автотранспорт': ['car_light', 'car_truck', 'car_construction'],
    'Оборудование': ['equipment_serial', 'equipment_special', 'equipment_line'],
    'Иное имущество': ['cattle', 'goods']
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
            <button className="logout-btn" onClick={handleLogout}>
              <i className="fas fa-sign-out-alt"></i> Выйти
            </button>
            <a href="/" className="back-link">
              <i className="fas fa-arrow-left"></i> На сайт
            </a>
          </div>
        </div>
      </div>

      <main className="cabinet-main">
        <div className="container">
          <div className="page-title">
            <h1>Админ-панель</h1>
            <p>Управление заявками, контентом и отзывами</p>
          </div>

          <div className="cabinet-tabs">
            <button className={`tab-btn ${activeTab === 'requests' ? 'active' : ''}`} onClick={() => setActiveTab('requests')}>Заявки</button>
            <button className={`tab-btn ${activeTab === 'content' ? 'active' : ''}`} onClick={() => setActiveTab('content')}>Квалификация</button>
            <button className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`} onClick={() => setActiveTab('reviews')}>Отзывы</button>
            <button className={`tab-btn ${activeTab === 'prices_needs' ? 'active' : ''}`} onClick={() => setActiveTab('prices_needs')}>Цены недвижимость</button>
            <button className={`tab-btn ${activeTab === 'prices_movable' ? 'active' : ''}`} onClick={() => setActiveTab('prices_movable')}>Цены движимое</button>
          </div>

          {/* Заявки */}
          <div className={`cabinet-panel ${activeTab === 'requests' ? 'active' : ''}`}>
            <div className="panel-header"><h3>Заявки клиентов</h3></div>
            {isLoading ? (
              <div style={{ textAlign: 'center', padding: '20px' }}>Загрузка...</div>
            ) : allRequests.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '20px', color: '#B8AFA0' }}>Нет заявок</div>
            ) : (
              allRequests.map(req => (
                <div key={req.id_req} className="request-card">
                  <div className="request-header">
                    <span className="request-object">{req.name}</span>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <select className="status-select" value={editingStatuses[req.id_req] || req.status} onChange={(e) => setEditingStatuses(prev => ({ ...prev, [req.id_req]: e.target.value }))}>
                        <option value="new">Новая</option>
                        <option value="work">В работе</option>
                        <option value="waiting_docs">Ожидает документов</option>
                        <option value="waiting_payment">Ожидает оплаты</option>
                        <option value="report_ready">Завершено</option>
                      </select>
                      <button onClick={() => deleteRequest(req.id_req)} className="delete-request-btn">✕</button>
                    </div>
                  </div>
                  <div className="request-details">
                    <p><strong>Клиент:</strong> {req.client_name} ({req.client_email})</p>
                    <p><strong>Телефон:</strong> {req.client_phone || 'не указан'}</p>
                    <p><strong>Дата:</strong> {new Date(req.created_at).toLocaleDateString()}</p>
                    <p><strong>Заказчик:</strong> {req.client_type}</p>
                    <p><strong>Объект оценки:</strong> {req.project_type}</p>
                    <p><strong>Ограничения:</strong> {req.has_restrictions ? 'Да' : 'Нет'}</p>
                    <p><strong>Цель оценки:</strong> {req.purpose}</p>
                    <p><strong>Описание:</strong> {req.description || '—'}</p>

                    <div><strong>Комментарий оценщика:</strong></div>
                    <textarea className="admin-comment-area" rows="2" value={editingComments[req.id_req] || ''} onChange={(e) => setEditingComments(prev => ({ ...prev, [req.id_req]: e.target.value }))}></textarea>

                    <div className="file-section"><span>Документы клиента:</span>
                      {files[req.id_req]?.client_doc?.map((file) => (
                        <div key={file.id_doc} className="file-item"><span className="file-name" onClick={() => downloadFile(file.id_doc, file.file_name)}>{file.file_name}</span><button className="delete-file" onClick={() => deleteFile(file.id_doc, req.id_req)}>✕</button></div>
                      ))}
                    </div>

                    <div className="file-section"><span>Договор (от оценщика):</span>
                      {files[req.id_req]?.contract?.map((file) => (
                        <div key={file.id_doc} className="file-item"><span className="file-name" onClick={() => downloadFile(file.id_doc, file.file_name)}>{file.file_name}</span><button className="delete-file" onClick={() => deleteFile(file.id_doc, req.id_req)}>✕</button></div>
                      ))}
                      <button className="file-btn" onClick={() => handleFileSelect(req.id_req, 'contract')} disabled={uploadingId === req.id_req}><i className="fas fa-upload"></i> Загрузить договор</button>
                    </div>

                    <div className="file-section"><span>Подписанный договор (от клиента):</span>
                      {files[req.id_req]?.contract_signed?.map((file) => (
                        <div key={file.id_doc} className="file-item"><span className="file-name" onClick={() => downloadFile(file.id_doc, file.file_name)}>{file.file_name}</span><button className="delete-file" onClick={() => deleteFile(file.id_doc, req.id_req)}>✕</button></div>
                      ))}
                    </div>

                    <div className="file-section"><span>Итоговый отчёт:</span>
                      {files[req.id_req]?.report?.map((file) => (
                        <div key={file.id_doc} className="file-item"><span className="file-name" onClick={() => downloadFile(file.id_doc, file.file_name)}>{file.file_name}</span><button className="delete-file" onClick={() => deleteFile(file.id_doc, req.id_req)}>✕</button></div>
                      ))}
                      <button className="file-btn" onClick={() => handleFileSelect(req.id_req, 'report')} disabled={uploadingId === req.id_req}><i className="fas fa-upload"></i> Загрузить отчёт</button>
                    </div>

                    <button className="btn-save" onClick={() => updateRequestStatus(req.id_req, editingStatuses[req.id_req], editingComments[req.id_req])}>Сохранить изменения</button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Контент - квалификация */}
          <div className={`cabinet-panel ${activeTab === 'content' ? 'active' : ''}`}>
            <div className="panel-header"><h3>Квалификация</h3></div>
            <div className="content-editor">
              <h4>Приветственный текст</h4>
              <textarea rows="3" value={qualTexts.welcome_text} onChange={(e) => setQualTexts({ ...qualTexts, welcome_text: e.target.value })}></textarea>
              <button onClick={() => saveQualContent('welcome_text')}>Сохранить</button>
            </div>
            <div className="content-editor">
              <h4>Список квалификации</h4>
              <textarea rows="6" value={qualTexts.qual_list} onChange={(e) => setQualTexts({ ...qualTexts, qual_list: e.target.value })}></textarea>
              <button onClick={() => saveQualContent('qual_list')}>Сохранить</button>
            </div>
            <div className="content-editor">
              <h4>Образование</h4>
              <textarea rows="2" value={qualTexts.education} onChange={(e) => setQualTexts({ ...qualTexts, education: e.target.value })}></textarea>
              <button onClick={() => saveQualContent('education')}>Сохранить</button>
            </div>
            <div className="content-editor">
              <h4>Законодательство</h4>
              <textarea rows="2" value={qualTexts.law} onChange={(e) => setQualTexts({ ...qualTexts, law: e.target.value })}></textarea>
              <button onClick={() => saveQualContent('law')}>Сохранить</button>
            </div>
            <div className="content-editor">
              <h4>Объекты оценки</h4>
              <textarea rows="2" value={qualTexts.valuation_objects} onChange={(e) => setQualTexts({ ...qualTexts, valuation_objects: e.target.value })}></textarea>
              <button onClick={() => saveQualContent('valuation_objects')}>Сохранить</button>
            </div>
            <div className="content-editor">
              <h4>Цели оценки</h4>
              <textarea rows="2" value={qualTexts.valuation_purposes} onChange={(e) => setQualTexts({ ...qualTexts, valuation_purposes: e.target.value })}></textarea>
              <button onClick={() => saveQualContent('valuation_purposes')}>Сохранить</button>
            </div>
          </div>

          {/* Отзывы */}
          <div className={`cabinet-panel ${activeTab === 'reviews' ? 'active' : ''}`}>
            <div className="panel-header"><h3>Отзывы</h3></div>
            {reviews.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '20px', color: '#B8AFA0' }}>Нет отзывов</div>
            ) : (
              reviews.map((review) => (
                <div key={review.id_rev} className="request-card" style={{ background: 'white' }}>
                  <div className="request-header">
                    <span className="request-object">{review.author}</span>
                    <div className="stars" style={{ color: '#F5A623' }}>{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</div>
                  </div>
                  <div className="request-details">
                    <p><strong>Дата:</strong> {new Date(review.created_at).toLocaleDateString()}</p>
                    <p><strong>Отзыв:</strong> {review.text}</p>
                    <button onClick={() => deleteReview(review.id_rev)} style={{ color: '#c44', background: 'none', border: '1px solid #c44', padding: '8px 16px', borderRadius: '30px', cursor: 'pointer' }}>Удалить отзыв</button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Цены недвижимость */}
          <div className={`cabinet-panel ${activeTab === 'prices_needs' ? 'active' : ''}`}>
            <div className="panel-header"><h3>Цены недвижимость</h3><button onClick={savePriceNeeds} className="btn-save">Сохранить все цены</button></div>
            {loadingPrices ? <div>Загрузка...</div> : Object.entries(needsCategories).map(([category, keys]) => (
              <div key={category} className="price-card" style={{ marginBottom: '20px' }}>
                <h4>{category}</h4>
                {keys.map(key => pricesNeeds[key] && (
                  <div key={key} className="file-section" style={{ justifyContent: 'space-between' }}>
                    <span style={{ flex: 2 }}>{pricesNeeds[key].name}</span>
                    <input type="text" value={pricesNeeds[key].term} onChange={(e) => setPricesNeeds(prev => ({ ...prev, [key]: { ...prev[key], term: e.target.value } }))} style={{ width: '130px', padding: '8px', borderRadius: '30px', border: '1px solid var(--border)', textAlign: 'center' }} />
                    <input type="text" value={pricesNeeds[key].price} onChange={(e) => setPricesNeeds(prev => ({ ...prev, [key]: { ...prev[key], price: e.target.value } }))} style={{ width: '120px', padding: '8px', borderRadius: '30px', border: '1px solid var(--border)', textAlign: 'center' }} />
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Цены движимое */}
          <div className={`cabinet-panel ${activeTab === 'prices_movable' ? 'active' : ''}`}>
            <div className="panel-header"><h3>Цены движимое</h3><button onClick={savePriceMovable} className="btn-save">Сохранить все цены</button></div>
            {loadingPrices ? <div>Загрузка...</div> : Object.entries(movableCategories).map(([category, keys]) => (
              <div key={category} className="price-card" style={{ marginBottom: '20px' }}>
                <h4>{category}</h4>
                {keys.map(key => pricesMovable[key] && (
                  <div key={key} className="file-section" style={{ justifyContent: 'space-between' }}>
                    <span style={{ flex: 2 }}>{pricesMovable[key].name}</span>
                    <input type="text" value={pricesMovable[key].term} onChange={(e) => setPricesMovable(prev => ({ ...prev, [key]: { ...prev[key], term: e.target.value } }))} style={{ width: '130px', padding: '8px', borderRadius: '30px', border: '1px solid var(--border)', textAlign: 'center' }} />
                    <input type="text" value={pricesMovable[key].price} onChange={(e) => setPricesMovable(prev => ({ ...prev, [key]: { ...prev[key], price: e.target.value } }))} style={{ width: '120px', padding: '8px', borderRadius: '30px', border: '1px solid var(--border)', textAlign: 'center' }} />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}

export default AdminPage;