import React from 'react';
import './ResultPage.css';

// You can pass `roundness` and `imageSrc` as props if dynamic
export default function ResultPage({
  roundness = 0.89,
  imageSrc = '/assets/sample-analyzed-chapati.png',
}) {
  const getComment = () => {
    if (roundness >= 0.95) return "Perfectly imperfect!";
    if (roundness >= 0.85) return "This roti’s trying its best!";
    return "More like a potato than a chapati 😄";
  };

  return (
    <div className="results-container">
      <h1 className="wabi-title">Wabi Roti</h1>
      <div className="content-wrapper">
        <div className="image-box">
          <img
            src={imageSrc}
            alt="Analyzed Chapati"
            className="chapati-image"
          />
        </div>

        <div className="info-box">
          <p className="label">Roundness Value:</p>
          <p className="value">{roundness.toFixed(2)}</p>
          <p className="comment">{getComment()}</p>
        </div>
      </div>
    </div>
  );
}
