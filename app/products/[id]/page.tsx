'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';
import { initializeApp, getApps } from 'firebase/app';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useCart } from '../../context/CartContext';

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

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    async function fetchProduct() {
      try {
        const snap = await getDocs(query(collection(db, 'products'), where('__name__', '==', id)));
        if (!snap.empty) {
          const doc = snap.docs[0];
          const productData = { id: doc.id, ...doc.data() };
          setProduct(productData);
          setSelectedSize(productData.sizes?.[0] || 'One Size');

          // Fetch related products (same category)
          const relatedSnap = await getDocs(
            query(collection(db, 'products'), where('category', '==', productData.category))
          );
          const related = relatedSnap.docs
            .map(d => ({ id: d.id, ...d.data() }))
            .filter(p => p.id !== id)
            .slice(0, 3);
          setRelatedProducts(related);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      }
      setLoading(false);
    }

    if (id) fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, selectedSize, quantity);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
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

  if (!product) {
    return (
      <div style={{ background: '#060606', minHeight: '100vh' }}>
        <Navbar />
        <main style={{ padding: '80px 48px', textAlign: 'center' }}>
          <p style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '2rem', color: '#C94E0A', letterSpacing: '0.1em' }}>PRODUCT NOT FOUND</p>
          <Link href="/collections">
            <button style={{
              background: '#C94E0A',
              color: '#EEEBE3',
              border: 'none',
              padding: '12px 28px',
              fontSize: '12px',
              fontWeight: 900,
              letterSpacing: '0.15em',
              cursor: 'pointer',
              marginTop: '20px'
            }}>
              BACK TO COLLECTIONS
            </button>
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div style={{ background: '#060606', color: '#EEEBE3', minHeight: '100vh' }}>
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
            )
          `,
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <Navbar />

      <main style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: 'clamp(40px, 8vw, 80px) clamp(20px, 5vw, 48px)',
        position: 'relative',
        zIndex: 2,
      }}>

        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            display: 'flex',
            gap: '8px',
            marginBottom: '32px',
            fontSize: '12px',
            color: '#7FD4F0',
            letterSpacing: '0.1em'
          }}>
          <Link href="/collections" style={{ color: '#7FD4F0', textDecoration: 'none' }}>COLLECTIONS</Link>
          <span>/</span>
          <span>{product.category}</span>
          <span>/</span>
          <span style={{ color: '#C94E0A', fontWeight: 900 }}>{product.name}</span>
        </motion.div>

        {/* Main Product Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(clamp(300px, 45vw, 500px), 1fr))',
          gap: 'clamp(32px, 8vw, 60px)',
          marginBottom: '80px'
        }}>

          {/* Image Section */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
            {/* Main Image */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
              style={{
                position: 'relative',
                paddingBottom: '100%',
                background: '#1a1a1a',
                borderRadius: '8px',
                overflow: 'hidden',
                border: '1px solid rgba(201,78,10,0.2)',
              }}>
              <div style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                {product.imagePublicId ? (
                  <img
                    src={`https://res.cloudinary.com/dsxhsoem9/image/upload/w_600,h_600,c_fill/${product.imagePublicId}`}
                    alt={product.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <span style={{
                    fontFamily: 'Bebas Neue, sans-serif',
                    fontSize: '4rem',
                    color: 'rgba(201,78,10,0.2)',
                    letterSpacing: '0.1em'
                  }}>
                    GUN
                  </span>
                )}
              </div>

              {/* Stock Badge */}
              {product.inStock && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    position: 'absolute',
                    top: '20px',
                    right: '20px',
                    background: 'linear-gradient(135deg, #F0BE00, #C94E0A)',
                    color: '#060606',
                    padding: '8px 16px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontWeight: 900,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    zIndex: 10
                  }}>
                  ✓ In Stock
                </motion.div>
              )}
            </motion.div>

            {/* Image Counter */}
            <p style={{
              fontSize: '11px',
              color: '#666666',
              letterSpacing: '0.1em',
              textAlign: 'center'
            }}>
              1 of 1
            </p>
          </motion.div>

          {/* Details Section */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '24px'
            }}>

            {/* Header */}
            <div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                style={{
                  fontSize: '11px',
                  letterSpacing: '0.25em',
                  textTransform: 'uppercase',
                  color: '#7FD4F0',
                  marginBottom: '12px',
                  fontWeight: 600
                }}>
                {product.category}
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                style={{
                  fontFamily: 'Bebas Neue, sans-serif',
                  fontSize: 'clamp(1.8rem, 6vw, 2.8rem)',
                  color: '#EEEBE3',
                  margin: 0,
                  marginBottom: '16px',
                  letterSpacing: '0.05em',
                  lineHeight: 1.2
                }}>
                {product.name}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                style={{
                  fontSize: 'clamp(1rem, 3vw, 1.4rem)',
                  color: '#F0BE00',
                  fontFamily: 'Bebas Neue, sans-serif',
                  fontWeight: 700,
                  margin: 0,
                  letterSpacing: '0.05em'
                }}>
                KES {product.price.toLocaleString()}
              </motion.p>
            </div>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              style={{
                paddingTop: '16px',
                borderTop: '1px solid rgba(201,78,10,0.2)',
                paddingBottom: '16px',
              }}>
              <p style={{
                fontSize: 'clamp(0.95rem, 2vw, 1.1rem)',
                lineHeight: 1.8,
                color: '#CCCCCC',
                margin: 0,
              }}>
                {product.description || 'Premium urban streetwear designed for those who move different.'}
              </p>
            </motion.div>

            {/* Size Selection */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}>
              <p style={{
                fontSize: '11px',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: '#C94E0A',
                marginBottom: '12px',
                fontWeight: 900
              }}>
                Size
              </p>

              <div style={{
                display: 'flex',
                gap: '8px',
                flexWrap: 'wrap'
              }}>
                {product.sizes && product.sizes.length > 0 ? (
                  product.sizes.map((size) => (
                    <motion.button
                      key={size}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedSize(size)}
                      style={{
                        padding: '10px 16px',
                        border: selectedSize === size ? '2px solid #C94E0A' : '1px solid #333333',
                        background: selectedSize === size ? 'rgba(201,78,10,0.15)' : 'transparent',
                        color: selectedSize === size ? '#C94E0A' : '#EEEBE3',
                        fontSize: '12px',
                        fontWeight: 700,
                        letterSpacing: '0.1em',
                        cursor: 'pointer',
                        borderRadius: '4px',
                        transition: 'all 0.2s'
                      }}>
                      {size}
                    </motion.button>
                  ))
                ) : (
                  <p style={{ color: '#666666' }}>One Size</p>
                )}
              </div>
            </motion.div>

            {/* Quantity & Add to Cart */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 2fr',
                gap: '12px',
              }}>
              {/* Quantity */}
              <div>
                <p style={{
                  fontSize: '11px',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: '#C94E0A',
                  marginBottom: '8px',
                  fontWeight: 900
                }}>
                  Qty
                </p>
                <div style={{
                  display: 'flex',
                  border: '1px solid #333333',
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    style={{
                      flex: 1,
                      background: '#111111',
                      border: 'none',
                      color: '#EEEBE3',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}>
                    −
                  </button>
                  <div style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#060606',
                    color: '#EEEBE3',
                    fontSize: '14px',
                    fontWeight: 700
                  }}>
                    {quantity}
                  </div>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    style={{
                      flex: 1,
                      background: '#111111',
                      border: 'none',
                      color: '#EEEBE3',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}>
                    +
                  </button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <div>
                <p style={{
                  fontSize: '11px',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: '#C94E0A',
                  marginBottom: '8px',
                  fontWeight: 900,
                  opacity: 0
                }}>
                  &nbsp;
                </p>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddToCart}
                  style={{
                    width: '100%',
                    background: added ? 'linear-gradient(135deg, #44cc44, #22aa22)' : 'linear-gradient(135deg, #C94E0A, #F0BE00)',
                    color: '#060606',
                    border: 'none',
                    padding: '12px 20px',
                    fontSize: '12px',
                    fontWeight: 900,
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    borderRadius: '4px',
                    transition: 'all 0.3s'
                  }}>
                  {added ? '✓ ADDED TO CART' : '+ ADD TO CART'}
                </motion.button>
              </div>
            </motion.div>

            {/* Additional Info */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              style={{
                paddingTop: '24px',
                borderTop: '1px solid rgba(201,78,10,0.2)',
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '16px'
              }}>
              <div>
                <p style={{ fontSize: '10px', color: '#7FD4F0', margin: '0 0 6px', letterSpacing: '0.1em', fontWeight: 900 }}>MATERIAL</p>
                <p style={{ fontSize: '13px', color: '#EEEBE3', margin: 0 }}>Premium Cotton Blend</p>
              </div>
              <div>
                <p style={{ fontSize: '10px', color: '#7FD4F0', margin: '0 0 6px', letterSpacing: '0.1em', fontWeight: 900 }}>CARE</p>
                <p style={{ fontSize: '13px', color: '#EEEBE3', margin: 0 }}>Machine Wash Cold</p>
              </div>
              <div>
                <p style={{ fontSize: '10px', color: '#7FD4F0', margin: '0 0 6px', letterSpacing: '0.1em', fontWeight: 900 }}>SHIPPING</p>
                <p style={{ fontSize: '13px', color: '#EEEBE3', margin: 0 }}>KES 500 Standard</p>
              </div>
              <div>
                <p style={{ fontSize: '10px', color: '#7FD4F0', margin: '0 0 6px', letterSpacing: '0.1em', fontWeight: 900 }}>RETURNS</p>
                <p style={{ fontSize: '13px', color: '#EEEBE3', margin: 0 }}>14 Days Exchange</p>
              </div>
            </motion.div>

            {/* Continue Shopping */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}>
              <Link href="/collections">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    width: '100%',
                    background: 'transparent',
                    border: '2px solid #C94E0A',
                    color: '#EEEBE3',
                    padding: '12px 20px',
                    fontSize: '12px',
                    fontWeight: 900,
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    borderRadius: '4px',
                    transition: 'all 0.2s'
                  }}>
                  ← BACK TO COLLECTIONS
                </motion.button>
              </Link>
            </motion.div>

          </motion.div>

        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            style={{
              borderTop: '1px solid rgba(201,78,10,0.2)',
              paddingTop: '80px'
            }}>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              style={{
                fontSize: '11px',
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
                color: '#C94E0A',
                marginBottom: '24px',
                fontWeight: 900
              }}>
              RELATED ITEMS
            </motion.p>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(clamp(200px, 30vw, 300px), 1fr))',
              gap: 'clamp(20px, 4vw, 30px)',
            }}>
              {relatedProducts.map((relProduct, idx) => (
                <motion.div
                  key={relProduct.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -8 }}
                  style={{
                    cursor: 'pointer',
                    borderRadius: '8px',
                    overflow: 'hidden',
                  }}>
                  <Link href={`/products/${relProduct.id}`} style={{ textDecoration: 'none' }}>
                    <div style={{
                      paddingBottom: '100%',
                      position: 'relative',
                      background: '#1a1a1a',
                      marginBottom: '12px',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      border: '1px solid rgba(201,78,10,0.2)',
                    }}>
                      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {relProduct.imagePublicId ? (
                          <img
                            src={`https://res.cloudinary.com/dsxhsoem9/image/upload/w_300,h_300,c_fill/${relProduct.imagePublicId}`}
                            alt={relProduct.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        ) : (
                          <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '2rem', color: 'rgba(201,78,10,0.2)' }}>GUN</span>
                        )}
                      </div>
                    </div>
                    <p style={{ fontSize: '12px', color: '#7FD4F0', margin: '0 0 4px', letterSpacing: '0.1em' }}>{relProduct.category}</p>
                    <h4 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.1rem', color: '#EEEBE3', margin: '0 0 8px', letterSpacing: '0.05em' }}>{relProduct.name}</h4>
                    <p style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '1rem', color: '#F0BE00', margin: 0, fontWeight: 700 }}>KES {relProduct.price.toLocaleString()}</p>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

      </main>

      <Footer />
    </div>
  );
}