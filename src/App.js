import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';

// Компоненты
import AuthModal from './components/AuthModal';

// Страницы
import HomePage from './pages/HomePage';
import ServicesPage from './pages/ServicesPage';
import QualificationsPage from './pages/QualificationsPage';
import CabinetPage from './pages/CabinetPage';
import AdminPage from './pages/AdminPage';

function App() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  return (
    <Router>
      {/* Header УБРАН отсюда - теперь он внутри каждой страницы, где нужен */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      
      <Routes>
        <Route path="/" element={<HomePage onOpenAuth={() => setIsAuthOpen(true)} />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/qualifications" element={<QualificationsPage />} />
        <Route path="/cabinet" element={<CabinetPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </Router>
  );
}

export default App;
