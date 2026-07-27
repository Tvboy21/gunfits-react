'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

export default function AdminPage() {
  const { user, isAdmin, loading } = useAuth();
  const [statsData, setStatsData] = useState({ orders: 0, products: 0, users: 0, revenue: 0 });
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      router.push('/');
    }
  }, [user, isAdmin, loading, router]);

  useEffect(() => {
    async function fetchDashboardStats() {
      try {
        const [ticketsSnap, productsSnap, usersSnap] = await Promise.all([
          getDocs(collection(db, 'tickets')),
          getDocs(collection(db, 'products')),
          getDocs(collection(db, 'users')),
        ]);
        const tickets = ticketsSnap.docs.map((doc) => doc.data());
        const revenue = tickets.reduce((sum, ticket) => sum + Number(ticket.amount || 0), 0);
        setStatsData({
          orders: ticketsSnap.size,
          products: productsSnap.size,
          users: usersSnap.size,
          revenue,
        });
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
      }
    }
    if (!loading && isAdmin) {
      fetchDashboardStats();
    }
  }, [loading, isAdmin]);

  if (loading) return (
    <div style={{ background: '#060606', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '2rem', color: '#C94E0A', letterSpacing: '0.1em' }}>LOADING...</p>
    </div>
  );

  if (!isAdmin) return null;

  const stats = [
    { label: 'Total Orders', value: statsData.orders.toLocaleString(), icon: '📦', color: '#C94E0A' },
    { label: 'Total Products', value: statsData.products.toLocaleString(), icon: '👕', color: '#F0BE00' },
    { label: 'Total Users', value: statsData.users.toLocaleString(), icon: '👥', color: '#7FD4F0' },
    { label: 'Revenue', value: `KES ${statsData.revenue.toLocaleString()}`, icon: '💰', color: '#44cc44' },
  ];

  const sections = [
    { title: 'Manage Products', desc: 'Add, edit or remove products from the store', href: '/admin/products', icon: '👕', color: '#C94E0A' },
    { title: 'View Orders', desc: 'See all customer orders and their status', href: '/admin/orders', icon: '📦', color: '#F0BE00' },
    { title: 'Manage Users', desc: 'View users, change roles, manage accounts', href: '/admin/users', icon: '👥', color: '#7FD4F0' },
    { title: 'Post Events', desc: 'Create and manage fashion events and shows', href: '/admin/events', icon: '🎪', color: '#44cc44' },
    { title: 'Design Requests', desc: 'View custom clothing designs from premium users', href: '/admin/designs', icon: '✏️', color: '#F0BE00' },
    { title: 'M-Pesa Payments', desc: 'View all transactions and payment history', href: '/admin/payments', icon: '💰', color: '#44cc44' },
  ];

  return (
    <div style={{ background: '#060606', minHeight: '100vh' }}>
      <Navbar />

      <main style={{ padding: 'clamp(40px, 8vw, 80px) clamp(20px, 5vw, 48px)', maxWidth: '1200px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: '48px' }}>
          <p style={{ fontSize: '11px', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#7FD4F0', marginBottom: '8px' }}>
            // Admin Panel
          </p>
          <h1 style={{
            fontFamily: 'Bebas Neue, sans-serif',
            fontSize: 'clamp(3rem, 6vw, 5rem)',
            color: '#EEEBE3',
            letterSpacing: '0.05em',
            lineHeight: 1
          }}>
            GUNFITS <span style={{ color: '#C94E0A' }}>DASHBOARD</span>
          </h1>
          <p style={{ fontSize: '13px', color: '#666666', marginTop: '12px', letterSpacing: '0.08em' }}>
            Welcome back, {user?.displayName || 'Admin'}
          </p>
        </div>

        {/* Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
          marginBottom: '48px'
        }}>
          {stats.map((stat, i) => (
            <div key={i} style={{
              background: '#111111',
              border: '1px solid #222222',
              borderTop: `3px solid ${stat.color}`,
              padding: '24px',
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '8px' }}>{stat.icon}</div>
              <p style={{
                fontFamily: 'Bebas Neue, sans-serif',
                fontSize: '2rem',
                color: stat.color,
                letterSpacing: '0.05em',
                lineHeight: 1
              }}>{stat.value}</p>
              <p style={{ fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#666666', marginTop: '4px' }}>{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Sections */}
        <div style={{ marginBottom: '24px' }}>
          <p style={{ fontSize: '11px', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#7FD4F0', marginBottom: '8px' }}>
            // Manage
          </p>
          <h2 style={{
            fontFamily: 'Bebas Neue, sans-serif',
            fontSize: '2.5rem',
            color: '#EEEBE3',
            letterSpacing: '0.05em',
            marginBottom: '24px'
          }}>QUICK ACTIONS</h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '16px'
        }}>
          {sections.map((section, i) => (
            <Link key={i} href={section.href} style={{ textDecoration: 'none' }}>
              <div style={{
                background: '#111111',
                border: '1px solid #222222',
                borderLeft: `4px solid ${section.color}`,
                padding: '28px',
                transition: 'transform 0.2s, border-color 0.2s',
                cursor: 'pointer'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.borderColor = section.color;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderLeftColor = section.color;
                e.currentTarget.style.borderColor = '#222222';
                e.currentTarget.style.borderLeftColor = section.color;
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '12px' }}>{section.icon}</div>
                <p style={{
                  fontFamily: 'Bebas Neue, sans-serif',
                  fontSize: '1.3rem',
                  color: '#EEEBE3',
                  letterSpacing: '0.05em',
                  marginBottom: '8px'
                }}>{section.title}</p>
                <p style={{ fontSize: '12px', color: '#666666', lineHeight: 1.6 }}>{section.desc}</p>
                <p style={{ fontSize: '11px', color: section.color, marginTop: '16px', letterSpacing: '0.1em' }}>→ Open</p>
              </div>
            </Link>
          ))}
        </div>

      </main>
      <Footer />
    </div>
  );
}