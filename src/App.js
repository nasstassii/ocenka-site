import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './index.css';
import HomePage from './pages/HomePage';
import ServicesPage from './pages/ServicesPage';
import QualificationsPage from './pages/QualificationsPage';
import AdminPanel from './pages/AdminPanel';
import PrivacyPage from './pages/PrivacyPage';

function ScrollToTopWrapper({ children }) {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return children;
}

function App() {
  return (
    <Router>
      <ScrollToTopWrapper>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/qualifications" element={<QualificationsPage />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/privacy" element={<PrivacyPage />} />
        </Routes>
      </ScrollToTopWrapper>
    </Router>
  );
}

export default App;