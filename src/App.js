import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './index.css';
import AuthModal from './components/AuthModal';
import HomePage from './pages/HomePage';
import ServicesPage from './pages/ServicesPage';
import QualificationsPage from './pages/QualificationsPage';
import CabinetPage from './pages/CabinetPage';
import AdminPage from './pages/AdminPage';
import PrivacyPage from './pages/PrivacyPage';

// Компонент-обёртка для прокрутки вверх
function ScrollToTopWrapper({ children }) {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return children;
}

function App() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  return (
    <Router>
      <ScrollToTopWrapper>
        <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
        
        <Routes>
          <Route path="/" element={<HomePage onOpenAuth={() => setIsAuthOpen(true)} />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/qualifications" element={<QualificationsPage />} />
          <Route path="/cabinet" element={<CabinetPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
        </Routes>
      </ScrollToTopWrapper>
    </Router>
  );
}

export default App;
