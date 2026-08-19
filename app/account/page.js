'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { getFirestore, doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
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

export default function AccountPage() {
  const { user, role, logout, loading } = useAuth();
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      fetchUserData();
      fetchTickets();
    }
  }, [user]);

  async function fetchUserData() {
    const docRef = doc(db, 'users', user.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) setUserData(docSnap.data());
  }

  async function fetchTickets() {
    const q = query(collection(db, 'tickets'), where('phone', '==', user.phoneNumber));
    const snap = await getDocs(q);
    setTickets(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  }

  async function handleLogout() {
    await logout();
    router.push('/');
  }

  if (loading) return (
    <div style={{ background: '#060606', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '2rem', color: '#C94E0A', letterSpacing: '0.1em' }}>LOADING...</p>
    </div>
  );

  if (!user) return null;

  const tabs = ['profile', 'orders', 'tickets'];

  return (
    <div style={{ background: '#060606', minHeight: '100vh' }}>
      <Navbar />

      <main className="account-page-shell" style={{ padding: '80px 48px', maxWidth: '1200px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: '48px' }}>
          <p style={{ fontSize: '11px', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#7FD4F0', marginBottom: '8px' }}>
            // My Account
          </p>
          <h1 style={{
            fontFamily: 'Bebas Neue, sans-serif',
            fontSize: 'clamp(3rem, 6vw, 5rem)',
            color: '#EEEBE3', letterSpacing: '0.05em', lineHeight: 1
          }}>
            {user.displayName?.toUpperCase() || 'MY'} <span style={{ color: '#C94E0A' }}>ACCOUNT</span>
          </h1>
          <p style={{ fontSize: '12px', color: '#666666', marginTop: '8px', letterSpacing: '0.1em' }}>
            {user.email} · <span style={{ color: role === 'premium' ? '#F0BE00' : '#666666', textTransform: 'uppercase' }}>{role}</span>
          </p>
        </div>

        <div className="account-layout" style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '32px', alignItems: 'start' }}>

          {/* Sidebar */}
          <div className="account-sidebar" style={{ background: '#111111', border: '1px solid #222222', borderTop: '3px solid #C94E0A', padding: '24px' }}>

            {/* Avatar */}
            <div style={{
              width: '80px', height: '80px',
              background: '#C94E0A',
              borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: '16px'
            }}>
              <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '2rem', color: '#EEEBE3' }}>
                {user.displayName?.[0]?.toUpperCase() || '?'}
              </span>
            </div>

            <p style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.2rem', color: '#EEEBE3', letterSpacing: '0.06em', marginBottom: '4px' }}>
              {user.displayName}
            </p>
            <p style={{ fontSize: '11px', color: '#666666', letterSpacing: '0.08em', marginBottom: '24px' }}>
              {user.email}
            </p>

            {/* Role badge */}
            <div style={{
              background: role === 'premium' ? 'rgba(240,190,0,0.1)' : 'rgba(102,102,102,0.1)',
              border: `1px solid ${role === 'premium' ? '#F0BE00' : '#333333'}`,
              padding: '8px 12px', marginBottom: '24px'
            }}>
              <p style={{
                fontFamily: 'Bebas Neue, sans-serif',
                fontSize: '0.85rem', letterSpacing: '0.1em',
                color: role === 'premium' ? '#F0BE00' : '#666666'
              }}>
                {role === 'premium' ? '⭐ PREMIUM MEMBER' : '👤 STANDARD USER'}
              </p>
            </div>

            {/* Nav tabs */}
            <div className="account-tabs" style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '24px' }}>
              {tabs.map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)} style={{
                  background: activeTab === tab ? '#C94E0A' : 'transparent',
                  border: 'none', color: activeTab === tab ? '#EEEBE3' : '#666666',
                  fontFamily: 'Bebas Neue, sans-serif',
                  fontSize: '0.95rem', letterSpacing: '0.1em',
                  textTransform: 'uppercase', padding: '10px 16px',
                  cursor: 'pointer', textAlign: 'left',
                  transition: 'all 0.2s'
                }}>{tab}</button>
              ))}
            </div>

            {/* Premium upgrade */}
            {role !== 'premium' && role !== 'admin' && (
              <div style={{ background: 'rgba(240,190,0,0.05)', border: '1px solid rgba(240,190,0,0.2)', padding: '16px', marginBottom: '16px' }}>
                <p style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '1rem', color: '#F0BE00', letterSpacing: '0.08em', marginBottom: '8px' }}>GO PREMIUM</p>
                <p style={{ fontSize: '11px', color: '#666666', lineHeight: 1.6, marginBottom: '12px' }}>Unlock custom clothing designer and exclusive drops.</p>
                <Link href="/premium" style={{
                  display: 'block', textAlign: 'center',
                  background: '#F0BE00', color: '#060606',
                  fontFamily: 'Bebas Neue, sans-serif',
                  fontSize: '0.85rem', letterSpacing: '0.1em',
                  padding: '8px', textDecoration: 'none'
                }}>UPGRADE</Link>
              </div>
            )}

            <button onClick={handleLogout} style={{
              width: '100%', background: 'transparent',
              border: '1px solid #333333', color: '#ff4444',
              fontFamily: 'Bebas Neue, sans-serif',
              fontSize: '0.9rem', letterSpacing: '0.1em',
              padding: '10px', cursor: 'pointer',
              transition: 'all 0.2s'
            }}>Logout</button>
          </div>

          {/* Main content */}
          <div>

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="account-panel" style={{ background: '#111111', border: '1px solid #222222', borderTop: '3px solid #C94E0A', padding: '32px' }}>
                <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.8rem', color: '#EEEBE3', letterSpacing: '0.08em', marginBottom: '24px' }}>PROFILE</h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {[
                    { label: 'Full Name', value: user.displayName },
                    { label: 'Email', value: user.email },
                    { label: 'Account Type', value: role?.toUpperCase() },
                    { label: 'Member Since', value: userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString('en-KE', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A' },
                  ].map((field, i) => (
                    <div key={i} className="account-info-row" style={{ display: 'grid', gridTemplateColumns: '160px 1fr', alignItems: 'center', borderBottom: '1px solid #1a1a1a', paddingBottom: '16px' }}>
                      <p style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#7FD4F0' }}>{field.label}</p>
                      <p style={{ fontSize: '14px', color: '#EEEBE3', letterSpacing: '0.06em' }}>{field.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="account-panel" style={{ background: '#111111', border: '1px solid #222222', borderTop: '3px solid #C94E0A', padding: '32px' }}>
                <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.8rem', color: '#EEEBE3', letterSpacing: '0.08em', marginBottom: '24px' }}>MY ORDERS</h2>
                <div style={{ textAlign: 'center', padding: '60px 0' }}>
                  <p style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.5rem', color: '#333333', letterSpacing: '0.1em', marginBottom: '8px' }}>NO ORDERS YET</p>
                  <p style={{ fontSize: '12px', color: '#555555', marginBottom: '24px' }}>Your order history will appear here.</p>
                  <Link href="/collections" style={{
                    background: '#C94E0A', color: '#EEEBE3',
                    fontFamily: 'Bebas Neue, sans-serif',
                    fontSize: '0.95rem', letterSpacing: '0.12em',
                    padding: '12px 28px', textDecoration: 'none'
                  }}>Shop Now</Link>
                </div>
              </div>
            )}

            {/* Tickets Tab */}
            {activeTab === 'tickets' && (
              <div className="account-panel" style={{ background: '#111111', border: '1px solid #222222', borderTop: '3px solid #C94E0A', padding: '32px' }}>
                <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.8rem', color: '#EEEBE3', letterSpacing: '0.08em', marginBottom: '24px' }}>MY TICKETS</h2>
                {tickets.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '60px 0' }}>
                    <p style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.5rem', color: '#333333', letterSpacing: '0.1em', marginBottom: '8px' }}>NO TICKETS YET</p>
                    <p style={{ fontSize: '12px', color: '#555555', marginBottom: '24px' }}>Tickets you purchase will appear here.</p>
                    <Link href="/events" style={{
                      background: '#C94E0A', color: '#EEEBE3',
                      fontFamily: 'Bebas Neue, sans-serif',
                      fontSize: '0.95rem', letterSpacing: '0.12em',
                      padding: '12px 28px', textDecoration: 'none'
                    }}>View Events</Link>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {tickets.map(ticket => (
                      <div key={ticket.id} style={{ background: '#0e0e0e', border: '1px solid #222222', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <p style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.1rem', color: '#EEEBE3', letterSpacing: '0.05em', marginBottom: '4px' }}>{ticket.accountRef}</p>
                          <p style={{ fontSize: '11px', color: '#7FD4F0', letterSpacing: '0.1em' }}>Receipt: {ticket.receiptNumber}</p>
                          <p style={{ fontSize: '11px', color: '#666666', marginTop: '4px' }}>{new Date(ticket.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <p style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.2rem', color: '#F0BE00' }}>KES {ticket.amount?.toLocaleString()}</p>
                          <span style={{ background: '#44cc44', color: '#060606', fontSize: '9px', letterSpacing: '0.1em', padding: '2px 8px', fontFamily: 'Bebas Neue, sans-serif' }}>PAID</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}