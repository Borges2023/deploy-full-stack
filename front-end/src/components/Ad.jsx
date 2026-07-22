import React, { useEffect, useState } from "react";
import "./Ad.css";

const Ad = ({ title, description, logo, link, onClose, countdownSeconds = 10 }) => {
  const [remainingSeconds, setRemainingSeconds] = useState(countdownSeconds);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setRemainingSeconds((currentValue) => {
        if (currentValue <= 1) {
          clearInterval(intervalId);
          onClose?.();
          return 0;
        }

        return currentValue - 1;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [onClose]);

  return (
    <div className="ad-overlay">
      <div className="ad-container">
        <button className="ad-close" onClick={onClose}>
          ✕
        </button>

        <div className="ad-content">
          <div className="ad-header">
            <img src={logo} alt="Logo do anúncio" className="ad-logo" />
          </div>

          <div className="ad-body">
            <h3 className="ad-title">{title}</h3>
            <p className="ad-description">{description}</p>
          </div>

          <div className="ad-footer">
            <a href={link} target="_blank" rel="noopener noreferrer" className="ad-button">
              Saiba Mais
            </a>
          </div>

          <div className="ad-countdown" aria-live="polite">
            Fechando em {remainingSeconds}s
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ad;
