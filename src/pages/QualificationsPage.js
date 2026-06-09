import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

function QualificationsPage() {
  const [content, setContent] = useState({});
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadContent();
    loadDocuments();
  }, []);

  const loadContent = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/content/qual/all');
      const data = await response.json();
      setContent(data);
    } catch (err) {
      console.error('Ошибка загрузки квалификации:', err);
    }
  };

  const loadDocuments = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/content/documents/list');
      const data = await response.json();
      setDocuments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Ошибка загрузки документов:', err);
    } finally {
      setLoading(false);
    }
  };

  const getQualListItems = (text) => {
    if (!text) return [];
    return text.split('\n').filter(line => line.trim().startsWith('•')).map(line => line.replace('•', '').trim());
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="loading-spinner">Загрузка...</div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      
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
              {documents.length === 0 ? (
                <p>Документы не загружены</p>
              ) : (
                documents.map((doc) => (
                  <div key={doc.id_doc} className="doc-simple">
                    <span className="doc-name">{doc.doc_name}</span>
                    <a 
                      href={doc.file_path} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="doc-link-btn"
                    >
                      Просмотреть
                    </a>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default QualificationsPage;