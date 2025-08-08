import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const chapatiUrl = "/assets/chapathi.jpg";

export default function App() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const containerStyle = {
    width: '100vw',
    height: '100vh',
    backgroundColor: '#FFF8DC',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative',
    fontFamily: 'Arial, sans-serif',
    flexDirection: 'column',
  };

  const titleStyle = {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    color: '#5D3A00',
    marginBottom: '1rem',
    zIndex: 10,
  };

  const buttonStyle = {
    padding: '12px 24px',
    fontSize: '1rem',
    backgroundColor: '#5D3A00',
    color: '#fff',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    zIndex: 10,
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('http://127.0.0.1:5000/analyze', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      console.log("Result from server:", data);

      // ✅ Navigate to ResultPage with response data
      navigate('/result', { state: data });

    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
      {/* Main Chapati Animation */}
      <motion.img
        src={chapatiUrl}
        alt="chapati"
        initial={{ scale: 0, x: 0, y: 0 }}
        animate={{ scale: 1, x: 200 }}
        transition={{ duration: 1 }}
        style={{
          width: 100,
          height: 100,
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      />

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1, duration: 0.8 }}
        style={titleStyle}
      >
        ChapatiGPT-XS
      </motion.h1>

      {/* Upload Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.8 }}
      >
        <label style={buttonStyle}>
          {loading ? "Analyzing..." : "Upload Your Roti"}
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
        </label>
      </motion.div>

      {/* Falling Chapatis */}
      {[0, 1, 2].map((i) => (
        <motion.img
          key={i}
          src={chapatiUrl}
          alt={`chapati-stack-${i}`}
          initial={{ y: -200, opacity: 0 }}
          animate={{ y: i * 10, opacity: 1 }}
          transition={{ delay: 2 + i * 0.5, duration: 0.5 }}
          style={{
            width: 100,
            height: 100,
            position: 'absolute',
            top: '50%',
            left: 'calc(50% + 200px)',
            transform: 'translate(-50%, -50%)',
            zIndex: i,
          }}
        />
      ))}
    </div>
  );
}
