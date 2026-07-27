'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

export default function AdminUsers() {
  const { user, isAdmin, loading } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) router.push('/');
  }, [user, isAdmin, loading, router]);

  useEffect(() => {
    if (!loading) fetchUsers();
  }, [loading]);

  async function fetchUsers() {
    const snap = await getDocs(collection(db, 'users'));
    const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setUsers(data);
    setLoadingUsers(false);
  }

  if (loading || loadingUsers) return null;
  if (!isAdmin) return null;

  return (
    <div style={{ background: '#060606', minHeight: '100vh' }}>
      <Navbar />
      <main style={{ padding: 'clamp(40px, 5vw, 80px) clamp(20px, 5vw, 48px)', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <Link href="/admin" style={{ fontSize: '11px', letterSpacing: '0.2em', color: '#666666', textDecoration: 'none', textTransform: 'uppercase' }}>← Back to Dashboard</Link>
            <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(2rem, 6vw, 4rem)', color: '#EEEBE3', letterSpacing: '0.05em', marginTop: '8px' }}>
              MANAGE <span style={{ color: '#7FD4F0' }}>USERS</span>
            </h1>
            <p style={{ fontSize: '13px', color: '#666666', marginTop: '8px', letterSpacing: '0.08em' }}>
              View registered customers and premium/member accounts.
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: '11px', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#7FD4F0', marginBottom: '8px' }}>Total Users</p>
            <p style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '2rem', color: '#7FD4F0', margin: 0 }}>{users.length}</p>
          </div>
        </div>

        <div className="table-responsive" style={{ overflowX: 'auto', background: '#111111', border: '1px solid #222222', borderRadius: '16px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '760px' }}>
            <thead>
              <tr>
                {['Name', 'Email', 'Role', 'Joined', 'Status'].map((title) => (
                  <th key={title} style={{ textAlign: 'left', padding: '18px 20px', fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#999999', borderBottom: '1px solid #222222' }}>{title}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((userItem) => (
                <tr key={userItem.id} style={{ borderBottom: '1px solid #222222' }}>
                  <td style={{ padding: '16px 20px', color: '#EEEBE3' }}>{userItem.displayName || 'Unknown'}</td>
                  <td style={{ padding: '16px 20px', color: '#EEEBE3' }}>{userItem.email || '–'}</td>
                  <td style={{ padding: '16px 20px', color: userItem.role === 'admin' ? '#44cc44' : userItem.role === 'premium' ? '#F0BE00' : '#999999' }}>{userItem.role || 'user'}</td>
                  <td style={{ padding: '16px 20px', color: '#999999' }}>{userItem.createdAt ? new Date(userItem.createdAt).toLocaleDateString() : '–'}</td>
                  <td style={{ padding: '16px 20px', color: '#EEEBE3' }}>{userItem.phoneNumber || 'Active'}</td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ padding: '24px 20px', color: '#999999', textAlign: 'center' }}>
                    No users found yet.
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
