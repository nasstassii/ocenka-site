import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AuthModal from '../components/AuthModal';

function QualificationsPage() {
  const [content, setContent] = useState({});
  const [loading, setLoading] = useState(true);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      const response = await fetch('https://ocenka-bakalenko.ru/api/content/qual/all');
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

  if (loading) return (
    <>
      <Header onOpenAuth={() => setIsAuthOpen(true)} />
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      <div className="loading-spinner">Загрузка...</div>
      <Footer onOpenAuth={() => setIsAuthOpen(true)} />
    </>
  );

  return (
    <>
      <Header onOpenAuth={() => setIsAuthOpen(true)} />
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      
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
    <button onClick={() => window.open('/documents/Аттестат_недвижимость.pdf', '_blank')} className="doc-link-btn">
      Открыть PDF
    </button>
  </div>
  <div className="doc-simple">
    <span className="doc-name">Квалификационный аттестат — Оценка движимого имущества (№ 037098-2)</span>
    <button onClick={() => window.open('/documents/Аттестат_движимое.pdf', '_blank')} className="doc-link-btn">
      Открыть PDF
    </button>
  </div>
  <div className="doc-simple">
    <span className="doc-name">Свидетельство СРО «НКСО» (рег. № 02082)</span>
    <button onClick={() => window.open('/documents/Свидетельство_НКСО.pdf', '_blank')} className="doc-link-btn">
      Открыть PNG
    </button>
  </div>
</div>
          </div>
        </div>
      </section>

      <Footer onOpenAuth={() => setIsAuthOpen(true)} />
    </>
  );
}

export default QualificationsPage;