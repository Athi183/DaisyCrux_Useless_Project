import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './ResultPage.css';

export default function ResultPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state;

  if (!data) {
    return (
      <div className="results-container">
        <h2>No data found.</h2>
        <button onClick={() => navigate('/')} className="back-button">
          Back to Upload
        </button>
      </div>
    );
  }

  const { roundness, burn_count, contour_image, burn_image } = data;

  const getComment = () => {
    if (roundness >= 0.95) return "Perfectly imperfect! 🥇";
    if (roundness >= 0.85) return "This roti’s trying its best! 💪";
    return "More like a potato than a chapati 😄";
  };

  return (
    <div className="results-container">
      <h1 className="wabi-title">Wabi Roti Results 🍪</h1>

      <div className="content-wrapper">
        {/* Image Section */}
        <div className="image-box">
          <div>
            <h3>Contour Detection</h3>
            <p>Roundness: {roundness?.toFixed(2)}</p>
            <img
              src={`data:image/png;base64,${contour_image}`}
              alt="Contour"
            />
          </div>

          <div>
            <h3>Burn Detection</h3>
            <img
              src={`data:image/png;base64,${burn_image}`}
              alt="Burnt Spots"
            />
            <p>Burn Count: {burn_count}</p>
          </div>
        </div>

        {/* Info Section */}
        <div className="info-box">
          <p className="label">Roundness Value:</p>
          <p className="value">{roundness?.toFixed(2)}</p>
          <p className="label">Burnt Spots:</p>
          <p className="value">{burn_count}</p>
          <p className="comment">{getComment()}</p>
        </div>
      </div>

      <button onClick={() => navigate('/')} className="back-button">
        Back to Upload
      </button>
    </div>
  );
}
