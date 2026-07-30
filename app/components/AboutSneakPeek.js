'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';

const TEAM_PREVIEW = [
  { name: 'RYAN ODETTE', role: 'Founder' },
  { name: 'RANSLEY OGALO', role: 'Manager' },
];

export default function AboutSneakPeek() {
  return (
    <section
      style={{
        position: 'relative',
        padding: 'clamp(80px, 15vw, 120px) clamp(20px, 5vw, 48px)',
        zIndex: 2,
        borderTop: '1px solid rgba(201,78,10,0.2)',
        borderBottom: '1px solid rgba(201,78,10,0.2)',
        overflow: 'hidden',
      }}>
      {/* Subtle rotating background */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 120, repeat: Infinity, ease: 'linear' }}
        style={{
          position: 'absolute',
          width: '400px',
          height: '400px',
          border: '1px solid rgba(201,78,10,0.08)',
          borderRadius: '50%',
          opacity: 0.3,
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: '1200px',
          margin: '0 auto',
        }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ marginBottom: '60px' }}>
          <p
            style={{
              fontSize: 'clamp(11px, 2vw, 13px)',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: '#C94E0A',
              marginBottom: '12px',
              fontWeight: 900,
            }}>
            // MEET THE TEAM
          </p>
          <h2
            style={{
              fontSize: 'clamp(2rem, 8vw, 4rem)',
              fontWeight: 900,
              margin: 0,
              letterSpacing: '0.05em',
              lineHeight: 1.1,
              marginBottom: '16px',
            }}>
            THE ARCHITECTS
            <br />
            <span style={{ color: '#F0BE00' }}>BEHIND IT</span>
          </h2>
          <div
            style={{
              marginTop: '24px',
              height: '2px',
              width: '120px',
              background: 'linear-gradient(90deg, #C94E0A, #F0BE00, transparent)',
            }}
          />
        </motion.div>

        {/* Team Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(clamp(240px, 40vw, 350px), 1fr))',
            gap: 'clamp(24px, 6vw, 40px)',
            marginBottom: '60px',
          }}>
          {TEAM_PREVIEW.map((member, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.15, duration: 0.6 }}
              viewport={{ once: true }}
              whileHover={{
                borderColor: '#F0BE00',
                boxShadow: '0 20px 50px rgba(201,78,10,0.2)',
              }}
              style={{
                padding: 'clamp(32px, 5vw, 48px)',
                border: '2px solid rgba(201,78,10,0.2)',
                borderRadius: '4px',
                background: 'linear-gradient(135deg, rgba(201,78,10,0.05), transparent)',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
              }}>
              {/* Avatar placeholder */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '4px',
                  border: '2px solid #C94E0A',
                  marginBottom: '20px',
                  background: 'linear-gradient(135deg, rgba(201,78,10,0.1), rgba(240,190,0,0.05))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2rem',
                  fontWeight: 900,
                  color: 'rgba(201,78,10,0.3)',
                }}>
                {member.name[0]}
              </motion.div>

              <h3
                style={{
                  fontSize: 'clamp(1rem, 2vw, 1.3rem)',
                  fontWeight: 900,
                  color: '#EEEBE3',
                  margin: '0 0 8px',
                  letterSpacing: '0.03em',
                }}>
                {member.name}
              </h3>

              <p
                style={{
                  fontSize: 'clamp(0.85rem, 1.5vw, 0.95rem)',
                  color: '#C94E0A',
                  margin: 0,
                  fontWeight: 700,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                }}>
                {member.role}
              </p>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          viewport={{ once: true }}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 'clamp(32px, 5vw, 48px)',
            borderTop: '1px solid rgba(201,78,10,0.2)',
          }}>
          <p
            style={{
              fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
              color: '#888888',
              margin: 0,
              lineHeight: 1.6,
              maxWidth: '500px',
            }}>
            Meet the visionaries building GUNFITS. Raw creativity. Fearless execution. One movement.
          </p>

          <Link href="/about">
            <motion.button
              whileHover={{
                scale: 1.1,
                borderColor: '#F0BE00',
                boxShadow: '0 0 30px rgba(240,190,0,0.2)',
              }}
              whileTap={{ scale: 0.95 }}
              style={{
                padding: '14px 36px',
                fontSize: '11px',
                fontWeight: 900,
                background: 'transparent',
                border: '2px solid #C94E0A',
                color: '#EEEBE3',
                cursor: 'pointer',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                borderRadius: '2px',
                whiteSpace: 'nowrap',
                marginLeft: '20px',
              }}>
              Full Story ↗
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}