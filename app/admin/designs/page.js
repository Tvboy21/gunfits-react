'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../lib/firebase';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';

export default function AdminDesigns() {
  const { user, isAdmin, loading } = useAuth();
  const router = useRouter();
  const [designs, setDesigns] = useState([]);
  const [loadingDesigns, setLoadingDesigns] = useState(true);

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) router.push('/');
  }, [user, isAdmin, loading, router]);

  useEffect(() => {
    if (!loading) fetchDesigns();
  }, [loading]);

  async function fetchDesigns() {
    const snap = await getDocs(collection(db, 'designs'));
    const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    data.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    setDesigns(data);
    setLoadingDesigns(false);
  }

  async function updateStatus(id, status) {
    await updateDoc(doc(db, 'designs', id), { status });
    await fetchDesigns();
  }

  if (loading || loadingDesigns) return null;
  if (!isAdmin) return null;

  return (
    <div style={{ background: '#060606', minHeight: '100vh' }}>
      <Navbar />
      <main style={{ padding: 'clamp(40px, 5vw, 80px) clamp(20px, 5vw, 48px)', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <Link href="/admin" style={{ fontSize: '11px', letterSpacing: '0.2em', color: '#666666', textDecoration: 'none', textTransform: 'uppercase' }}>← Back to Dashboard</Link>
            <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(2rem, 6vw, 4rem)', color: '#EEEBE3', letterSpacing: '0.05em', marginTop: '8px' }}>
              DESIGN <span style={{ color: '#F0BE00' }}>REQUESTS</span>
            </h1>
            <p style={{ fontSize: '13px', color: '#666666', marginTop: '8px', letterSpacing: '0.08em' }}>
              Review premium custom design orders and approve or reject requests.
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: '11px', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#F0BE00', marginBottom: '8px' }}>Total Requests</p>
            <p style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '2rem', color: '#F0BE00', margin: 0 }}>{designs.length}</p>
          </div>
        </div>

        <div style={{ display: 'grid', gap: '18px' }}>
          {designs.length > 0 ? designs.map((design) => (
            <div key={design.id} style={{ background: '#111111', border: '1px solid #222222', borderRadius: '20px', padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
                <div>
                  <p style={{ fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#999999', marginBottom: '8px' }}>Request</p>
                  <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.9rem', color: '#EEEBE3', margin: 0 }}>{design.clothingType || 'Custom Design'}</h2>
                  <p style={{ marginTop: '12px', color: '#999999', fontSize: '13px', lineHeight: 1.8 }}>{design.notes || 'No special notes provided.'}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#999999', marginBottom: '8px' }}>Status</p>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 14px', borderRadius: '999px', background: design.status === 'approved' ? 'rgba(68,204,68,0.15)' : design.status === 'rejected' ? 'rgba(255,68,68,0.12)' : 'rgba(240,190,0,0.12)', color: design.status === 'approved' ? '#44cc44' : design.status === 'rejected' ? '#ff4444' : '#F0BE00', fontWeight: 700, fontSize: '12px' }}>{design.status || 'pending'}</span>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginTop: '22px' }}>
                <div style={{ color: '#999999', fontSize: '12px' }}><strong>Requested by:</strong> {design.userName || design.userEmail || 'Unknown'}</div>
                <div style={{ color: '#999999', fontSize: '12px' }}><strong>Budget:</strong> {design.budget ? `KES ${design.budget}` : 'N/A'}</div>
                <div style={{ color: '#999999', fontSize: '12px' }}><strong>Created:</strong> {design.createdAt ? new Date(design.createdAt).toLocaleDateString() : '–'}</div>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '20px' }}>
                <button onClick={() => updateStatus(design.id, 'approved')} style={{ background: '#44cc44', border: 'none', color: '#060606', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer' }}>Approve</button>
                <button onClick={() => updateStatus(design.id, 'rejected')} style={{ background: '#ff4444', border: 'none', color: '#FFFFFF', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer' }}>Reject</button>
              </div>
            </div>
          )) : (
            <div style={{ padding: '32px', border: '1px solid #222222', borderRadius: '16px', textAlign: 'center', color: '#999999' }}>
              No design requests found.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
