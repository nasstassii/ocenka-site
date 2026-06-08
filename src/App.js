import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './index.css';
import HomePage from './pages/HomePage';
import ServicesPage from './pages/ServicesPage';
import QualificationsPage from './pages/QualificationsPage';
import AdminPanel from './pages/AdminPanel';
//import CookieConsent from './components/CookieConsent';

/*
function YandexMetrikaTracker() {
  const location = useLocation();

  useEffect(() => {
    if (window.ym) {
      window.ym(109213929, 'hit', location.pathname + location.search);
    }
  }, [location]);

  return null;
}
*/

function ScrollToTopWrapper({ children }) {
  const { pathname } = useLocation();

  useEffect(() => {
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
        </Routes>
        {/*<YandexMetrikaTracker />
        <CookieConsent />*/}
      </ScrollToTopWrapper>
    </Router>
  );
}

export default App;