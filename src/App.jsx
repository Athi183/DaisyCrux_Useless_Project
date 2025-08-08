import React, { useState } from 'react';
import { motion } from 'framer-motion';

const chefUrl = '/assets/chef.gif'; // Chef image
const wheatParticleUrl = '/assets/wheat.png'; // Wheat icon
const flourParticleUrl = '/assets/flour.png'; // Flour icon (new)

export default function App() {
  const [particles, setParticles] = useState([]);

  const handleChefUpdate = (latest) => {
    const newParticle = {
      id: Date.now() + Math.random(),
      x: latest.x + 60,
      y: window.innerHeight - 120,
      dx: (Math.random() - 0.5) * 100,   // Horizontal spread
      dy: -Math.random() * 80 - 40,     // Upward float
      type: Math.random() < 0.5 ? 'wheat' : 'flour',
    };

    setParticles((prev) => [...prev, newParticle]);

    // Remove after animation ends
    setTimeout(() => {
      setParticles((current) => current.filter((p) => p.id !== newParticle.id));
    }, 2200);
  };

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        backgroundColor: 'black',
        overflow: 'hidden',
        position: 'relative',
        fontFamily: 'Comic Sans MS, cursive',
      }}
    >
      {/* Chef walking */}
      <motion.img
        src={chefUrl}
        alt="chef"
        style={{
          width: 120,
          position: 'absolute',
          bottom: 60,
          left: 0,
          zIndex: 10,
        }}
        initial={{ x: -150 }}
        animate={{ x: window.innerWidth  }}
        transition={{ duration: 10, ease: 'linear' }}
        onUpdate={handleChefUpdate}
      />

      {/* Sprinkle particles */}
      {particles.map((p) => (
        <motion.img
          key={p.id}
          src={p.type === 'wheat' ? wheatParticleUrl : flourParticleUrl}
          initial={{ x: p.x, y: p.y, opacity: 1, scale: 1 }}
          animate={{
            x: p.x + p.dx,
            y: p.y + p.dy + 100,
            opacity: 0,
            scale: 0.5,
            rotate: Math.random() * 180,
          }}
          transition={{ duration: 2.2, ease: 'easeOut' }}
          style={{
            position: 'absolute',
            width: 15,
            height: 15,
            pointerEvents: 'none',
          }}
        />
      ))}

      {/* Main Title */}
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 1 }}
        style={{
          position: 'absolute',
          top: '40%',
          width: '100%',
          textAlign: 'center',
          fontSize: '3rem',
          color: '#FFD700',
        }}
      >
        Welcome to Wabi roti 🍽️
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3, duration: 1 }}
        style={{
          position: 'absolute',
          top: '55%',
          width: '100%',
          textAlign: 'center',
          color: '#ccc',
          fontSize: '1.3rem',
          fontStyle: 'italic',
        }}
      >
        The secret ingredient is just a prompt away.
      </motion.p>
    </div>
  );
}
