'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { initializeApp, getApps } from 'firebase/app';

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

const categories = ['All', 'Tees', 'Hoodies', 'Bottoms', 'Outerwear', 'Accessories'];

export default function CollectionsPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedQuantities, setSelectedQuantities] = useState({});
  const [touchedProduct, setTouchedProduct] = useState(null);
  const [firestoreProducts, setFirestoreProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  // Fetch Firestore products ONLY
  useEffect(() => {
    async function fetchFirestoreProducts() {
      try {
        const snap = await getDocs(collection(db, 'products'));
        const dbProducts = snap.docs.map((doc) => ({
          id: `firebase-${doc.id}`,
          dbId: doc.id,
          ...doc.data()
        }));
        setFirestoreProducts(dbProducts);
      } catch (error) {
        console.log('No Firestore products yet');
      }
      setLoading(false);
    }
    fetchFirestoreProducts();
  }, []);

  // Use ONLY Firestore products
  const allProducts = firestoreProducts;
  const filtered = activeCategory === 'All'
    ? allProducts
    : allProducts.filter(p => p.category === activeCategory);

  function handleAddToCart(product) {
    const size = product.sizes?.[0] || 'One Size';
    const quantity = selectedQuantities[product.id] || 1;
    addToCart(product, size, quantity);
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.23, 1, 0.82, 1] }
    }
  };

  if (loading) {
    return (
      <div style={{ background: '#060606', minHeight: '100vh' }}>
        <Navbar />
        <main style={{ padding: '80px 48px', textAlign: 'center' }}>
          <p style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '2rem', color: '#C94E0A', letterSpacing: '0.1em' }}>LOADING...</p>
        </main>
      </div>
    );
  }

  return (
    <div
      style={{
        background: '#060606',
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden'
      }}
    >

      {/* Cinematic maroon glow */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(circle at top center, rgba(120,20,0,0.18), transparent 60%)',
          pointerEvents: 'none',
          zIndex: 0
        }}
      />

      {/* Grain Overlay */}
      <div className="grain-overlay" />

      <style jsx global>{`
        .collections-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: clamp(16px, 4vw, 28px);
        }

        .product-card {
          background: linear-gradient(135deg, #171717, #101010);
          border: 1px solid rgba(255,255,255,0.08);
          box-shadow: 0 10px 36px rgba(0,0,0,0.38);
          overflow: hidden;
          cursor: pointer;
          position: relative;
          border-radius: 16px;
          display: flex;
          flex-direction: column;
          isolation: isolate;
        }

        .product-frame {
          margin: 14px 14px 0;
          padding: 10px;
          border-radius: 14px;
          background: linear-gradient(145deg, rgba(255,255,255,0.03), rgba(201,78,10,0.06));
          border: 1px solid rgba(255,255,255,0.1);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.05);
        }

        .product-image-shell {
          width: 100%;
          aspect-ratio: 1;
          background: linear-gradient(135deg, #1a1a1a 0%, #0e0e0e 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          border-radius: 10px;
        }

        .product-details {
          padding: 12px 16px 16px;
          margin-top: 8px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        @media (max-width: 900px) {
          .collections-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 640px) {
          .collections-grid {
            grid-template-columns: 1fr;
            gap: 14px;
          }

          .product-card {
            border-radius: 14px;
          }

          .product-frame {
            margin: 10px 10px 0;
            padding: 8px;
            border-radius: 12px;
          }

          .product-image-shell {
            aspect-ratio: 4 / 5;
          }

          .product-details {
            padding: 10px 12px 14px;
            gap: 8px;
          }
        }
      `}</style>

      <Navbar />

      <main
        style={{
          padding: 'clamp(40px, 5vw, 80px) clamp(20px, 5vw, 48px)',
          maxWidth: '1400px',
          margin: '0 auto',
          position: 'relative',
          zIndex: 2
        }}
      >

        {/* ANIMATED HEADER */}
        <motion.div 
          style={{ marginBottom: 'clamp(40px, 10vw, 60px)' }}
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.23, 1, 0.82, 1] }}
        >
          <motion.p 
            style={{
              fontSize: '11px',
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              color: '#7FD4F0',
              marginBottom: '16px'
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            {'// 001 — Shop the Latest'}
          </motion.p>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', flexWrap: 'wrap' }}>
            <motion.h1 
              style={{
                fontFamily: 'Bebas Neue, sans-serif',
                fontSize: 'clamp(2.5rem, 10vw, 6rem)',
                color: '#EEEBE3',
                letterSpacing: '0.05em',
                lineHeight: 1,
                fontWeight: 900
              }}
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
            >
              ALL
            </motion.h1>

            {/* Animated Word */}
            <motion.div
              style={{
                display: 'inline-block',
                overflow: 'hidden'
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <motion.h1
                style={{
                  fontFamily: 'Bebas Neue, sans-serif',
                  fontSize: 'clamp(2.5rem, 10vw, 6rem)',
                  color: '#C94E0A',
                  letterSpacing: '0.05em',
                  lineHeight: 1,
                  fontWeight: 900,
                  margin: 0
                }}
                animate={{ x: [0, 8, 0] }}
                transition={{ delay: 0.7, duration: 2, repeat: Infinity, repeatDelay: 4 }}
              >
                COLLECTIONS
              </motion.h1>
            </motion.div>
          </div>

          <motion.div
            style={{
              height: '3px',
              width: '120px',
              background: 'linear-gradient(90deg, #C94E0A, #F0BE00, transparent)',
              marginTop: '16px'
            }}
            initial={{ scaleX: 0, originX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          />
        </motion.div>

        {/* Category Filter - Enhanced */}
        <motion.div 
          style={{
            display: 'flex',
            gap: 'clamp(8px, 2vw, 12px)',
            flexWrap: 'wrap',
            marginBottom: 'clamp(40px, 10vw, 60px)',
            borderBottom: '2px solid',
            borderImage: 'linear-gradient(90deg, #C94E0A, #222222) 1',
            paddingBottom: '20px',
            overflowX: 'auto',
            scrollBehavior: 'smooth'
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          {categories.map((cat, idx) => (
            <motion.button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              whileHover={{ scale: 1.08, y: -2 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + idx * 0.05, duration: 0.4 }}
              style={{
                fontFamily: 'Bebas Neue, sans-serif',
                fontSize: 'clamp(0.75rem, 2.5vw, 0.95rem)',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                padding: 'clamp(8px, 2vw, 10px) clamp(16px, 4vw, 24px)',
                cursor: 'pointer',
                border: '2px solid',
                borderColor: activeCategory === cat ? '#C94E0A' : '#333333',
                background: activeCategory === cat 
                  ? 'linear-gradient(135deg, #C94E0A, rgba(240,190,0,0.2))'
                  : 'transparent',
                color: activeCategory === cat ? '#EEEBE3' : '#666666',
                transition: 'all 0.3s cubic-bezier(0.23, 1, 0.82, 1)',
                whiteSpace: 'nowrap',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {activeCategory === cat && (
                <motion.div
                  layoutId="activeCategory"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'radial-gradient(circle at center, rgba(240,190,0,0.1), transparent)',
                    pointerEvents: 'none'
                  }}
                  transition={{ duration: 0.3 }}
                />
              )}
              <span style={{ position: 'relative', zIndex: 1 }}>{cat}</span>
            </motion.button>
          ))}
        </motion.div>

        {/* Product Count */}
        <motion.p
          style={{
            fontSize: 'clamp(11px, 2.5vw, 13px)',
            color: '#7FD4F0',
            letterSpacing: '0.1em',
            marginBottom: '28px'
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
        >
          {filtered.length} Items Available
        </motion.p>

        <motion.div
          className="collections-grid"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {filtered.map((product, idx) => (
            <Link
              key={product.id}
              href={`/products/${product.dbId}`}
              style={{ textDecoration: 'none' }}
            >
              <motion.div
                variants={itemVariants}
                whileHover={{
                  y: -12,
                  transition: { duration: 0.3 }
                }}
                className="product-card"
                style={{
                  boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                  cursor: 'pointer'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.boxShadow = '0 16px 48px rgba(201,78,10,0.25)';
                  e.currentTarget.style.borderColor = '#C94E0A';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.4)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                }}
                onTouchStart={() => setTouchedProduct(product.id)}
                onTouchEnd={() => setTouchedProduct(null)}
              >

              {/* Enhanced Cinematic Glow */}
              <motion.div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background:
                    'radial-gradient(circle at center, rgba(201,78,10,0.15) 0%, transparent 70%)',
                  pointerEvents: 'none',
                  opacity: touchedProduct === product.id ? 1 : 0
                }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
              />

              {/* Product Image */}
              <div className="product-frame">
                <div className="product-image-shell">
                {product.imagePublicId ? (
                  <img 
                    src={`https://res.cloudinary.com/dsxhsoem9/image/upload/w_400,h_400,c_fill/${product.imagePublicId}`}
                    alt={product.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <motion.span
                    whileHover={{
                      scale: 1.12,
                      textShadow: '0 0 30px rgba(201,78,10,0.4)'
                    }}
                    transition={{
                      duration: 0.4
                    }}
                    style={{
                      fontFamily: 'Bebas Neue, sans-serif',
                      fontSize: 'clamp(2.5rem, 12vw, 4rem)',
                      color: 'rgba(201,78,10,0.25)',
                      textShadow: '0 0 20px rgba(201,78,10,0.15)',
                      letterSpacing: '0.1em'
                    }}
                  >
                    GUN
                  </motion.span>
                )}

                <motion.div 
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background:
                      'linear-gradient(to top, rgba(0,0,0,0.5), transparent)',
                    pointerEvents: 'none'
                  }}
                  whileHover={{ background: 'linear-gradient(to top, rgba(0,0,0,0.3), transparent)' }}
                  transition={{ duration: 0.3 }}
                />

                {product.isNew && (
                  <motion.div 
                    style={{
                      position: 'absolute',
                      top: '14px',
                      left: '14px',
                      background: 'linear-gradient(135deg, #F0BE00, #C94E0A)',
                      color: '#060606',
                      fontFamily: 'Bebas Neue, sans-serif',
                      fontSize: '0.7rem',
                      letterSpacing: '0.12em',
                      padding: '6px 12px',
                      fontWeight: 700,
                      textTransform: 'uppercase'
                    }}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + idx * 0.05 }}
                  >
                    ✨ New
                  </motion.div>
                )}
                </div>
              </div>

              {/* Product Info */}
              <div className="product-details">
                <motion.p
                  style={{
                    fontSize: '9px',
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    color: '#7FD4F0',
                    marginBottom: '8px',
                    fontWeight: 600
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.85 + idx * 0.05 }}
                >
                  {product.category}
                </motion.p>

                <motion.h3
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9 + idx * 0.05 }}
                  style={{
                    fontFamily: 'Bebas Neue, sans-serif',
                    fontSize: 'clamp(1rem, 4vw, 1.25rem)',
                    color: '#EEEBE3',
                    letterSpacing: '0.06em',
                    marginBottom: '8px',
                    lineHeight: 1.2,
                    fontWeight: 700,
                    margin: 0
                  }}
                >
                  {product.name}
                </motion.h3>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '10px',
                  marginTop: '4px',
                  marginBottom: '2px',
                  padding: '8px 0 2px',
                  borderTop: 'none',
                  borderBottom: 'none'
                }}>
                  <motion.p
                    style={{
                      fontFamily: 'Bebas Neue, sans-serif',
                      fontSize: 'clamp(1rem, 3vw, 1.2rem)',
                      color: '#F0BE00',
                      fontWeight: 700,
                      letterSpacing: '0.05em',
                      margin: 0
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 + idx * 0.05 }}
                  >
                    KES {product.price.toLocaleString()}
                  </motion.p>

                  <select
                    value={selectedQuantities[product.id] || 1}
                    onChange={(e) => setSelectedQuantities(prev => ({ ...prev, [product.id]: Number(e.target.value) }))}
                    style={{
                      background: '#111111',
                      color: '#EEEBE3',
                      border: '1px solid #333333',
                      padding: '6px 8px',
                      fontSize: '0.8rem',
                      outline: 'none'
                    }}
                  >
                    {[1, 2, 3, 4, 5].map((qty) => (
                      <option key={qty} value={qty}>{qty} Qty</option>
                    ))}
                  </select>
                </div>

                <motion.button
                  onClick={() => handleAddToCart(product)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.96 }}
                  style={{
                    background: 'linear-gradient(135deg, #C94E0A, #F0BE00)',
                    color: '#060606',
                    border: 'none',
                    fontFamily: 'Bebas Neue, sans-serif',
                    fontSize: '0.8rem',
                    letterSpacing: '0.1em',
                    fontWeight: 700,
                    padding: '10px 12px',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    whiteSpace: 'nowrap',
                    textTransform: 'uppercase',
                    width: '100%'
                  }}
                >
                  + Add to Cart
                </motion.button>

                <motion.p
                  style={{
                    fontSize: 'clamp(0.85rem, 1.8rem, 1rem)',
                    color: '#7FD4F0',
                    marginTop: '10px',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    margin: '10px 0 0 0'
                  }}
                >
                  Click to explore →
                </motion.p>
              </div>

              </motion.div>
            </Link>
          ))}
        </motion.div>

      </main>

      <Footer />
    </div>
  );
}