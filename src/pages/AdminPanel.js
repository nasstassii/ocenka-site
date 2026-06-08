import React, { useState, useEffect } from 'react';

function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [qualTexts, setQualTexts] = useState({
    welcome_text: '', qual_list: '', education: '', law: '', valuation_objects: '', valuation_purposes: ''
  });
  const [pricesNeeds, setPricesNeeds] = useState({});
  const [pricesMovable, setPricesMovable] = useState({});
  const [loadingPrices, setLoadingPrices] = useState(true);
  const [documents, setDocuments] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState('prices');
  const [showNewDocForm, setShowNewDocForm] = useState(false);
  const [newDocKey, setNewDocKey] = useState('');
  const [newDocName, setNewDocName] = useState('');
  const [newDocFile, setNewDocFile] = useState(null);

  useEffect(() => {
    const auth = sessionStorage.getItem('admin_auth');
    if (auth === 'true') {
      setIsAuthenticated(true);
      loadQualification();
      loadPrices();
      loadDocuments();
    }
  }, []);

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('http://localhost:5000/api/content/admin/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      const data = await response.json();
      if (data.success) {
        sessionStorage.setItem('admin_auth', 'true');
        setIsAuthenticated(true);
        setError('');
        loadQualification();
        loadPrices();
        loadDocuments();
      } else {
        setError('Неверный пароль');
      }
    } catch (err) {
      console.error('Ошибка:', err);
      setError('Ошибка подключения к серверу. Убедитесь, что бэкенд запущен на порту 5000');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('admin_auth');
    setIsAuthenticated(false);
    setPassword('');
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

  const savePriceNeeds = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/content/prices_needs/bulk', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prices: pricesNeeds })
      });
      const data = await response.json();
      if (data.success) alert('Цены сохранены');
      else alert('Ошибка сохранения');
    } catch (err) {
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
      if (data.success) alert('Цены сохранены');
      else alert('Ошибка сохранения');
    } catch (err) {
      alert('Ошибка подключения к серверу');
    }
  };

  const loadDocuments = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/content/documents/list');
      const data = await response.json();
      setDocuments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Ошибка загрузки документов:', err);
    }
  };

  const uploadDocument = async (docKey, file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('doc_key', docKey);

    setUploading(true);
    try {
      const response = await fetch('http://localhost:5000/api/content/documents/upload', {
        method: 'POST',
        body: formData
      });
      const data = await response.json();
      if (data.success) {
        alert('Документ загружен');
        loadDocuments();
      } else {
        alert('Ошибка загрузки');
      }
    } catch (err) {
      alert('Ошибка подключения к серверу');
    } finally {
      setUploading(false);
    }
  };

  const addNewDocument = async () => {
    if (!newDocKey || !newDocName || !newDocFile) {
      alert('Заполните все поля и выберите файл');
      return;
    }

    const formData = new FormData();
    formData.append('file', newDocFile);
    formData.append('doc_key', newDocKey);
    formData.append('doc_name', newDocName);

    try {
      const response = await fetch('http://localhost:5000/api/content/documents/add', {
        method: 'POST',
        body: formData
      });
      const data = await response.json();
      if (data.success) {
        alert('Документ добавлен');
        setShowNewDocForm(false);
        setNewDocKey('');
        setNewDocName('');
        setNewDocFile(null);
        loadDocuments();
      } else {
        alert('Ошибка: ' + (data.error || 'неизвестная ошибка'));
      }
    } catch (err) {
      alert('Ошибка подключения к серверу');
    }
  };

  const deleteDocument = async (docKey) => {
    if (!window.confirm('Удалить этот документ?')) return;
    try {
      const response = await fetch(`http://localhost:5000/api/content/documents/delete/${docKey}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      if (data.success) {
        alert('Документ удалён');
        loadDocuments();
      } else {
        alert('Ошибка удаления');
      }
    } catch (err) {
      alert('Ошибка подключения к серверу');
    }
  };

  const handleFileSelect = (docKey) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,.jpg,.jpeg,.png';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) uploadDocument(docKey, file);
    };
    input.click();
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

  if (!isAuthenticated) {
    return (
      <div className="admin-login">
        <div className="admin-login-card">
          <h2>Вход в админ-панель</h2>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Введите пароль"
            onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
          />
          <button onClick={handleLogin} disabled={loading}>
            {loading ? 'Проверка...' : 'Войти'}
          </button>
          {error && <p className="admin-error">{error}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <div>
          <h1>Админ-панель</h1>
          <p>Управление контентом сайта</p>
        </div>
        <button className="admin-logout-btn" onClick={handleLogout}>Выйти</button>
      </div>

      <div className="admin-tabs">
        <button className={activeTab === 'prices' ? 'active' : ''} onClick={() => setActiveTab('prices')}>Цены</button>
        <button className={activeTab === 'qualification' ? 'active' : ''} onClick={() => setActiveTab('qualification')}>Квалификация</button>
        <button className={activeTab === 'documents' ? 'active' : ''} onClick={() => setActiveTab('documents')}>Документы</button>
      </div>

      <div className="admin-content">
        {activeTab === 'prices' && (
          <>
            <div className="admin-card">
              <h2>🏠 Цены на недвижимость</h2>
              {loadingPrices ? <div>Загрузка...</div> : Object.entries(needsCategories).map(([category, keys]) => (
                <div key={category} className="admin-price-category">
                  <h4>{category}</h4>
                  {keys.map(key => pricesNeeds[key] && (
                    <div key={key} className="admin-price-row">
                      <span className="admin-price-name">{pricesNeeds[key].name}</span>
                      <input type="text" value={pricesNeeds[key].term} onChange={(e) => setPricesNeeds(prev => ({ ...prev, [key]: { ...prev[key], term: e.target.value } }))} placeholder="Срок" />
                      <input type="text" value={pricesNeeds[key].price} onChange={(e) => setPricesNeeds(prev => ({ ...prev, [key]: { ...prev[key], price: e.target.value } }))} placeholder="Цена" />
                    </div>
                  ))}
                </div>
              ))}
              <button className="admin-save-btn" onClick={savePriceNeeds}>Сохранить все цены</button>
            </div>

            <div className="admin-card">
              <h2>🚗 Цены на движимое имущество</h2>
              {loadingPrices ? <div>Загрузка...</div> : Object.entries(movableCategories).map(([category, keys]) => (
                <div key={category} className="admin-price-category">
                  <h4>{category}</h4>
                  {keys.map(key => pricesMovable[key] && (
                    <div key={key} className="admin-price-row">
                      <span className="admin-price-name">{pricesMovable[key].name}</span>
                      <input type="text" value={pricesMovable[key].term} onChange={(e) => setPricesMovable(prev => ({ ...prev, [key]: { ...prev[key], term: e.target.value } }))} placeholder="Срок" />
                      <input type="text" value={pricesMovable[key].price} onChange={(e) => setPricesMovable(prev => ({ ...prev, [key]: { ...prev[key], price: e.target.value } }))} placeholder="Цена" />
                    </div>
                  ))}
                </div>
              ))}
              <button className="admin-save-btn" onClick={savePriceMovable}>Сохранить все цены</button>
            </div>
          </>
        )}

        {activeTab === 'qualification' && (
          <div className="admin-card">
            <h2>📜 Тексты квалификации</h2>
            
            <div className="admin-qual-field">
              <label>Приветственный текст</label>
              <textarea rows="3" value={qualTexts.welcome_text} onChange={(e) => setQualTexts({ ...qualTexts, welcome_text: e.target.value })} />
              <button onClick={() => saveQualContent('welcome_text')}>Сохранить</button>
            </div>

            <div className="admin-qual-field">
              <label>Список квалификации (каждый пункт с новой строки, начинать с •)</label>
              <textarea rows="6" value={qualTexts.qual_list} onChange={(e) => setQualTexts({ ...qualTexts, qual_list: e.target.value })} />
              <button onClick={() => saveQualContent('qual_list')}>Сохранить</button>
            </div>

            <div className="admin-qual-field">
              <label>Образование</label>
              <textarea rows="2" value={qualTexts.education} onChange={(e) => setQualTexts({ ...qualTexts, education: e.target.value })} />
              <button onClick={() => saveQualContent('education')}>Сохранить</button>
            </div>

            <div className="admin-qual-field">
              <label>Законодательство</label>
              <textarea rows="2" value={qualTexts.law} onChange={(e) => setQualTexts({ ...qualTexts, law: e.target.value })} />
              <button onClick={() => saveQualContent('law')}>Сохранить</button>
            </div>

            <div className="admin-qual-field">
              <label>Объекты оценки</label>
              <textarea rows="2" value={qualTexts.valuation_objects} onChange={(e) => setQualTexts({ ...qualTexts, valuation_objects: e.target.value })} />
              <button onClick={() => saveQualContent('valuation_objects')}>Сохранить</button>
            </div>

            <div className="admin-qual-field">
              <label>Цели оценки</label>
              <textarea rows="2" value={qualTexts.valuation_purposes} onChange={(e) => setQualTexts({ ...qualTexts, valuation_purposes: e.target.value })} />
              <button onClick={() => saveQualContent('valuation_purposes')}>Сохранить</button>
            </div>
          </div>
        )}

        {activeTab === 'documents' && (
          <div className="admin-card">
            <h2>📄 Документы для страницы квалификации</h2>
            
            <button className="admin-add-btn" onClick={() => setShowNewDocForm(true)}>+ Добавить новый документ</button>
            
            {showNewDocForm && (
              <div className="admin-new-doc-form">
                <h4>Новый документ</h4>
                <input type="text" placeholder="doc_key (на английском, например: diploma_2010)" value={newDocKey} onChange={(e) => setNewDocKey(e.target.value)} />
                <input type="text" placeholder="Название документа (для отображения на сайте)" value={newDocName} onChange={(e) => setNewDocName(e.target.value)} />
                <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => setNewDocFile(e.target.files[0])} />
                <div className="admin-form-buttons">
                  <button onClick={addNewDocument}>Добавить</button>
                  <button onClick={() => setShowNewDocForm(false)}>Отмена</button>
                </div>
              </div>
            )}
            
            {documents.length === 0 ? (
              <div>Загрузка документов...</div>
            ) : (
              documents.map(doc => (
                <div key={doc.id_doc} className="admin-doc-item">
                  <span>{doc.doc_name}</span>
                  <div>
                    <a href={doc.file_path} target="_blank" rel="noopener noreferrer" className="admin-doc-view">Просмотреть</a>
                    <button onClick={() => handleFileSelect(doc.doc_key)} disabled={uploading}>Заменить</button>
                    <button onClick={() => deleteDocument(doc.doc_key)} style={{ background: '#c44' }}>Удалить</button>
                  </div>
                </div>
              ))
            )}
            <p className="admin-doc-note">Поддерживаемые форматы: PDF, JPG, JPEG, PNG</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminPanel;