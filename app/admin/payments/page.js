'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

export default function AdminPayments() {
  const { user, isAdmin, loading } = useAuth();
  const router = useRouter();
  const [payments, setPayments] = useState([]);
  const [loadingPayments, setLoadingPayments] = useState(true);

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) router.push('/');
  }, [user, isAdmin, loading, router]);

  useEffect(() => {
    if (!loading) fetchPayments();
  }, [loading]);

  async function fetchPayments() {
    const snap = await getDocs(collection(db, 'tickets'));
    const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    data.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    setPayments(data);
    setLoadingPayments(false);
  }

  const totalAmount = payments.reduce((sum, payment) => sum + Number(payment.amount || 0), 0);

  if (loading || loadingPayments) return null;
  if (!isAdmin) return null;

  return (
    <div style={{ background: '#060606', minHeight: '100vh' }}>
      <Navbar />
      <main style={{ padding: 'clamp(40px, 5vw, 80px) clamp(20px, 5vw, 48px)', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <Link href="/admin" style={{ fontSize: '11px', letterSpacing: '0.2em', color: '#666666', textDecoration: 'none', textTransform: 'uppercase' }}>← Back to Dashboard</Link>
            <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(2rem, 6vw, 4rem)', color: '#EEEBE3', letterSpacing: '0.05em', marginTop: '8px' }}>
              M-PESA <span style={{ color: '#44cc44' }}>PAYMENTS</span>
            </h1>
            <p style={{ fontSize: '13px', color: '#666666', marginTop: '8px', letterSpacing: '0.08em' }}>
              Review payment receipts captured from ticket purchases.
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: '11px', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#44cc44', marginBottom: '8px' }}>Total Revenue</p>
            <p style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '2rem', color: '#44cc44', margin: 0 }}>KES {totalAmount.toLocaleString()}</p>
          </div>
        </div>

        <div className="table-responsive" style={{ overflowX: 'auto', background: '#111111', border: '1px solid #222222', borderRadius: '16px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '760px' }}>
            <thead>
              <tr>
                {['Receipt', 'Phone', 'Amount', 'Status', 'Event Ref', 'Date'].map((title) => (
                  <th key={title} style={{ textAlign: 'left', padding: '18px 20px', fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#999999', borderBottom: '1px solid #222222' }}>{title}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment.id} style={{ borderBottom: '1px solid #222222' }}>
                  <td style={{ padding: '16px 20px', color: '#EEEBE3' }}>{payment.receiptNumber || '–'}</td>
                  <td style={{ padding: '16px 20px', color: '#EEEBE3' }}>{payment.phone || '–'}</td>
                  <td style={{ padding: '16px 20px', color: '#F0BE00' }}>KES {Number(payment.amount || 0).toLocaleString()}</td>
                  <td style={{ padding: '16px 20px', color: payment.status === 'paid' ? '#44cc44' : '#ff4444' }}>{payment.status || 'pending'}</td>
                  <td style={{ padding: '16px 20px', color: '#EEEBE3' }}>{payment.accountRef || '–'}</td>
                  <td style={{ padding: '16px 20px', color: '#999999' }}>{payment.createdAt ? new Date(payment.createdAt).toLocaleString() : '–'}</td>
                </tr>
              ))}
              {payments.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ padding: '24px 20px', color: '#999999', textAlign: 'center' }}>
                    No payments recorded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
