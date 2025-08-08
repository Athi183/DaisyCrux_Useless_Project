import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useMotionValue, useTransform } from 'framer-motion';

const chefUrl = '/assets/chef.gif';

function LoadingDots() {
  const [dots, setDots] = React.useState('');

  React.useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length < 3 ? prev + '.' : ''));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return <>Loading{dots}</>;
}

export default function App() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const chefX = useMotionValue(-150);
  const backgroundColor = useTransform(
    chefX,
    [-150, window.innerWidth],
    ['#000000', '#fff8dc']
  );

  // Only update chefX, no particles
  const handleChefUpdate = (latest) => {
    chefX.set(latest.x);
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
      navigate('/result', { state: data });
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      style={{
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        position: 'relative',
        fontFamily: 'Comic Sans MS, cursive',
        backgroundColor,
      }}
    >
      {/* Animated Chef */}
      <motion.img
        src={chefUrl}
        alt="chef"
        style={{
          width: 360,
          position: 'absolute',
          bottom: 50,
          left: 0,
          zIndex: 10,
        }}
        initial={{ x: -150 }}
        animate={{ x: window.innerWidth }}
        transition={{ duration: 10, ease: 'linear' }}
        onUpdate={handleChefUpdate}
      />

      {/* Main Title */}
      <motion.h1
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1, duration: 0.8 }}
        style={{
          fontSize: '3rem',
          fontWeight: 'bold',
          color: '#222222',
          zIndex: 10,
          textAlign: 'center',
          marginTop: '2rem',
        }}
      >
        Wabi Roti
      </motion.h1>

      {/* Upload Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5 }}
        style={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: '2rem',
          zIndex: 10,
        }}
      >
        <label
          style={{
            padding: '12px 24px',
            fontSize: '1rem',
            backgroundColor: '#5D3A00',
            color: '#ffffff',
            border: 'none',
            borderRadius: '12px',
            cursor: 'pointer',
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
          }}
        >
          {loading ? <LoadingDots /> : 'Upload Your Roti'}
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: 'none' }}
            disabled={loading}
          />
        </label>
      </motion.div>

      {/* Subtitle */}
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 1 }}
        style={{
          marginTop: '2rem',
          textAlign: 'center',
          fontSize: '2.5rem',
          color: '#1a1a1a',
        }}
      >
        Welcome to Wabi roti 🍽️
      </motion.h1>

      {/* Description */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3, duration: 1 }}
        style={{
          marginTop: '1rem',
          textAlign: 'center',
          color: '#444',
          fontSize: '1.3rem',
          fontStyle: 'italic',
        }}
      >
        The secret ingredient is just a prompt away.
      </motion.p>

      {/* Loading Text */}
      {loading && (
        <motion.div
          style={{
            position: 'absolute',
            bottom: 140,
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: '2rem',
            fontWeight: 'bold',
            color: '#5D3A00',
            fontFamily: 'Comic Sans MS, cursive',
            zIndex: 20,
            userSelect: 'none',
          }}
        >
          <LoadingDots />
        </motion.div>
      )}
    </motion.div>
  );
}
