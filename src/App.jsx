import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const chefUrl = '/assets/chef.gif'; // Chef image
const wheatParticleUrl = '/assets/wheat.png'; // Wheat icon
const flourParticleUrl = '/assets/flour.png'; // Flour icon

export default function App() {
  const [particles, setParticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChefUpdate = (latest) => {
    const newParticle = {
      id: Date.now() + Math.random(),
      x: latest.x + 60,
      y: window.innerHeight - 120,
      dx: (Math.random() - 0.5) * 100,
      dy: -Math.random() * 80 - 40,
      type: Math.random() < 0.5 ? 'wheat' : 'flour',
    };

    setParticles((prev) => [...prev, newParticle]);

    setTimeout(() => {
      setParticles((current) => current.filter((p) => p.id !== newParticle.id));
    }, 2200);
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
      navigate('/result', { state: data });
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setLoading(false);
    }
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
          width:  180,
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

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1, duration: 0.8 }}
        style={{
          fontSize: '3rem',
          fontWeight: 'bold',
          color: '#ffbb00ff',
          marginBottom: '1rem',
          zIndex: 10,
          textAlign: 'center',
        }}
      >
        Wabi Roti
      </motion.h1>

      {/* Upload Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.8 }}
        style={{ position: 'absolute',
  top: '65%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  zIndex: 10,
 }}
      >
        <label
          style={{
            padding: '12px 24px',
            fontSize: '1rem',
            backgroundColor: '#5D3A00',
            color: '#fff',
            border: 'none',
            borderRadius: '12px',
            cursor: 'pointer',
          }}
        >
          {loading ? "Analyzing..." : "Upload Your Roti"}
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
        </label>
      </motion.div>

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
