import React, { useState, useEffect } from 'react';

function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent');
    if (consent === null) {
      setIsVisible(true);
    } else if (consent === 'accepted') {
      loadMetrika();
    }
    // Если отказался - Метрика НЕ загружается
  }, []);

  // Загружаем Метрику ТОЛЬКО после согласия
  const loadMetrika = () => {
    if (document.querySelector('script[src*="mc.yandex.ru/metrika/tag.js"]')) {
      return;
    }

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.innerHTML = `
      (function(m,e,t,r,i,k,a){
        m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
        m[i].l=1*new Date();
        for (var j = 0; j < document.scripts.length; j++) {
          if (document.scripts[j].src === r) { return; }
        }
        k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
      })(window, document,'script','https://mc.yandex.ru/metrika/tag.js?id=109213929', 'ym');
    
      ym(109213929, 'init', {
        clickmap: true,
        trackLinks: true,
        accurateTrackBounce: true,
        webvisor: true
      });
    `;
    document.head.appendChild(script);
  };

  const acceptCookies = () => {
    localStorage.setItem('cookie_consent', 'accepted');
    setIsVisible(false);
    loadMetrika();
  };

  const declineCookies = () => {
    localStorage.setItem('cookie_consent', 'declined');
    setIsVisible(false);
    // Метрика НЕ загружается
  };

  if (!isVisible) return null;

  return (
    <div className="cookie-consent">
      <div className="cookie-consent-content">
        <div className="cookie-icon">
          <i className="fas fa-cookie-bite"></i>
        </div>
        <div className="cookie-text">
          <p>
            На сайте используются файлы cookies для сбора статистики посещаемости 
            и обеспечения корректной работы функций сайта. Продолжая использование сайта, 
            вы соглашаетесь с обработкой cookies. Подробнее в 
            <a href="/privacy" target="_blank" rel="noopener noreferrer"> Политике конфиденциальности</a>.
          </p>
        </div>
        <div className="cookie-buttons">
          <button onClick={acceptCookies} className="cookie-btn-accept">
            Согласен
          </button>
          <button onClick={declineCookies} className="cookie-btn-decline">
            Отказаться
          </button>
        </div>
      </div>
    </div>
  );
}

export default CookieConsent;