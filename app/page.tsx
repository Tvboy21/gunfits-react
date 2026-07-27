'use client';
import { useEffect, useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Marquee from './components/Marquee';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { initializeApp, getApps } from 'firebase/app';

// Lazy load heavy components
const Products = dynamic(() => import('./components/Products'), { ssr: false });
const About = dynamic(() => import('./components/About'), { ssr: true });
const Footer = dynamic(() => import('./components/Footer'), { ssr: true });

const firebaseConfig = {
  apiKey: "AIzaSyBPLVqZ_CgguwH9W_yaCWiQiz2nzGniBZM",
  authDomain: "gunfits.firebaseapp.com",
  projectId: "gunfits",
  storageBucket: "gunfits.firebasestorage.app",
  messagingSenderId: "841263994035",
  appId: "1:841263994035:web:124e56aa1caff4fa3d8cc6"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

const VIDEOS = [
  {
    url: 'https://res.cloudinary.com/dsxhsoem9/video/upload/v1780604008/vid1_fi4qku.mp4',
    title: 'Movement',
  },
];

const TEAM = [
  {
    name: 'RYAN ODETTE',
    role: 'Founder & Creative Visionary',
    statement: 'Set the vision. Built the movement.',
  },
  {
    name: 'RANSLEY OGALO',
    role: 'Digital Architect',
    statement: 'Coded the future. No cap.',
  },
];

export default function HomePage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [emailStatus, setEmailStatus] = useState('');
  const [emailLoading, setEmailLoading] = useState(false);

  const [videoIndex, setVideoIndex] = useState(0);
  const [showDropModal, setShowDropModal] = useState(true);

  // Auto-close modal after 6 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowDropModal(false), 6000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const sections = document.querySelectorAll('section');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).style.opacity = '1';
          }
        });
      },
      { threshold: 0.1 }
    );

    sections.forEach((section) => {
      (section as HTMLElement).style.opacity = '0.95';
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (VIDEOS.length <= 1) return;
    const videoTimer = setInterval(() => {
      setVideoIndex((prev) => (prev + 1) % VIDEOS.length);
    }, 15000);
    return () => clearInterval(videoTimer);
  }, []);

  const handleEmailSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) {
      setEmailStatus('Enter your email');
      return;
    }

    setEmailLoading(true);
    try {
      await addDoc(collection(db, 'emailList'), {
        email,
        timestamp: new Date().toISOString(),
        source: 'homepage',
      });
      setEmailStatus('✓ Got it. Exclusive content incoming.');
      setEmail('');
      setTimeout(() => setEmailStatus(''), 3000);
    } catch (error) {
      setEmailStatus('Error. Try again.');
      console.error(error);
    }
    setEmailLoading(false);
  };

  return (
    <div
      style={{
        background: '#060606',
        color: '#EEEBE3',
        minHeight: '100vh',
        overflow: 'hidden',
        fontFamily: 'Barlow Condensed, sans-serif',
      }}>
      {/* Texture overlay */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundImage: `
            repeating-linear-gradient(
              0deg,
              rgba(0,0,0,0.15) 0px,
              rgba(0,0,0,0.15) 1px,
              transparent 1px,
              transparent 2px
            ),
            repeating-linear-gradient(
              90deg,
              rgba(201,78,10,0.02) 0px,
              rgba(201,78,10,0.02) 1px,
              transparent 1px,
              transparent 3px
            )
          `,
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* ═══════════════ ANIMATED DROP MODAL ═══════════════ */}
      <AnimatePresence>
        {showDropModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 999,
              backdropFilter: 'blur(4px)',
            }}
            onClick={() => setShowDropModal(false)}>
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 40 }}
              transition={{ duration: 0.4 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: '#060606',
                border: '2px solid rgba(201,78,10,0.4)',
                borderRadius: '8px',
                padding: 'clamp(32px, 6vw, 48px)',
                maxWidth: '500px',
                width: '90%',
                textAlign: 'center',
              }}>
              {/* Icon/Badge */}
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{
                  fontSize: '48px',
                  marginBottom: '20px',
                }}>
                ✨
              </motion.div>

              {/* Heading */}
              <h2
                style={{
                  fontSize: 'clamp(1.8rem, 5vw, 2.4rem)',
                  fontWeight: 900,
                  margin: '0 0 16px',
                  letterSpacing: '0.05em',
                  fontFamily: 'Bebas Neue, sans-serif',
                  color: '#EEEBE3',
                }}>
                LATEST DROP
              </h2>

              {/* Question */}
              <p
                style={{
                  fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
                  color: '#C94E0A',
                  margin: '0 0 32px',
                  fontWeight: 700,
                  letterSpacing: '0.02em',
                }}>
                Ready to see what's new?
              </p>

              {/* Buttons */}
              <div
                style={{
                  display: 'flex',
                  gap: '12px',
                  flexDirection: 'column',
                }}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setShowDropModal(false);
                    router.push('/collections');
                  }}
                  style={{
                    background: 'linear-gradient(135deg, #C94E0A, #F0BE00)',
                    color: '#060606',
                    border: 'none',
                    padding: '14px 32px',
                    fontSize: '12px',
                    fontWeight: 900,
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    borderRadius: '4px',
                    transition: 'all 0.2s',
                    fontFamily: 'Bebas Neue, sans-serif',
                  }}>
                  YES, SHOW ME
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowDropModal(false)}
                  style={{
                    background: 'transparent',
                    color: '#888888',
                    border: '1px solid rgba(201,78,10,0.2)',
                    padding: '14px 32px',
                    fontSize: '12px',
                    fontWeight: 900,
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    borderRadius: '4px',
                    transition: 'all 0.2s',
                  }}>
                  MAYBE LATER
                </motion.button>
              </div>

              {/* Auto-close timer */}
              <p
                style={{
                  fontSize: '10px',
                  color: '#666666',
                  margin: '20px 0 0',
                  letterSpacing: '0.1em',
                }}>
                (Closes automatically)
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Subtle top line animation */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.3, duration: 1 }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '1px',
          background: 'linear-gradient(90deg, transparent, #C94E0A, transparent)',
          zIndex: 1,
          transformOrigin: 'left',
        }}
      />

      <Navbar />
      
      {/* Hero with smooth fade in */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}>
        <Hero />
      </motion.div>

      {/* ═══════════════ LAUNCH BANNER ═══════════════ */}
      <section
        style={{
          position: 'relative',
          padding: 'clamp(40px, 8vw, 60px) clamp(20px, 5vw, 48px)',
          borderBottom: '1px solid rgba(201,78,10,0.2)',
          background: 'rgba(6,6,6,0.8)',
          zIndex: 2,
        }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            style={{ textAlign: 'center', marginBottom: '32px' }}>
            <p
              style={{
                fontSize: 'clamp(10px, 2vw, 12px)',
                letterSpacing: '0.3em',
                color: '#C94E0A',
                margin: '0 0 16px',
                fontWeight: 900,
              }}>
              GUNFITS GOES GLOBAL
            </p>
            <h2
              style={{
                fontSize: 'clamp(1.8rem, 6vw, 3rem)',
                fontWeight: 900,
                margin: 0,
                letterSpacing: '0.05em',
              }}>
              21ST JUNE
            </h2>
          </motion.div>



          {/* Email Capture + Instagram CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(clamp(200px, 45vw, 400px), 1fr))',
              gap: 'clamp(12px, 3vw, 20px)',
              maxWidth: '900px',
              margin: '0 auto',
            }}>
            {/* Email Form */}
            <form onSubmit={handleEmailSubmit} className="responsive-form-row" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div className="responsive-form-row" style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your email"
                  style={{
                    flex: 1,
                    background: 'rgba(0,0,0,0.3)',
                    border: '1px solid rgba(201,78,10,0.2)',
                    color: '#EEEBE3',
                    padding: '12px 16px',
                    fontSize: '13px',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = '#C94E0A')}
                  onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(201,78,10,0.2)')}
                  disabled={emailLoading}
                />
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={emailLoading}
                  style={{
                    background: emailLoading ? '#333333' : '#C94E0A',
                    color: emailLoading ? '#666666' : '#EEEBE3',
                    border: 'none',
                    padding: '12px 24px',
                    fontSize: '11px',
                    fontWeight: 900,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    cursor: emailLoading ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s',
                    whiteSpace: 'nowrap',
                  }}>
                  {emailLoading ? 'SAVING...' : 'JOIN'}
                </motion.button>
              </div>
              <AnimatePresence>
                {emailStatus && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{
                      fontSize: '11px',
                      color: emailStatus.includes('✓') ? '#44cc44' : '#ff6666',
                      margin: 0,
                      letterSpacing: '0.05em',
                    }}>
                    {emailStatus}
                  </motion.p>
                )}
              </AnimatePresence>
            </form>

            {/* Instagram CTA */}
            <Link href="https://instagram.com/gun_fits" target="_blank" rel="noopener noreferrer">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  background: 'transparent',
                  border: '1px solid rgba(201,78,10,0.4)',
                  color: '#EEEBE3',
                  padding: '12px 24px',
                  fontSize: '11px',
                  fontWeight: 900,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  width: '100%',
                }}>
                FOLLOW @gun_fits (689)
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════ VIDEO SECTION ═══════════════ */}
      <section
        style={{
          position: 'relative',
          padding: 'clamp(60px, 12vw, 100px) clamp(20px, 5vw, 48px)',
          borderBottom: '1px solid rgba(201,78,10,0.2)',
          zIndex: 2,
        }}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          style={{ marginBottom: '48px', textAlign: 'center' }}>
          <p
            style={{
              fontSize: 'clamp(10px, 2vw, 12px)',
              letterSpacing: '0.3em',
              color: '#C94E0A',
              margin: '0 0 12px',
              fontWeight: 900,
            }}>
            SEE IT IN ACTION
          </p>
          <h2
            style={{
              fontSize: 'clamp(1.6rem, 5vw, 2.8rem)',
              fontWeight: 900,
              margin: 0,
              letterSpacing: '0.05em',
            }}>
            THE MOVEMENT
          </h2>
        </motion.div>

        {/* Video Carousel */}
        <div
          style={{
            maxWidth: '700px',
            margin: '0 auto',
            position: 'relative',
          }}>
          <motion.div
            key={videoIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              position: 'relative',
              paddingBottom: '177.78%',
              background: '#1a1a1a',
              borderRadius: '4px',
              overflow: 'hidden',
              border: '1px solid rgba(201,78,10,0.2)',
            }}>
            <video
              src={VIDEOS[videoIndex].url}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
              autoPlay
              loop
              muted
              playsInline
              controls
            />
          </motion.div>

          {VIDEOS.length > 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              style={{
                display: 'flex',
                gap: '8px',
                justifyContent: 'center',
                marginTop: '24px',
              }}>
              {VIDEOS.map((_, idx) => (
                <motion.button
                  key={idx}
                  onClick={() => setVideoIndex(idx)}
                  whileHover={{ scale: 1.2 }}
                  style={{
                    width: idx === videoIndex ? '24px' : '8px',
                    height: '8px',
                    borderRadius: '4px',
                    background: idx === videoIndex ? '#C94E0A' : 'rgba(201,78,10,0.3)',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                  }}
                />
              ))}
            </motion.div>
          )}
        </div>
      </section>

      <Marquee />

      {/* Products with smooth entrance */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true, margin: '-100px' }}>
        <Products />
      </motion.div>

      {/* ═══════════════ ABOUT SECTION ═══════════════ */}
      <section
        style={{
          position: 'relative',
          padding: 'clamp(80px, 15vw, 120px) clamp(20px, 5vw, 48px)',
          borderTop: '1px solid rgba(201,78,10,0.2)',
          borderBottom: '1px solid rgba(201,78,10,0.2)',
          zIndex: 2,
        }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            style={{ marginBottom: '60px' }}>
            <p
              style={{
                fontSize: 'clamp(10px, 2vw, 12px)',
                letterSpacing: '0.3em',
                color: '#C94E0A',
                margin: 0,
                fontWeight: 900,
                marginBottom: '12px',
              }}>
              THE ARCHITECTS
            </p>
            <h2
              style={{
                fontSize: 'clamp(2rem, 8vw, 3.5rem)',
                fontWeight: 900,
                margin: 0,
                letterSpacing: '0.05em',
                marginBottom: '24px',
              }}>
              WHO'S BEHIND THIS
            </h2>
            <p
              style={{
                fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
                color: '#888888',
                lineHeight: 1.8,
                maxWidth: '600px',
                margin: 0,
                letterSpacing: '0.01em',
              }}>
              Raw creativity. No filters. Just two people who decided Nairobi deserved more.
            </p>
          </motion.div>

          {/* Team Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(clamp(240px, 45vw, 360px), 1fr))',
              gap: 'clamp(24px, 6vw, 40px)',
              marginBottom: '48px',
            }}>
            {TEAM.map((member, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.15, duration: 0.7 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                style={{
                  padding: 'clamp(32px, 6vw, 48px)',
                  border: '1px solid rgba(201,78,10,0.2)',
                  borderRadius: '4px',
                  background: 'linear-gradient(135deg, rgba(201,78,10,0.05), transparent)',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                }}>
                {/* Name */}
                <h3
                  style={{
                    fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)',
                    fontWeight: 900,
                    color: '#EEEBE3',
                    margin: '0 0 8px',
                    letterSpacing: '0.05em',
                    fontFamily: 'Bebas Neue, sans-serif',
                  }}>
                  {member.name}
                </h3>

                {/* Role */}
                <p
                  style={{
                    fontSize: 'clamp(0.85rem, 1.8vw, 1rem)',
                    color: '#C94E0A',
                    margin: '0 0 16px',
                    fontWeight: 700,
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                  }}>
                  {member.role}
                </p>

                {/* Statement */}
                <p
                  style={{
                    fontSize: 'clamp(0.95rem, 2vw, 1.1rem)',
                    color: '#EEEBE3',
                    margin: 0,
                    lineHeight: 1.6,
                    fontWeight: 600,
                    fontStyle: 'italic',
                  }}>
                  "{member.statement}"
                </p>
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            viewport={{ once: true }}
            style={{ textAlign: 'center' }}>
            <Link href="/about">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  background: 'transparent',
                  border: '2px solid #C94E0A',
                  color: '#EEEBE3',
                  padding: 'clamp(12px, 2.5vw, 16px) clamp(28px, 5vw, 40px)',
                  fontSize: '11px',
                  fontWeight: 900,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  borderRadius: '2px',
                  transition: 'all 0.2s',
                }}>
                FULL STORY ↗
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* About with smooth entrance */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true, margin: '-100px' }}>
        <About />
      </motion.div>

      <Footer />
    </div>
  );
}