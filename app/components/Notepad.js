'use client';
import { useState, useEffect, useRef } from 'react';

export default function Notepad() {
  const [isOpen, setIsOpen] = useState(false);
  const [notes, setNotes] = useState('');
  const [position, setPosition] = useState({ x: 20, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const notepadRef = useRef(null);

  // Load notes from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('gunfits-notes');
    if (saved) setNotes(saved);
  }, []);

  // Save notes to localStorage
  useEffect(() => {
    localStorage.setItem('gunfits-notes', notes);
  }, [notes]);

  // Drag functionality
  function handleMouseDown(e) {
    if (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'BUTTON') return;
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  }

  useEffect(() => {
    function handleMouseMove(e) {
      if (!isDragging) return;
      setPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y
      });
    }
    function handleMouseUp() {
      setIsDragging(false);
    }
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  return (
    <>
      {/* Floating toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 998,
          width: '52px',
          height: '52px',
          background: isOpen ? '#333333' : '#C94E0A',
          border: 'none',
          borderRadius: '50%',
          color: '#EEEBE3',
          fontSize: '1.3rem',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
          transition: 'background 0.2s, transform 0.2s',
        }}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        title="Open Notepad"
      >
        {isOpen ? '✕' : '📝'}
      </button>

      {/* Notepad panel */}
      {isOpen && (
        <div
          ref={notepadRef}
          onMouseDown={handleMouseDown}
          style={{
            position: 'fixed',
            left: `${position.x}px`,
            top: `${position.y}px`,
            zIndex: 997,
            width: '320px',
            background: '#111111',
            border: '1px solid #222222',
            borderTop: '3px solid #C94E0A',
            boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
            userSelect: isDragging ? 'none' : 'auto',
          }}
        >
          {/* Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 16px',
            borderBottom: '1px solid #222222',
            cursor: 'grab',
            background: '#0e0e0e'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.9rem' }}>📝</span>
              <p style={{
                fontFamily: 'Bebas Neue, sans-serif',
                fontSize: '1rem',
                color: '#EEEBE3',
                letterSpacing: '0.1em'
              }}>NOTES</p>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => setNotes('')}
                style={{
                  background: 'none', border: '1px solid #333333',
                  color: '#666666', cursor: 'pointer',
                  fontSize: '9px', letterSpacing: '0.1em',
                  padding: '3px 8px', textTransform: 'uppercase',
                  fontFamily: 'Bebas Neue, sans-serif'
                }}>Clear</button>
            </div>
          </div>

          {/* Textarea */}
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Jot something down..."
            style={{
              width: '100%',
              height: '280px',
              background: '#111111',
              border: 'none',
              color: '#EEEBE3',
              fontFamily: 'IBM Plex Mono, monospace',
              fontSize: '12px',
              lineHeight: 1.7,
              padding: '16px',
              outline: 'none',
              resize: 'none',
              letterSpacing: '0.04em'
            }}
          />

          {/* Footer */}
          <div style={{
            padding: '8px 16px',
            borderTop: '1px solid #222222',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <p style={{ fontSize: '9px', color: '#444444', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Auto-saved
            </p>
            <p style={{ fontSize: '9px', color: '#444444', letterSpacing: '0.1em' }}>
              {notes.length} chars
            </p>
          </div>
        </div>
      )}
    </>
  );
}