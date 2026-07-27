'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-bg-text">GUNFITS</div>
      <div className="hero-content">
        <span className="hero-tag">// Nairobi, Kenya</span>
        <div className="hero-title">
          <motion.span
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="line-1"
          >
            CUT
          </motion.span>

          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="line-2"
          >
            FROM A
          </motion.span>

          <motion.span
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="line-3"
          >
            DIFFERENT CLOTH
          </motion.span>
        </div>

        <p className="hero-sub">Guntated. Bz gazz. Quality.</p>
        <Link href="/collections" className="hero-btn">Shop Now!</Link>
      </div>
    </section>
  );
}