'use client';
import React from 'react';

export default function Graffiti({ className = '', visible = true }) {
  if (!visible) return null;

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} className={className}>
      <img
        src="/images/gu4.webp"
        alt="graffiti"
        style={{
          position: 'absolute',
          right: '-6%',
          top: '-10%',
          width: '420px',
          maxWidth: '35vw',
          opacity: 0.16,
          transform: 'rotate(-12deg)',
          mixBlendMode: 'screen',
          filter: 'saturate(1.15)',
          animation: 'float 8s ease-in-out infinite'
        }}
      />

      <img
        src="/images/gu5.webp"
        alt="graffiti-2"
        style={{
          position: 'absolute',
          left: '-6%',
          bottom: '-6%',
          width: '360px',
          maxWidth: '30vw',
          opacity: 0.10,
          transform: 'rotate(6deg)',
          mixBlendMode: 'screen',
          filter: 'grayscale(0.2)',
          animation: 'float 10s ease-in-out infinite',
          animationDelay: '1s'
        }}
      />

      <img
        src="/images/gu1.jpg"
        alt="graffiti-3"
        style={{
          position: 'absolute',
          left: '10%',
          top: '6%',
          width: '220px',
          maxWidth: '22vw',
          opacity: 0.08,
          transform: 'rotate(-6deg)',
          mixBlendMode: 'screen',
          filter: 'contrast(1.05)'
        }}
      />

      <img
        src="/images/gu2.webp"
        alt="graffiti-4"
        style={{
          position: 'absolute',
          right: '8%',
          bottom: '18%',
          width: '180px',
          maxWidth: '18vw',
          opacity: 0.06,
          transform: 'rotate(4deg)',
          mixBlendMode: 'screen',
          filter: 'blur(0.5px)'
        }}
      />
    </div>
  );
}
