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

  const nodeAPI = import.meta.env.VITE_NODE_API;

  useEffect(() => {
    if (data) {
      const getGeminiComment = async () => {
        setIsLoading(true);
        setError(null);

        let attempts = 0;
        const maxAttempts = 3;

        while (attempts < maxAttempts) {
          try {
            const response = await fetch(`${nodeAPI}/api/get-malayalam-comment`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                roundness: data.roundness,
                burn_count: data.burn_count,
              }),
            });

            if (!response.ok) throw new Error('Network response was not ok');

            const contentType = response.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
              throw new Error("Invalid JSON response (HTML received)");
            }

            const result = await response.json();
            setMalayalamComment(result.comment);
            return; // success → exit loop

          } catch (err) {
            attempts++;
            console.warn(`Attempt ${attempts} failed:`, err);

            if (attempts < maxAttempts) {
              await new Promise(res => setTimeout(res, 1500)); // wait before retry
            } else {
              setError('ക്ഷമിക്കണം, ഒരു തമാശ കണ്ടുപിടിക്കാൻ പറ്റിയില്ല!');
            }
          }
        }

        setIsLoading(false);
      };

      getGeminiComment();
    }
  }, [data, nodeAPI]);

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
