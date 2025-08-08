import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './ResultPage.css';

export default function ResultPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state;

  const [malayalamComment, setMalayalamComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (data) {
      const getGeminiComment = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const response = await fetch('http://localhost:5001/api/get-malayalam-comment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              roundness: data.roundness,
              burn_count: data.burn_count,
            }),
          });

          if (!response.ok) throw new Error('Network response was not ok');

          const result = await response.json();
          setMalayalamComment(result.comment);
        } catch (err) {
          console.error("Failed to fetch comment:", err);
          setError('ക്ഷമിക്കണം, ഒരു തമാശ കണ്ടുപിടിക്കാൻ പറ്റിയില്ല!');
        } finally {
          setIsLoading(false);
        }
      };

      getGeminiComment();
    }
  }, [data]);

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

  return (
    <div className="results-container">
      <h1 className="wabi-title">Wabi Roti Results 🍪</h1>

      <div className="content-wrapper">
        
        {/* LEFT: Image Section */}
        <div className="image-box">
          <div>
            <h3>Contour Detection</h3>
            <img src={`data:image/png;base64,${contour_image}`} alt="Contour" />
          </div>

          <div>
            <h3>Burn Detection</h3>
            <img src={`data:image/png;base64,${burn_image}`} alt="Burnt Spots" />
          </div>
        </div>

        {/* RIGHT: Info Section */}
        <div className="info-box">
          <p className="label">Roundness Value:</p>
          <p className="value">{roundness?.toFixed(2)}</p>

          <p className="label">Burnt Spots:</p>
          <p className="value">{burn_count}</p>
          
          <p className="comment">
            {isLoading
              ? 'അടിപൊളി തമാശ ഉണ്ടാക്കുന്നു...'
              : error
              ? error
              : malayalamComment}
          </p>
        </div>
      </div>

      <button onClick={() => navigate('/')} className="back-button">
        Back to Upload
      </button>
    </div>
  );
}
