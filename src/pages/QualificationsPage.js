import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

function QualificationsPage() {
  const [content, setContent] = useState({});
  const [loading, setLoading] = useState(true);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/content/qual/all');
      const data = await response.json();
      setContent(data);
    } catch (err) {
      console.error('Ошибка загрузки:', err);
    } finally {
      setLoading(false);
    }
  };

  const getQualListItems = (text) => {
    if (!text) return [];
    return text.split('\n').filter(line => line.trim().startsWith('•')).map(line => line.replace('•', '').trim());
  };

  const downloadFile = (filePath, fileName) => {
    const link = document.createElement('a');
    link.href = filePath;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return <div className="loading-spinner">Загрузка...</div>;

  return (
    <>
      <Header onOpenAuth={() => setIsAuthOpen(true)} />
      
      <section className="page-hero">
        <div className="container">
          <h1>Квалификационные документы</h1>
          <p>Дипломы, аттестаты, сертификаты и свидетельства</p>
        </div>
      </section>

      <section className="welcome-section">
        <div className="container">
          <div className="welcome-card">
            <p>{content.welcome_text}</p>
            <p>Моя квалификация соответствует всем требованиям законодательства, предъявляемым к частнопрактикующему оценщику:</p>
            <ul className="qual-list">
              {getQualListItems(content.qual_list).map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
            <p>{content.education}</p>
            <p>{content.law}</p>
            <p>{content.valuation_objects}</p>
            <p>{content.valuation_purposes}</p>
          </div>
        </div>
      </section>

      <section className="welcome-section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="welcome-card">
            <h3>Документы</h3>
            <div className="docs-block">
              <div className="doc-simple">
                <span className="doc-name">Квалификационный аттестат — Оценка недвижимости (№ 038432-1)</span>
                <button onClick={() => downloadFile('/documents/2. Бакаленко О.М. недвижимость 2024-06-07.pdf', 'Бакаленко О.М. недвижимость 2024-06-07.pdf')} className="doc-link-btn">
                  Скачать PDF
                </button>
              </div>
              <div className="doc-simple">
                <span className="doc-name">Квалификационный аттестат — Оценка движимого имущества (№ 037098-2)</span>
                <button onClick={() => downloadFile('/documents/3. Бакаленко О.М. движимое имущ. 2024-05-24.pdf', 'Бакаленко О.М. движимое имущество 2024-05-24.pdf')} className="doc-link-btn">
                  Скачать PDF
                </button>
              </div>
              <div className="doc-simple">
                <span className="doc-name">Свидетельство СРО «НКСО» (рег. № 02082)</span>
                <button onClick={() => downloadFile('/documents/1. Свидетельство НКСО.png', 'Свидетельство НКСО.png')} className="doc-link-btn">
                  Скачать PNG
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default QualificationsPage;