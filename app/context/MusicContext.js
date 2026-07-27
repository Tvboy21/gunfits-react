'use client';
import { createContext, useContext, useState, useRef, useEffect } from 'react';

const MusicContext = createContext();

export function MusicProvider({ children }) {
  const [playing, setPlaying] = useState(false);
  const [audioLoaded, setAudioLoaded] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    // Lazy load audio - only initialize when user first interacts
    const handleFirstInteraction = () => {
      if (!audioLoaded && audioRef.current) {
        audioRef.current.load();
        setAudioLoaded(true);
      }
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
    };

    if (!audioLoaded) {
      window.addEventListener('click', handleFirstInteraction);
      window.addEventListener('touchstart', handleFirstInteraction);
    }

    return () => {
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
    };
  }, [audioLoaded]);

  useEffect(() => {
    if (audioRef.current && audioLoaded) {
      if (playing) {
        audioRef.current.play().catch(() => {});
      } else {
        audioRef.current.pause();
      }
    }
  }, [playing, audioLoaded]);

  const toggleMusic = () => setPlaying(!playing);

  return (
    <MusicContext.Provider value={{ playing, toggleMusic, audioRef }}>
      {children}
      <audio
        ref={audioRef}
        src="/track1.mp3"
        loop
        style={{ display: 'none' }}
      />
    </MusicContext.Provider>
  );
}

export function useMusic() {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error('useMusic must be used within MusicProvider');
  }
  return context;
}