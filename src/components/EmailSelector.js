import React, { useState, useEffect, useRef } from 'react';

function EmailSelector({ buttonText, className }) {
  const [showSelector, setShowSelector] = useState(false);
  const wrapperRef = useRef(null);

  const email = 'bakalenko-olga@yandex.ru';
  const subject = encodeURIComponent('Заявка на оценку имущества');
  const body = encodeURIComponent('Здравствуйте, Ольга!\n\nМеня интересует оценка имущества.\n\nС уважением,\n');

  const services = {
    yandex: `https://mail.yandex.ru/compose?to=${email}&subject=${subject}&body=${body}`,
    gmail: `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${subject}&body=${body}`,
    mailru: `https://e.mail.ru/compose?to=${email}&subject=${subject}&body=${body}`
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSelector(false);
      }
    };

    if (showSelector) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSelector]);

  const handleServiceSelect = (serviceKey) => {
    window.open(services[serviceKey], '_blank');
    setShowSelector(false);
  };

  return (
    <div className="email-selector-wrapper" ref={wrapperRef}>
      <button 
        onClick={() => setShowSelector(!showSelector)} 
        className={className}
      >
        {buttonText}
      </button>
      
      {showSelector && (
        <div className="email-selector-dropdown">
          <p>Выберите почтовый сервис:</p>
          <button onClick={() => handleServiceSelect('yandex')}>Яндекс Почта</button>
          <button onClick={() => handleServiceSelect('gmail')}>Gmail</button>
          <button onClick={() => handleServiceSelect('mailru')}>Mail.ru</button>
        </div>
      )}
    </div>
  );
}

export default EmailSelector;