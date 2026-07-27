'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { CldImage } from 'next-cloudinary';
import { useCart } from '../../context/CartContext';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
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

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.id;
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedImage, setSelectedImage] = useState('');
  const [loading, setLoading] = useState(true);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const docRef = doc(db, 'products', productId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const productData = { id: docSnap.id, ...docSnap.data() };
          setProduct(productData);
          
          if (productData.images && productData.images.length > 0) {
            setSelectedImage(productData.images[0]);
          }
          if (productData.sizes && productData.sizes.length > 0) {
            setSelectedSize(productData.sizes[0]);
          }

          if (productData.relatedProductIds && productData.relatedProductIds.length > 0) {
            const relatedDocs = await Promise.all(
              productData.relatedProductIds.map(id => getDoc(doc(db, 'products', id)))
            );
            const related = relatedDocs
              .filter(d => d.exists())
              .map(d => ({
                id: d.id,
                name: d.data().name,
                price: d.data().price,
                images: d.data().images || [],
              }));
            setRelatedProducts(related);
          }
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('Please select a size');
      return;
    }

    if (product) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: selectedImage,
        size: selectedSize,
        quantity: 1,
      });

      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    }
  };

  if (loading) {
    return (
      <div style={{ background: '#060606', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Navbar />
        <div style={{ color: '#EEEBE3' }}>Loading...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ background: '#060606', minHeight: '100vh' }}>
        <Navbar />
        <div style={{ padding: '60px 20px', textAlign: 'center', color: '#EEEBE3' }}>
          <h1>Product not found</h1>
          <Link href="/collections">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                background: '#C94E0A',
                color: '#060606',
                border: 'none',
                padding: '12px 28px',
                fontSize: '12px',
                fontWeight: 900,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                marginTop: '20px',
              }}>
              Back to Collections
            </motion.button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div style={{ background: '#060606', color: '#EEEBE3', minHeight: '100vh', fontFamily: 'Barlow Condensed, sans-serif' }}>
      {/* Texture */}
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

      <Navbar />

      {/* Breadcrumb */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{
          padding: '40px clamp(20px, 5vw, 48px)',
          borderBottom: '1px solid rgba(201,78,10,0.2)',
          position: 'relative',
          zIndex: 2,
        }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <Link href="/collections">
            <span style={{ color: '#C94E0A', fontSize: '12px', fontWeight: 700, letterSpacing: '0.1em', cursor: 'pointer' }}>
              COLLECTIONS
            </span>
          </Link>
          <span style={{ color: '#666666', margin: '0 12px' }}>/</span>
          <span style={{ color: '#EEEBE3', fontSize: '12px', fontWeight: 700 }}>{product.name.toUpperCase()}</span>
        </div>
      </motion.div>

      {/* Main Content */}
      <div
        style={{
          padding: 'clamp(40px, 8vw, 80px) clamp(20px, 5vw, 48px)',
          maxWidth: '1400px',
          margin: '0 auto',
          position: 'relative',
          zIndex: 2,
        }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(clamp(300px, 45vw, 600px), 1fr))',
            gap: 'clamp(32px, 6vw, 60px)',
            marginBottom: 'clamp(80px, 15vw, 120px)',
          }}>
          {/* Images */}
          <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
            {/* Main Image */}
            <div
              style={{
                marginBottom: '20px',
                borderRadius: '4px',
                overflow: 'hidden',
                background: '#1a1a1a',
                border: '1px solid rgba(201,78,10,0.2)',
                aspectRatio: '1 / 1',
              }}>
              {selectedImage ? (
                <CldImage
                  src={selectedImage}
                  width={600}
                  height={600}
                  alt={product.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666666' }}>
                  No image
                </div>
              )}
            </div>

            {/* Thumbnail Grid */}
            {product.images && product.images.length > 1 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(70px, 1fr))', gap: '12px' }}>
                {product.images.map((img, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{ scale: 1.05 }}
                    onClick={() => setSelectedImage(img)}
                    style={{
                      cursor: 'pointer',
                      borderRadius: '4px',
                      overflow: 'hidden',
                      border: selectedImage === img ? '2px solid #C94E0A' : '1px solid rgba(201,78,10,0.2)',
                      aspectRatio: '1 / 1',
                      background: '#1a1a1a',
                    }}>
                    <CldImage
                      src={img}
                      width={150}
                      height={150}
                      alt={`${product.name} ${idx + 1}`}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Details */}
          <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.1 }}>
            {/* Title */}
            <h1
              style={{
                fontSize: 'clamp(1.8rem, 6vw, 3rem)',
                fontWeight: 900,
                margin: '0 0 16px',
                letterSpacing: '0.05em',
                fontFamily: 'Bebas Neue, sans-serif',
              }}>
              {product.name}
            </h1>

            {/* Price */}
            <div
              style={{
                fontSize: 'clamp(1.4rem, 3vw, 2rem)',
                color: '#F0BE00',
                fontWeight: 900,
                marginBottom: '24px',
                letterSpacing: '0.05em',
              }}>
              KES {product.price?.toLocaleString()}
            </div>

            {/* Status */}
            <div
              style={{
                marginBottom: '32px',
                fontSize: '12px',
                fontWeight: 700,
                letterSpacing: '0.15em',
                color: product.inStock ? '#44cc44' : '#ff6666',
              }}>
              {product.inStock ? '✓ IN STOCK' : '✗ OUT OF STOCK'}
            </div>

            {/* Description */}
            <p
              style={{
                fontSize: 'clamp(0.95rem, 2vw, 1.1rem)',
                color: '#EEEBE3',
                lineHeight: 1.8,
                marginBottom: '32px',
                letterSpacing: '0.01em',
              }}>
              {product.description}
            </p>

            {/* Sizes */}
            <div style={{ marginBottom: '32px' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '10px',
                  letterSpacing: '0.3em',
                  color: '#C94E0A',
                  fontWeight: 900,
                  marginBottom: '12px',
                  textTransform: 'uppercase',
                }}>
                SELECT SIZE
              </label>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                {product.sizes?.map((size) => (
                  <motion.button
                    key={size}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedSize(size)}
                    style={{
                      padding: '12px 20px',
                      fontSize: '12px',
                      fontWeight: 700,
                      letterSpacing: '0.1em',
                      border: selectedSize === size ? '2px solid #C94E0A' : '1px solid rgba(201,78,10,0.3)',
                      background: selectedSize === size ? 'rgba(201,78,10,0.2)' : 'transparent',
                      color: '#EEEBE3',
                      cursor: 'pointer',
                      borderRadius: '4px',
                      transition: 'all 0.2s',
                    }}>
                    {size}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Add to Cart */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAddToCart}
              disabled={!product.inStock}
              style={{
                width: '100%',
                padding: '16px',
                background: !product.inStock ? '#333333' : 'linear-gradient(135deg, #C94E0A, #F0BE00)',
                color: !product.inStock ? '#666666' : '#060606',
                border: 'none',
                fontSize: '12px',
                fontWeight: 900,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                cursor: !product.inStock ? 'not-allowed' : 'pointer',
                borderRadius: '4px',
                marginBottom: '16px',
                boxShadow: !product.inStock ? 'none' : '0 10px 40px rgba(201,78,10,0.3)',
              }}>
              {addedToCart ? '✓ ADDED TO CART' : 'ADD TO CART'}
            </motion.button>

            {/* Additional Info */}
            {(product.material || product.care) && (
              <div
                style={{
                  padding: '20px',
                  background: 'rgba(201,78,10,0.1)',
                  border: '1px solid rgba(201,78,10,0.2)',
                  borderRadius: '4px',
                  marginTop: '24px',
                }}>
                {product.material && (
                  <div style={{ marginBottom: '12px' }}>
                    <p style={{ fontSize: '10px', color: '#C94E0A', fontWeight: 700, margin: '0 0 4px', letterSpacing: '0.1em' }}>
                      MATERIAL
                    </p>
                    <p style={{ fontSize: '12px', color: '#EEEBE3', margin: 0 }}>{product.material}</p>
                  </div>
                )}
                {product.care && (
                  <div>
                    <p style={{ fontSize: '10px', color: '#C94E0A', fontWeight: 700, margin: '0 0 4px', letterSpacing: '0.1em' }}>
                      CARE
                    </p>
                    <p style={{ fontSize: '12px', color: '#EEEBE3', margin: 0 }}>{product.care}</p>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </div>

        {/* Detailed Description */}
        {product.detailedDescription && (
          <motion.section
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{
              padding: 'clamp(32px, 6vw, 48px)',
              border: '1px solid rgba(201,78,10,0.2)',
              borderRadius: '4px',
              marginBottom: 'clamp(80px, 15vw, 120px)',
              background: 'linear-gradient(135deg, rgba(201,78,10,0.05), transparent)',
            }}>
            <h2
              style={{
                fontSize: 'clamp(1.4rem, 4vw, 2rem)',
                fontWeight: 900,
                marginBottom: '20px',
                letterSpacing: '0.05em',
              }}>
              THE STORY
            </h2>
            <p
              style={{
                fontSize: 'clamp(0.95rem, 2vw, 1.1rem)',
                lineHeight: 2,
                color: '#888888',
                letterSpacing: '0.01em',
              }}>
              {product.detailedDescription}
            </p>
          </motion.section>
        )}

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}>
            <h2
              style={{
                fontSize: 'clamp(1.6rem, 5vw, 2.5rem)',
                fontWeight: 900,
                marginBottom: '40px',
                letterSpacing: '0.05em',
              }}>
              MATCH IT WITH
            </h2>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(clamp(200px, 40vw, 280px), 1fr))',
                gap: 'clamp(20px, 4vw, 32px)',
              }}>
              {relatedProducts.map((related, idx) => (
                <Link key={related.id} href={`/products/${related.id}`}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -8 }}
                    style={{
                      cursor: 'pointer',
                      borderRadius: '4px',
                      overflow: 'hidden',
                    }}>
                    {/* Image */}
                    <div
                      style={{
                        marginBottom: '16px',
                        borderRadius: '4px',
                        overflow: 'hidden',
                        background: '#1a1a1a',
                        border: '1px solid rgba(201,78,10,0.2)',
                        aspectRatio: '1 / 1',
                      }}>
                      {related.images && related.images.length > 0 ? (
                        <CldImage
                          src={related.images[0]}
                          width={280}
                          height={280}
                          alt={related.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      ) : (
                        <div
                          style={{
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#666666',
                          }}>
                          No image
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <h3
                      style={{
                        fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)',
                        fontWeight: 900,
                        margin: '0 0 8px',
                        letterSpacing: '0.05em',
                      }}>
                      {related.name}
                    </h3>
                    <p
                      style={{
                        fontSize: 'clamp(0.85rem, 2vw, 1rem)',
                        color: '#F0BE00',
                        fontWeight: 700,
                        margin: 0,
                      }}>
                      KES {related.price?.toLocaleString()}
                    </p>
                  </motion.div>
                </Link>
              ))}
            </div>
          </motion.section>
        )}
      </div>

      <Footer />
    </div>
  );
}
