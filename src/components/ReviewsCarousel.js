import React, { useState, useEffect, useRef } from 'react';

function ReviewsCarousel({ reviews = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(3);
  const [expandedIndex, setExpandedIndex] = useState(null); // Просто индекс, а не ID
  const trackRef = useRef(null);

  useEffect(() => {
    const updateCardsPerView = () => {
      const width = window.innerWidth;
      if (width < 600) setCardsPerView(1);
      else if (width < 900) setCardsPerView(2);
      else setCardsPerView(3);
    };
    updateCardsPerView();
    window.addEventListener('resize', updateCardsPerView);
    return () => window.removeEventListener('resize', updateCardsPerView);
  }, []);

  useEffect(() => {
    setCurrentIndex(0);
    setExpandedIndex(null);
  }, [reviews.length, cardsPerView]);

  useEffect(() => {
    if (trackRef.current && trackRef.current.children.length > 0) {
      const cardWidth = trackRef.current.children[0].offsetWidth + 28.8;
      trackRef.current.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
    }
  }, [currentIndex, cardsPerView, reviews]);

  const nextSlide = () => {
    if (currentIndex + cardsPerView < reviews.length) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const toggleExpand = (idx) => {
    // Если нажали на ту же карточку - сворачиваем, если на другую - разворачиваем её
    setExpandedIndex(expandedIndex === idx ? null : idx);
  };

  const truncateText = (text) => {
    if (!text) return '';
    if (text.length <= 140) return text;
    return text.slice(0, 140) + '...';
  };

  if (!reviews || reviews.length === 0) {
    return <div style={{ textAlign: 'center', padding: '2rem' }}>Пока нет отзывов</div>;
  }

  return (
    <div className="reviews-container">
      <button 
        onClick={prevSlide} 
        disabled={currentIndex === 0} 
        className="review-slider-btn review-slider-prev"
      >
        <i className="fas fa-chevron-left"></i>
      </button>
      
      <div className="reviews-slider">
        <div className="reviews-track" ref={trackRef}>
          {reviews.map((review, idx) => {
            const isExpanded = expandedIndex === idx;
            const displayText = isExpanded ? review.text : truncateText(review.text);
            const showButton = review.text && review.text.length > 140;

            return (
              <div 
                key={idx} 
                className={`review-card ${isExpanded ? 'expanded' : ''}`}
              >
                <div className="stars">
                  {'★'.repeat(review.rating)}
                  {'☆'.repeat(5 - review.rating)}
                </div>
                <div className="review-text">
                  «{displayText}»
                  {showButton && (
                    <button 
                      className="read-more-btn" 
                      onClick={() => toggleExpand(idx)}
                    >
                      {isExpanded ? 'Свернуть' : 'Читать дальше'}
                    </button>
                  )}
                </div>
                <div className="review-author">— {review.author}</div>
              </div>
            );
          })}
        </div>
      </div>
      
      <button 
        onClick={nextSlide} 
        disabled={currentIndex + cardsPerView >= reviews.length} 
        className="review-slider-btn review-slider-next"
      >
        <i className="fas fa-chevron-right"></i>
      </button>
    </div>
  );
}

export default ReviewsCarousel;