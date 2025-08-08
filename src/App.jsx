import React from 'react';
import { motion } from 'framer-motion';

const chapatiUrl = "/assets/chapathi.jpg";

export default function App() {
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
  };

  const titleStyle = {
    position: 'absolute',
    fontSize: '2.5rem',
    fontWeight: 'bold',
    color: '#5D3A00',
    top: '50%',
    left: '20%',
    transform: 'translateY(-50%)',
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

      {/* Title Animation */}
      <motion.h1
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1, duration: 0.8 }}
        style={titleStyle}
      >
        ChapatiGPT-XS
      </motion.h1>

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
