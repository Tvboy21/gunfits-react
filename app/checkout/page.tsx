'use client';

import React, { useState } from 'react';
import { useCart } from '../context/CartContext';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function CheckoutPage() {
const { cart, clearCart } = useCart() as any;
const router = useRouter();

const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

const subtotal = cart.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);
  const shipping = 500;
  const total = subtotal + shipping;

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validate inputs
    if (!email || !phone || !shippingAddress) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    if (cart.length === 0) {
      setError('Your cart is empty');
      setLoading(false);
      return;
    }

    try {
      // Simulate M-Pesa payment
      // In production, this would redirect to M-Pesa STK Push
      const simulatedMpesaResponse = {
        Body: {
          stkCallback: {
            MerchantRequestID: `MER-${Date.now()}`,
            CheckoutRequestID: `CHK-${Date.now()}`,
            ResultCode: 0, // 0 = success
            ResultDesc: 'The service request has been initiated successfully.',
            CallbackMetadata: {
              Item: [
                { Name: 'Amount', Value: total },
                { Name: 'MpesaReceiptNumber', Value: `LIB${Math.random().toString(36).substr(2, 9).toUpperCase()}` },
                { Name: 'PhoneNumber', Value: parseInt(phone.replace(/\D/g, '')) },
              ],
            },
          },
        },
      };

      // Call the callback API
      const callbackResponse = await fetch('/api/mpesa/callback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(simulatedMpesaResponse),
      });

      const result = await callbackResponse.json();

      if (!result.success) {
        setError('Payment processing failed. Please try again.');
        setLoading(false);
        return;
      }

      // Clear cart and redirect to tracking
      clearCart();
      setTimeout(() => {
        router.push(`/orders/track?orderId=${result.orderId}&email=${encodeURIComponent(email)}`);
      }, 1500);

    } catch (err) {
      console.error('Checkout error:', err);
      setError('An error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div style={{ background: '#060606', minHeight: '100vh', color: '#EEEBE3', fontFamily: 'Barlow Condensed, sans-serif' }}>
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

      <div style={{ padding: 'clamp(40px, 8vw, 80px) clamp(20px, 5vw, 48px)', maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '60px' }}>
          <p style={{ fontSize: '12px', letterSpacing: '0.3em', color: '#C94E0A', margin: '0 0 16px', fontWeight: 900 }}>
            // CHECKOUT
          </p>
          <h1 style={{ fontSize: 'clamp(2rem, 8vw, 3.5rem)', fontWeight: 900, margin: 0, letterSpacing: '0.05em', fontFamily: 'Bebas Neue, sans-serif' }}>
            COMPLETE YOUR ORDER
          </h1>
        </motion.div>

        {cart.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px', color: '#888888' }}>
            <p style={{ fontSize: '18px', marginBottom: '20px' }}>Your cart is empty</p>
            <Link href="/collections">
              <motion.button
                whileHover={{ scale: 1.05 }}
                style={{
                  background: '#C94E0A',
                  color: '#060606',
                  border: 'none',
                  padding: '12px 28px',
                  fontSize: '12px',
                  fontWeight: 900,
                  letterSpacing: '0.15em',
                  cursor: 'pointer',
                  borderRadius: '4px',
                  fontFamily: 'Bebas Neue, sans-serif',
                }}>
                CONTINUE SHOPPING
              </motion.button>
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' }}>
            {/* Order Summary */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} style={{ padding: '32px', border: '1px solid rgba(201,78,10,0.2)', borderRadius: '4px', background: 'linear-gradient(135deg, rgba(201,78,10,0.05), transparent)', height: 'fit-content' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 900, margin: '0 0 24px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                ORDER SUMMARY
              </h2>

              {cart.map((item: any, idx: any) => (
                <div key={idx} style={{ paddingBottom: '16px', borderBottom: idx < cart.length - 1 ? '1px solid rgba(201,78,10,0.1)' : 'none', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <p style={{ margin: 0, fontSize: '13px', fontWeight: 700, color: '#EEEBE3' }}>{item.name}</p>
                    <p style={{ margin: 0, fontSize: '13px', color: '#F0BE00', fontWeight: 900 }}>KES {(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                  <p style={{ margin: 0, fontSize: '11px', color: '#888888' }}>
                    Size {item.size} • Qty {item.quantity}
                  </p>
                </div>
              ))}

              <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid rgba(201,78,10,0.2)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ fontSize: '12px', color: '#888888' }}>SUBTOTAL</span>
                  <span style={{ fontSize: '12px', color: '#EEEBE3', fontWeight: 700 }}>KES {subtotal.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <span style={{ fontSize: '12px', color: '#888888' }}>SHIPPING</span>
                  <span style={{ fontSize: '12px', color: '#EEEBE3', fontWeight: 700 }}>KES {shipping.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '16px', borderTop: '1px solid rgba(201,78,10,0.2)' }}>
                  <span style={{ fontSize: '14px', fontWeight: 900, color: '#EEEBE3', textTransform: 'uppercase', letterSpacing: '0.1em' }}>TOTAL</span>
                  <span style={{ fontSize: '18px', color: '#F0BE00', fontWeight: 900, fontFamily: 'Bebas Neue, sans-serif' }}>KES {total.toLocaleString()}</span>
                </div>
              </div>
            </motion.div>

            {/* Checkout Form */}
            <motion.form onSubmit={handleCheckout} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} style={{ padding: '32px', border: '1px solid rgba(201,78,10,0.2)', borderRadius: '4px', background: 'linear-gradient(135deg, rgba(201,78,10,0.05), transparent)' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 900, margin: '0 0 24px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                DELIVERY DETAILS
              </h2>

              {/* Email */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '10px', letterSpacing: '0.3em', color: '#C94E0A', fontWeight: 900, marginBottom: '8px' }}>
                  EMAIL ADDRESS
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: 'rgba(0,0,0,0.3)',
                    border: '1px solid rgba(201,78,10,0.2)',
                    color: '#EEEBE3',
                    fontSize: '13px',
                    borderRadius: '4px',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#C94E0A';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(201,78,10,0.2)';
                  }}
                />
              </div>

              {/* Phone */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '10px', letterSpacing: '0.3em', color: '#C94E0A', fontWeight: 900, marginBottom: '8px' }}>
                  PHONE NUMBER
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="254712345678"
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: 'rgba(0,0,0,0.3)',
                    border: '1px solid rgba(201,78,10,0.2)',
                    color: '#EEEBE3',
                    fontSize: '13px',
                    borderRadius: '4px',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#C94E0A';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(201,78,10,0.2)';
                  }}
                />
              </div>

              {/* Shipping Address */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '10px', letterSpacing: '0.3em', color: '#C94E0A', fontWeight: 900, marginBottom: '8px' }}>
                  SHIPPING ADDRESS
                </label>
                <textarea
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  placeholder="Enter your full delivery address"
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: 'rgba(0,0,0,0.3)',
                    border: '1px solid rgba(201,78,10,0.2)',
                    color: '#EEEBE3',
                    fontSize: '13px',
                    borderRadius: '4px',
                    outline: 'none',
                    boxSizing: 'border-box',
                    minHeight: '100px',
                    fontFamily: 'inherit',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#C94E0A';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(201,78,10,0.2)';
                  }}
                />
              </div>

              {/* Error */}
              {error && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ background: 'rgba(255,68,68,0.15)', border: '1px solid #ff4444', color: '#ff6666', padding: '12px', borderRadius: '4px', fontSize: '12px', marginBottom: '20px' }}>
                  {error}
                </motion.div>
              )}

              {/* Payment Button */}
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  width: '100%',
                  padding: '14px',
                  background: loading ? '#333333' : 'linear-gradient(135deg, #C94E0A, #F0BE00)',
                  color: loading ? '#666666' : '#060606',
                  border: 'none',
                  fontSize: '12px',
                  fontWeight: 900,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  borderRadius: '4px',
                  fontFamily: 'Bebas Neue, sans-serif',
                }}>
                {loading ? 'PROCESSING...' : 'PAY VIA M-PESA'}
              </motion.button>

              <p style={{ fontSize: '11px', color: '#888888', marginTop: '16px', textAlign: 'center', lineHeight: 1.6 }}>
                By completing this purchase, you agree to our terms and conditions. Your payment will be processed securely via M-Pesa.
              </p>
            </motion.form>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}