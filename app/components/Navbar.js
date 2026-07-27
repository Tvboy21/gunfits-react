'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useMusic } from '../context/MusicContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, ShoppingBag, User, Menu, X, Music } from 'lucide-react';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { playing, toggleMusic } = useMusic();
  const { totalItems } = useCart();
  const { user, isAdmin, isPremium, logout } = useAuth();

  async function handleLogout() {
    await logout();
    window.location.href = '/';
  }

  const closeMenu = () => setMenuOpen(false);

  const menuVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2 } }
  };

  return (
    <nav className="navbar-minimal">
      {/* Logo */}
      <Link href="/" onClick={closeMenu} style={{ display: 'flex', alignItems: 'center', padding: 0, zIndex: 101 }}>
        <Image
          src="/logo.png"
          alt="GUNFITS"
          width={120}
          height={120}
          style={{
            objectFit: 'contain',
            width: 'clamp(50px, 10vw, 80px)',
            height: 'auto',
            backgroundColor: 'transparent'
          }}
          priority
        />
      </Link>

      {/* Desktop Nav Links */}
      <ul className="nav-minimal-desktop">
        <li><Link href="/">Home</Link></li>
        <li><Link href="/collections">Collections</Link></li>
        <li><Link href="/about">About</Link></li>
        <li><Link href="/events">Events</Link></li>
        {isPremium && <li><Link href="/designer">Design</Link></li>}
      </ul>

      {/* Icons - Show on all screens */}
      <div className="nav-minimal-icons">
        <button 
          onClick={toggleMusic} 
          className="icon-btn"
          title={playing ? 'Stop' : 'Play'}
          style={{ color: playing ? '#F0BE00' : '#EEEBE3' }}
        >
          <Music size={20} />
        </button>

        <Link href="/cart" className="icon-btn" title="Cart">
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <ShoppingBag size={20} />
            {totalItems > 0 && (
              <span className="cart-badge">{totalItems}</span>
            )}
          </div>
        </Link>

        {!user ? (
          <Link href="/login" className="icon-btn" title="Login">
            <User size={20} />
          </Link>
        ) : (
          <>
            <Link href="/account" className="icon-btn" title={user.displayName || 'Account'}>
              <User size={20} />
            </Link>
            <button 
              onClick={handleLogout} 
              className="icon-btn logout-btn"
              title="Logout"
              style={{ color: '#ff6b6b' }}
            >
              ✕
            </button>
          </>
        )}

        {isAdmin && (
          <Link href="/admin" className="icon-btn admin-btn" title="Admin">
            ⚙
          </Link>
        )}
      </div>

      {/* Mobile Hamburger Button */}
      <button 
        className="menu-btn"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        {menuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="mobile-menu-minimal"
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <ul className="mobile-nav-minimal">
              <li><Link href="/" onClick={closeMenu}>Home</Link></li>
              <li><Link href="/collections" onClick={closeMenu}>Collections</Link></li>
              <li><Link href="/about" onClick={closeMenu}>About</Link></li>
              <li><Link href="/events" onClick={closeMenu}>Events</Link></li>
              {isPremium && <li><Link href="/designer" onClick={closeMenu}>Design</Link></li>}
            </ul>

            <div className="mobile-menu-minimal-actions">
              <button onClick={toggleMusic} className="mobile-action">
                {playing ? '■ Stop Vibe' : '♪ Play Vibe'}
              </button>

              <Link href="/cart" onClick={closeMenu} className="mobile-action">
                🛍 Cart ({totalItems})
              </Link>

              {!user ? (
                <Link href="/login" onClick={closeMenu} className="mobile-action">
                  Login
                </Link>
              ) : (
                <>
                  <Link href="/account" onClick={closeMenu} className="mobile-action">
                    My Account
                  </Link>
                  <button onClick={() => { handleLogout(); closeMenu(); }} className="mobile-action logout">
                    Logout
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}