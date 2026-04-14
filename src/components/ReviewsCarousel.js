import React, { useState, useEffect, useRef } from 'react';

function ReviewsCarousel({ reviews = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(3);
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
    if (trackRef.current && trackRef.current.children[0]) {
      const cardWidth = trackRef.current.children[0].offsetWidth + 28.8;
      trackRef.current.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
    }
  }, [currentIndex, cardsPerView, reviews]);

  const nextSlide = () => {
    if (currentIndex + cardsPerView < reviews.length) setCurrentIndex(currentIndex + 1);
  };

  const prevSlide = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  if (reviews.length === 0) {
    return <div style={{ textAlign: 'center', padding: '2rem' }}>Пока нет отзывов. Будьте первым!</div>;
  }

  return (
    <div className="reviews-container">
      <button onClick={prevSlide} className="review-slider-btn review-slider-prev"><i className="fas fa-chevron-left"></i></button>
      <div className="reviews-slider">
        <div className="reviews-track" ref={trackRef}>
          {reviews.map((review, idx) => (
            <div key={idx} className="review-card">
              <div className="stars">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</div>
              <div className="review-text">«{review.text}»</div>
              <div className="review-author">— {review.author}</div>
            </div>
          ))}
        </div>
      </div>
      <button onClick={nextSlide} className="review-slider-btn review-slider-next"><i className="fas fa-chevron-right"></i></button>
    </div>
  );
}

export default ReviewsCarousel;