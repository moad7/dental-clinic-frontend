import React from 'react';

const WelcomeHeader = () => {
  return (
    <div className="container-box header-box">
      <span className="greeting-title">בוקר טוב, מואד!</span>
      <span className="greeting-subtitle">
        הנה סקירה כללית של ההזמנות שלך היום.
      </span>
    </div>
  );
};

export default WelcomeHeader;
