'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useSearchParams } from 'next/navigation';
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

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

interface StatusUpdate {
  status: string;
  timestamp: string;
  message: string;
}

interface Order {
  id: string;
  email: string;
  items: Array<{ name: string; price: number; quantity: number; size: string }>;
  totalAmount: number;
  status: string;
  shippingAddress?: string;
  createdAt: string;
  statusUpdates?: StatusUpdate[];
}

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams?.get('orderId') || '';
  const emailParam = searchParams?.get('email') || '';
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        setError('Order not found. Please open the link from your email or enter a valid order ID.');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError('');

      try {
        const orderRef = doc(db, 'orders', orderId);
        const orderDoc = await getDoc(orderRef);

        if (!orderDoc.exists()) {
          setError('Order not found. Please check your order ID and try again.');
          setOrder(null);
          return;
        }

        const orderData = orderDoc.data() as Omit<Order, 'id'>;

        if (emailParam && orderData.email && orderData.email !== emailParam) {
          setError('The email address does not match this order.');
          setOrder(null);
          return;
        }

        setOrder({ id: orderDoc.id, ...orderData });
      } catch (fetchError) {
        console.error('Error fetching order:', fetchError);
        setError('Unable to fetch order details. Please try again later.');
        setOrder(null);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, emailParam]);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  const notFoundMessage = (
    <div style={{ textAlign: 'center', padding: '80px 24px', color: '#EEEBE3' }}>
      <p style={{ fontSize: '18px', fontWeight: 700, marginBottom: '12px' }}>Order tracking unavailable</p>
      <p style={{ color: '#888888', maxWidth: '560px', margin: '0 auto' }}>
        {error || 'Please open the track order link from your email, or contact support if you need help.'}
      </p>
    </div>
  );

  return (
    <div style={{ background: '#060606', minHeight: '100vh', color: '#EEEBE3', fontFamily: 'Barlow Condensed, sans-serif', overflowX: 'hidden' }}>
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

      <main style={{ padding: 'clamp(40px, 8vw, 80px) clamp(20px, 5vw, 48px)', maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
        <motion.section initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <p style={{ fontSize: 'clamp(10px, 2vw, 12px)', letterSpacing: '0.3em', color: '#C94E0A', margin: '0 0 16px', fontWeight: 900 }}>
            ORDER TRACKING
          </p>
          <h1 style={{ fontSize: 'clamp(2rem, 8vw, 3.5rem)', margin: 0, letterSpacing: '0.05em', fontFamily: 'Bebas Neue, sans-serif' }}>
            Track your order
          </h1>
          <p style={{ color: '#888888', marginTop: '16px', maxWidth: '720px', lineHeight: 1.8 }}>
            Open the link from your order confirmation email to see the latest status, shipping details, and order information.
          </p>
        </motion.section>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 24px', color: '#EEEBE3' }}>
            <p style={{ fontSize: '16px', color: '#888888' }}>Loading order details...</p>
          </div>
        ) : error || !order ? (
          notFoundMessage
        ) : (
          <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.05 }}>
            <div style={{ display: 'grid', gap: '24px', marginTop: '40px' }}>
              <div style={{ padding: '28px', borderRadius: '16px', border: '1px solid rgba(201,78,10,0.2)', background: 'rgba(255,255,255,0.02)' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '16px', alignItems: 'flex-start' }}>
                  <div>
                    <p style={{ margin: 0, fontSize: '10px', letterSpacing: '0.16em', color: '#C94E0A', fontWeight: 900 }}>ORDER ID</p>
                    <p style={{ margin: '8px 0 0', fontSize: '18px', fontWeight: 900, color: '#EEEBE3' }}>{order.id}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ margin: 0, fontSize: '10px', letterSpacing: '0.16em', color: '#C94E0A', fontWeight: 900 }}>STATUS</p>
                    <p style={{ margin: '8px 0 0', fontSize: '18px', fontWeight: 900, color: '#F0BE00' }}>{order.status}</p>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginTop: '24px' }}>
                  <div>
                    <p style={{ margin: 0, fontSize: '10px', letterSpacing: '0.16em', color: '#C94E0A', fontWeight: 900 }}>EMAIL</p>
                    <p style={{ margin: '8px 0 0', color: '#EEEBE3' }}>{order.email}</p>
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: '10px', letterSpacing: '0.16em', color: '#C94E0A', fontWeight: 900 }}>ORDER PLACED</p>
                    <p style={{ margin: '8px 0 0', color: '#EEEBE3' }}>{formatDate(order.createdAt)}</p>
                  </div>
                </div>
                {order.shippingAddress ? (
                  <div style={{ marginTop: '24px' }}>
                    <p style={{ margin: 0, fontSize: '10px', letterSpacing: '0.16em', color: '#C94E0A', fontWeight: 900 }}>SHIPPING ADDRESS</p>
                    <p style={{ margin: '8px 0 0', color: '#EEEBE3', lineHeight: 1.6 }}>{order.shippingAddress}</p>
                  </div>
                ) : null}
              </div>

              <div style={{ display: 'grid', gap: '24px' }}>
                <div style={{ padding: '28px', borderRadius: '16px', border: '1px solid rgba(201,78,10,0.2)', background: 'rgba(255,255,255,0.02)' }}>
                  <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 900, color: '#EEEBE3' }}>Items in your order</h2>
                  <div style={{ marginTop: '18px', display: 'grid', gap: '16px' }}>
                    {order.items.map((item, idx) => (
                      <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '12px', alignItems: 'center', borderBottom: idx < order.items.length - 1 ? '1px solid rgba(201,78,10,0.1)' : 'none', paddingBottom: idx < order.items.length - 1 ? '12px' : '0' }}>
                        <div>
                          <p style={{ margin: 0, fontSize: '14px', color: '#EEEBE3', fontWeight: 700 }}>{item.name}</p>
                          <p style={{ margin: '6px 0 0', fontSize: '12px', color: '#888888' }}>Size {item.size} • Qty {item.quantity}</p>
                        </div>
                        <p style={{ margin: 0, fontSize: '14px', color: '#F0BE00', fontWeight: 900 }}>KES {(item.price * item.quantity).toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px', paddingTop: '24px', borderTop: '1px solid rgba(201,78,10,0.15)' }}>
                    <span style={{ color: '#888888', fontSize: '12px' }}>TOTAL</span>
                    <span style={{ color: '#F0BE00', fontSize: '18px', fontWeight: 900 }}>KES {order.totalAmount?.toLocaleString()}</span>
                  </div>
                </div>

                <div style={{ padding: '28px', borderRadius: '16px', border: '1px solid rgba(201,78,10,0.2)', background: 'rgba(255,255,255,0.02)' }}>
                  <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 900, color: '#EEEBE3' }}>Status timeline</h2>
                  <div style={{ marginTop: '18px', display: 'grid', gap: '14px' }}>
                    {(order.statusUpdates && order.statusUpdates.length > 0 ? order.statusUpdates : [{ status: order.status, timestamp: order.createdAt, message: 'Order created.' }]).map((update, idx) => (
                      <div key={idx} style={{ padding: '16px', borderRadius: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <p style={{ margin: 0, fontSize: '12px', color: '#C94E0A', fontWeight: 900 }}>{update.status}</p>
                        <p style={{ margin: '8px 0 0', color: '#EEEBE3', fontSize: '13px' }}>{update.message}</p>
                        <p style={{ margin: '10px 0 0', color: '#888888', fontSize: '11px' }}>{formatDate(update.timestamp)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.section>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense fallback={<div style={{ background: '#060606', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#EEEBE3' }}>Loading order details...</div>}>
      <TrackOrderContent />
    </Suspense>
  );
}