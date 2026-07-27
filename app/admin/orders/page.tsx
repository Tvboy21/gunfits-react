'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../../components/Navbar';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { getFirestore, collection, getDocs, doc, updateDoc } from 'firebase/firestore';
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

interface Order {
  id: string;
  email: string;
  items: Array<{ name: string; price: number; quantity: number; size: string }>;
  totalAmount: number;
  status: string;
  shippingAddress: string;
  createdAt: string;
  statusUpdates?: Array<{ status: string; timestamp: string; message: string }>;
}

export default function AdminOrdersPage() {
  const { user, isAdmin, loading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) router.push('/');
  }, [user, isAdmin, loading, router]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'orders'));
        const orderList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        } as Order));
        
        // Sort by most recent first
        orderList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setOrders(orderList);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoadingOrders(false);
      }
    };

    if (user && isAdmin) {
      fetchOrders();
    }
  }, [user, isAdmin]);

  const handleStatusUpdate = async (orderId: string) => {
    const newStatus = selectedStatus[orderId];
    if (!newStatus) return;

    setUpdating(orderId);
    try {
      const orderRef = doc(db, 'orders', orderId);
      const order = orders.find(o => o.id === orderId);

      if (!order) return;

      // Create status update
      const statusUpdate = {
        status: newStatus,
        timestamp: new Date().toISOString(),
        message: getStatusMessage(newStatus),
      };

      const updatedStatusUpdates = [...(order.statusUpdates || []), statusUpdate];

      // Update Firestore
      await updateDoc(orderRef, {
        status: newStatus,
        statusUpdates: updatedStatusUpdates,
      });

      // Send email notification
      await fetch('/api/send-order-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: order.email,
          orderId: orderId,
          status: newStatus,
          message: statusUpdate.message,
          items: order.items,
          totalAmount: order.totalAmount,
        }),
      });

      // Update local state
      const updatedOrders = orders.map(o =>
        o.id === orderId
          ? { ...o, status: newStatus, statusUpdates: updatedStatusUpdates }
          : o
      );
      setOrders(updatedOrders);

      setStatusMessage(`✓ Order updated & email sent to ${order.email}`);
      setTimeout(() => setStatusMessage(''), 3000);
    } catch (error) {
      console.error('Error updating order:', error);
      setStatusMessage('Error updating order. Try again.');
    } finally {
      setUpdating(null);
    }
  };

  const getStatusMessage = (status: string): string => {
    const messages: { [key: string]: string } = {
      Pending: 'We received your order and are getting it ready!',
      Processing: 'Your order is being packed with care.',
      Shipped: 'Your order is on its way! Track it soon.',
      Delivered: 'Your order has arrived. Thanks for the love!',
    };
    return messages[status] || 'Your order status has been updated.';
  };

  if (loading) return null;
  if (!isAdmin) return null;

  return (
    <div style={{ background: '#060606', minHeight: '100vh', color: '#EEEBE3', fontFamily: 'Barlow Condensed, sans-serif', overflow: 'hidden' }}>
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

      <div
        style={{
          padding: 'clamp(40px, 8vw, 80px) clamp(20px, 5vw, 48px)',
          maxWidth: '1400px',
          margin: '0 auto',
          position: 'relative',
          zIndex: 2,
        }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{ marginBottom: 'clamp(60px, 12vw, 80px)' }}>
          <p
            style={{
              fontSize: 'clamp(10px, 2vw, 12px)',
              letterSpacing: '0.3em',
              color: '#C94E0A',
              margin: '0 0 16px',
              fontWeight: 900,
            }}>
            // ADMIN DASHBOARD
          </p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '16px', flexWrap: 'wrap' }}>
            <h1
              style={{
                fontSize: 'clamp(2rem, 8vw, 3.5rem)',
                fontWeight: 900,
                margin: 0,
                letterSpacing: '0.05em',
                fontFamily: 'Bebas Neue, sans-serif',
              }}>
              MANAGE ORDERS
            </h1>
            <span
              style={{
                background: 'rgba(201,78,10,0.2)',
                color: '#C94E0A',
                padding: '6px 12px',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: 900,
                letterSpacing: '0.1em',
              }}>
              {orders.length} ORDERS
            </span>
          </div>
        </motion.div>

        {/* Status Message */}
        {statusMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              padding: '12px 16px',
              marginBottom: '24px',
              background: statusMessage.includes('✓') ? 'rgba(68,204,68,0.15)' : 'rgba(255,68,68,0.15)',
              border: `1px solid ${statusMessage.includes('✓') ? '#44cc44' : '#ff4444'}`,
              color: statusMessage.includes('✓') ? '#44cc44' : '#ff6666',
              fontSize: '12px',
              letterSpacing: '0.08em',
              borderRadius: '4px',
            }}>
            {statusMessage}
          </motion.div>
        )}

        {/* Orders List */}
        {loadingOrders ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#666666' }}>
            Loading orders...
          </div>
        ) : orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#666666' }}>
            <p style={{ fontSize: '14px' }}>No orders yet.</p>
          </div>
        ) : (
          <motion.div
            style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 3vw, 16px)' }}
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.05 } } }}
            initial="hidden"
            animate="visible">
            {orders.map((order) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  background: 'linear-gradient(135deg, rgba(201,78,10,0.08), transparent)',
                  border: '1px solid rgba(201,78,10,0.2)',
                  padding: 'clamp(20px, 4vw, 32px)',
                  borderRadius: '4px',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = '#C94E0A';
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 32px rgba(201,78,10,0.2)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(201,78,10,0.2)';
                  (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                }}>
                {/* Order Header */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '20px', alignItems: 'start', marginBottom: '20px' }}>
                  <div>
                    <p style={{ fontSize: '10px', color: '#C94E0A', fontWeight: 900, margin: 0, letterSpacing: '0.1em' }}>ORDER #{order.id}</p>
                    <p style={{ fontSize: '13px', color: '#EEEBE3', fontWeight: 900, margin: '4px 0 0', letterSpacing: '0.05em' }}>
                      {order.email}
                    </p>
                    <p style={{ fontSize: '11px', color: '#888888', margin: '4px 0 0' }}>
                      {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: '10px', color: '#C94E0A', fontWeight: 900, margin: 0, letterSpacing: '0.1em' }}>TOTAL</p>
                    <p style={{ fontSize: '16px', color: '#F0BE00', fontWeight: 900, margin: '4px 0 0', fontFamily: 'Bebas Neue, sans-serif' }}>
                      KES {order.totalAmount?.toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Items */}
                <div style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid rgba(201,78,10,0.1)' }}>
                  {order.items?.map((item, idx) => (
                    <p key={idx} style={{ fontSize: '12px', color: '#EEEBE3', margin: idx === 0 ? 0 : '8px 0 0' }}>
                      {item.name} (Size {item.size}) × {item.quantity}
                    </p>
                  ))}
                </div>

                {/* Status Update */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '12px', alignItems: 'end' }}>
                  <div>
                    <label style={{ fontSize: '10px', color: '#C94E0A', fontWeight: 900, display: 'block', marginBottom: '6px', letterSpacing: '0.1em' }}>
                      UPDATE STATUS
                    </label>
                    <select
                      value={selectedStatus[order.id] || order.status}
                      onChange={(e) => setSelectedStatus({ ...selectedStatus, [order.id]: e.target.value })}
                      style={{
                        width: '100%',
                        background: 'rgba(0,0,0,0.3)',
                        border: '1px solid rgba(201,78,10,0.2)',
                        color: '#EEEBE3',
                        padding: '10px 12px',
                        fontSize: '12px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        outline: 'none',
                      }}>
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </div>
                  <motion.button
                    onClick={() => handleStatusUpdate(order.id)}
                    disabled={updating === order.id || selectedStatus[order.id] === order.status}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                      background:
                        updating === order.id || selectedStatus[order.id] === order.status ? '#333333' : '#C94E0A',
                      color: updating === order.id || selectedStatus[order.id] === order.status ? '#666666' : '#060606',
                      border: 'none',
                      padding: '10px 20px',
                      fontSize: '11px',
                      fontWeight: 900,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      cursor:
                        updating === order.id || selectedStatus[order.id] === order.status ? 'not-allowed' : 'pointer',
                      borderRadius: '4px',
                      fontFamily: 'Bebas Neue, sans-serif',
                      whiteSpace: 'nowrap',
                    }}>
                    {updating === order.id ? 'SENDING...' : 'UPDATE & NOTIFY'}
                  </motion.button>
                </div>

                {/* Current Status */}
                <div style={{ marginTop: '12px', fontSize: '11px', color: '#888888' }}>
                  Current: <span style={{ color: '#C94E0A', fontWeight: 900 }}>{order.status}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}