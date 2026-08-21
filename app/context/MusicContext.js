'use client';
import { createContext, useContext, useState, useRef, useEffect } from 'react';

const MusicContext = createContext();

export function MusicProvider({ children }) {
  const [playing, setPlaying] = useState(false);
  const [audioLoaded, setAudioLoaded] = useState(false);
  const audioRef = useRef(null);
  const audioFile = '/track2.mp3.mp3';

  useEffect(() => {
    const handleFirstInteraction = () => {
      if (!audioLoaded && audioRef.current) {
        audioRef.current.src = audioFile;
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
    const audio = audioRef.current;
    if (!audio || !audioLoaded) return;

    if (playing) {
      audio.currentTime = 0;
      const playPromise = audio.play();
      if (playPromise) {
        playPromise.catch(() => setPlaying(false));
      }
    } else {
      audio.pause();
    }
  }, [playing, audioLoaded]);

  const toggleMusic = () => setPlaying((prev) => !prev);

  return (
    <MusicContext.Provider value={{ playing, toggleMusic, audioRef }}>
      {children}
      <audio
        ref={audioRef}
        src={audioFile}
        loop
        preload="auto"
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