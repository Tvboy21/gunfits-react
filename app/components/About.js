'use client';
import Link from 'next/link';
import Silk from './Silk';

export default function About() {
  return (
    <section className="about" style={{ position: 'relative', overflow: 'hidden' }}>

      <div className="about-text" style={{ position: 'relative', zIndex: 2 }}>
        <span className="section-tag">// 002 — The Brand</span>
        <h2 className="about-title">STARTED AS A THOUGHT.</h2>
        <p className="about-body">
          Everything you see started as a thought until it got put into action.
        </p>
      <Link href="/our-story" className="hero-btn">Our Story</Link>
      </div>

      <div className="about-visual" style={{ position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <Silk
            speed={4}
            scale={1}
            color="#3a0f00"
            noiseIntensity={1.5}
            rotation={0}
          />
        </div>
        <div style={{
          position: 'relative',
          zIndex: 2,
          fontFamily: 'Bebas Neue, sans-serif',
          fontSize: '10rem',
          color: 'rgba(201,78,10,0.4)',
          letterSpacing: '0.1em'
        }}>
          4LUV
        </div>
      </div>

    </section>
  );
}