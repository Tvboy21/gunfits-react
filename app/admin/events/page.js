'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../../components/Navbar';
import { useAuth } from '../../context/AuthContext';
import { getFirestore, collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { initializeApp, getApps } from 'firebase/app';
import { CldUploadWidget, CldImage } from 'next-cloudinary';

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

const emptyEvent = {
  title: '',
  description: '',
  date: '',
  time: '',
  location: '',
  ticketPrice: '',
  totalTickets: '',
  imagePublicId: '',
  videoPublicId: '',
  type: 'Fashion Show',
};

const eventTypes = ['Fashion Show', 'Pop Up Store', 'Sale Event', 'Collab Drop', 'Community Event'];

// ─── SVG Noise Filter for Film Grain ───
const NoiseFilter = () => (
  <svg style={{ position: 'absolute', width: 0, height: 0 }}>
    <filter id="noise">
      <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch" />
      <feColorMatrix type="saturate" values="0" />
      <feComponentTransfer>
        <feFuncA type="linear" slope="0.03" />
      </feComponentTransfer>
    </filter>
  </svg>
);

// ─── Stat Card Component ───
const StatCard = ({ label, value, subtext, delay, icon }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    style={{
      background: 'linear-gradient(135deg, rgba(201,78,10,0.08), rgba(240,190,0,0.03))',
      border: '1px solid rgba(201,78,10,0.15)',
      borderRadius: '6px',
      padding: '24px 28px',
      position: 'relative',
      overflow: 'hidden',
    }}
  >
    <div style={{ position: 'absolute', top: '-10px', right: '-10px', fontSize: '64px', opacity: 0.04, color: '#C94E0A', fontFamily: 'Bebas Neue, sans-serif', lineHeight: 1 }}>
      {icon}
    </div>
    <p style={{ fontSize: '10px', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#C94E0A', marginBottom: '12px', fontWeight: 700, fontFamily: 'Barlow Condensed, sans-serif' }}>
      {label}
    </p>
    <p style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(1.8rem, 4vw, 2.4rem)', color: '#EEEBE3', letterSpacing: '0.02em', lineHeight: 1, margin: 0 }}>
      {value}
    </p>
    {subtext && (
      <p style={{ fontSize: '11px', color: '#666666', marginTop: '8px', fontFamily: 'Barlow Condensed, sans-serif' }}>
        {subtext}
      </p>
    )}
    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, #C94E0A, #F0BE00, transparent)', opacity: 0.6 }} />
  </motion.div>
);

// ─── Progress Bar Component ───
const TicketProgress = ({ sold, total }) => {
  const pct = total > 0 ? Math.round((sold / total) * 100) : 0;
  const isLow = pct >= 80;
  const isSoldOut = pct >= 100;

  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
        <span style={{ fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: isSoldOut ? '#ff4444' : isLow ? '#F0BE00' : '#888888', fontWeight: 700, fontFamily: 'Barlow Condensed, sans-serif' }}>
          {isSoldOut ? 'SOLD OUT' : isLow ? 'ALMOST GONE' : `${pct}% SOLD`}
        </span>
        <span style={{ fontSize: '10px', color: '#666666', fontFamily: 'Barlow Condensed, sans-serif' }}>
          {sold.toLocaleString()}/{total.toLocaleString()}
        </span>
      </div>
      <div style={{ width: '100%', height: '3px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
          style={{
            height: '100%',
            background: isSoldOut ? '#ff4444' : isLow ? 'linear-gradient(90deg, #F0BE00, #ff4444)' : 'linear-gradient(90deg, #C94E0A, #F0BE00)',
            borderRadius: '2px',
            boxShadow: isLow ? '0 0 10px rgba(240,190,0,0.4)' : 'none',
          }}
        />
      </div>
    </div>
  );
};

// ─── Delete Confirmation Inline ───
const DeleteConfirm = ({ onConfirm, onCancel, eventTitle }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.95 }}
    style={{
      position: 'absolute',
      inset: 0,
      background: 'rgba(6,6,6,0.95)',
      backdropFilter: 'blur(20px)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '20px',
      zIndex: 10,
      borderRadius: '8px',
      padding: '24px',
    }}
  >
    <p style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.2rem', color: '#EEEBE3', letterSpacing: '0.05em', textAlign: 'center', margin: 0 }}>
      DELETE "{eventTitle}"?
    </p>
    <p style={{ fontSize: '11px', color: '#666666', textAlign: 'center', margin: 0 }}>
      This action cannot be undone. All ticket data will be lost.
    </p>
    <div style={{ display: 'flex', gap: '12px' }}>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onConfirm}
        style={{
          background: 'linear-gradient(135deg, #ff4444, #cc0000)',
          color: '#fff',
          border: 'none',
          padding: '10px 24px',
          fontFamily: 'Bebas Neue, sans-serif',
          fontSize: '12px',
          letterSpacing: '0.15em',
          cursor: 'pointer',
          borderRadius: '2px',
          fontWeight: 900,
        }}
      >
        YES, DELETE
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onCancel}
        style={{
          background: 'transparent',
          color: '#888888',
          border: '1px solid rgba(255,255,255,0.1)',
          padding: '10px 24px',
          fontFamily: 'Bebas Neue, sans-serif',
          fontSize: '12px',
          letterSpacing: '0.15em',
          cursor: 'pointer',
          borderRadius: '2px',
          fontWeight: 900,
        }}
      >
        CANCEL
      </motion.button>
    </div>
  </motion.div>
);

export default function AdminEvents() {
  const { user, isAdmin, loading } = useAuth();
  const router = useRouter();
  const [events, setEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyEvent);
  const [saving, setSaving] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) router.push('/');
  }, [user, isAdmin, loading, router]);

  useEffect(() => { fetchEvents(); }, []);

  async function fetchEvents() {
    const snap = await getDocs(collection(db, 'events'));
    setEvents(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  }

  async function handleSave() {
    if (!form.title) { setUploadStatus('Please enter an event title'); return; }
    if (!form.date) { setUploadStatus('Please enter an event date'); return; }
    setSaving(true);
    const data = {
      ...form,
      ticketPrice: Number(form.ticketPrice),
      totalTickets: Number(form.totalTickets),
      soldTickets: editingId ? form.soldTickets || 0 : 0,
      createdAt: editingId ? form.createdAt : new Date().toISOString()
    };
    try {
      if (editingId) {
        await updateDoc(doc(db, 'events', editingId), data);
        setUploadStatus('✓ Event updated successfully');
      } else {
        await addDoc(collection(db, 'events'), data);
        setUploadStatus('✓ Event created successfully');
      }
      await fetchEvents();
      setForm(emptyEvent);
      setEditingId(null);
      setShowForm(false);
      setTimeout(() => setUploadStatus(''), 2000);
    } catch (error) {
      setUploadStatus('Error saving event: ' + error.message);
    }
    setSaving(false);
  }

  async function handleDelete(id) {
    await deleteDoc(doc(db, 'events', id));
    setDeleteConfirmId(null);
    await fetchEvents();
    setUploadStatus('✓ Event deleted');
    setTimeout(() => setUploadStatus(''), 2000);
  }

  function handleEdit(event) {
    setForm({ ...event });
    setEditingId(event.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ─── Drag & Drop Handlers ───
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    // In real implementation, you'd handle file upload here
  }, []);

  // ─── Stats Calculation ───
  const totalEvents = events.length;
  const totalSold = events.reduce((acc, e) => acc + (e.soldTickets || 0), 0);
  const totalCapacity = events.reduce((acc, e) => acc + (e.totalTickets || 0), 0);
  const totalRevenue = events.reduce((acc, e) => acc + ((e.soldTickets || 0) * (e.ticketPrice || 0)), 0);
  const upcomingEvents = events.filter(e => new Date(e.date) > new Date()).length;

  if (loading) return null;
  if (!isAdmin) return null;

  return (
    <div style={{ background: '#060606', minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      <NoiseFilter />

      {/* Film Grain Overlay */}
      <div style={{ position: 'fixed', inset: 0, filter: 'url(#noise)', pointerEvents: 'none', zIndex: 9999, mixBlendMode: 'overlay' }} />

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

      {/* Cinematic glow */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at top center, rgba(120,20,0,0.1), transparent 60%)', pointerEvents: 'none', zIndex: 0 }} />

      {/* Large Background Watermark */}
      <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '50vw', fontFamily: 'Bebas Neue, sans-serif', color: 'rgba(201,78,10,0.015)', pointerEvents: 'none', zIndex: 0, letterSpacing: '0.05em', userSelect: 'none' }}>
        E
      </div>

      <Navbar />

      <main style={{ padding: 'clamp(40px, 5vw, 80px) clamp(20px, 5vw, 48px)', maxWidth: '1400px', margin: '0 auto', position: 'relative', zIndex: 2 }}>

        {/* HEADER */}
        <motion.div 
          style={{ marginBottom: 'clamp(40px, 8vw, 60px)' }}
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '24px', flexWrap: 'wrap' }}>
            <div>
              <motion.p 
                style={{ fontSize: '11px', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#C94E0A', marginBottom: '12px', fontWeight: 900, fontFamily: 'Barlow Condensed, sans-serif' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                // ADMIN DASHBOARD
              </motion.p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '16px', flexWrap: 'wrap' }}>
                <motion.h1 
                  style={{ 
                    fontFamily: 'Bebas Neue, sans-serif', 
                    fontSize: 'clamp(2.5rem, 10vw, 5rem)', 
                    color: '#EEEBE3', 
                    letterSpacing: '0.05em', 
                    lineHeight: 1, 
                    fontWeight: 900, 
                    margin: 0,
                    background: 'linear-gradient(135deg, #EEEBE3 0%, #C94E0A 50%, #F0BE00 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                  initial={{ opacity: 0, x: -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.7 }}
                >
                  MANAGE
                </motion.h1>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}>
                  <h1
                    style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(2.5rem, 10vw, 5rem)', color: '#F0BE00', letterSpacing: '0.05em', lineHeight: 1, fontWeight: 900, margin: 0 }}
                  >
                    EVENTS
                  </h1>
                </motion.div>
              </div>
              <motion.div 
                style={{ height: '3px', width: '200px', background: 'linear-gradient(90deg, #C94E0A, #F0BE00, transparent)', marginTop: '20px' }} 
                initial={{ scaleX: 0, originX: 0 }} 
                animate={{ scaleX: 1 }} 
                transition={{ delay: 0.6, duration: 0.8 }} 
              />
            </div>
            <motion.button 
              onClick={() => { setShowForm(true); setEditingId(null); setForm(emptyEvent); setUploadStatus(''); }}
              whileHover={{ scale: 1.05, boxShadow: '0 0 50px rgba(201,78,10,0.4)' }}
              whileTap={{ scale: 0.95 }}
              style={{ 
                background: 'linear-gradient(135deg, #C94E0A, #F0BE00)', 
                color: '#060606', 
                border: 'none', 
                fontFamily: 'Bebas Neue, sans-serif', 
                fontSize: 'clamp(11px, 2vw, 13px)', 
                letterSpacing: '0.15em', 
                padding: 'clamp(14px, 2.5vw, 18px) clamp(28px, 5vw, 40px)', 
                cursor: 'pointer', 
                fontWeight: 900, 
                textTransform: 'uppercase', 
                borderRadius: '2px', 
                boxShadow: '0 10px 40px rgba(201,78,10,0.3)',
                position: 'relative',
                overflow: 'hidden',
              }}>
              + NEW EVENT
            </motion.button>
          </motion.div>
        </motion.div>

        {/* STATS DASHBOARD */}
        <motion.div
          style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '16px', 
            marginBottom: '48px' 
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <StatCard label="Total Events" value={totalEvents} subtext="Across all categories" delay={0.4} icon="E" />
          <StatCard label="Tickets Sold" value={totalSold.toLocaleString()} subtext={`${totalCapacity > 0 ? Math.round((totalSold/totalCapacity)*100) : 0}% of total capacity`} delay={0.5} icon="T" />
          <StatCard label="Revenue" value={`KES ${(totalRevenue / 1000).toFixed(1)}K`} subtext="Total gross revenue" delay={0.6} icon="K" />
          <StatCard label="Upcoming" value={upcomingEvents} subtext="Events in the future" delay={0.7} icon="U" />
        </motion.div>

        {/* STATUS MESSAGE */}
        <AnimatePresence>
          {uploadStatus && (
            <motion.div 
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              style={{ 
                padding: '16px 24px', 
                marginBottom: '24px', 
                background: uploadStatus.includes('✓') ? 'rgba(68,204,68,0.1)' : 'rgba(255,68,68,0.1)', 
                border: `1.5px solid ${uploadStatus.includes('✓') ? 'rgba(68,204,68,0.3)' : 'rgba(255,68,68,0.3)'}`, 
                color: uploadStatus.includes('✓') ? '#44cc44' : '#ff4444', 
                fontSize: '12px', 
                letterSpacing: '0.1em', 
                borderRadius: '4px', 
                fontWeight: 600,
                fontFamily: 'Barlow Condensed, sans-serif',
                backdropFilter: 'blur(10px)',
              }}>
              {uploadStatus}
            </motion.div>
          )}
        </AnimatePresence>

        {/* FORM SECTION */}
        <AnimatePresence>
          {showForm && (
            <motion.div 
              initial={{ opacity: 0, y: -30, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -30, height: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              style={{ 
                background: 'linear-gradient(135deg, rgba(201,78,10,0.06), rgba(240,190,0,0.02))', 
                border: '2px solid rgba(201,78,10,0.25)', 
                borderTop: '3px solid #C94E0A', 
                padding: 'clamp(32px, 6vw, 48px)', 
                marginBottom: '60px', 
                borderRadius: '6px', 
                backdropFilter: 'blur(20px)',
                overflow: 'hidden',
              }}>

              <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(1.5rem, 4vw, 2rem)', color: '#EEEBE3', letterSpacing: '0.1em', marginBottom: '32px', marginTop: 0 }}>
                {editingId ? '✎ EDIT EVENT' : '+ CREATE NEW EVENT'}
              </h2>

              {/* Form Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(clamp(200px, 45vw, 320px), 1fr))', gap: '20px', marginBottom: '24px' }}>
                {[
                  { label: 'Event Title', key: 'title', placeholder: 'e.g. GUNFITS SS26 Show' },
                  { label: 'Location', key: 'location', placeholder: 'e.g. Nairobi CBD' },
                  { label: 'Date', key: 'date', type: 'date' },
                  { label: 'Time', key: 'time', type: 'time' },
                  { label: 'Ticket Price (KES)', key: 'ticketPrice', type: 'number', placeholder: '500' },
                  { label: 'Total Tickets', key: 'totalTickets', type: 'number', placeholder: '200' },
                ].map((field, i) => (
                  <motion.div key={field.key} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                    <label style={{ fontSize: '10px', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#C94E0A', display: 'block', marginBottom: '8px', fontWeight: 700, fontFamily: 'Barlow Condensed, sans-serif' }}>{field.label}</label>
                    <input
                      type={field.type || 'text'}
                      value={form[field.key]}
                      onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                      placeholder={field.placeholder}
                      style={{ 
                        width: '100%', 
                        background: 'rgba(0,0,0,0.5)', 
                        border: '1.5px solid rgba(201,78,10,0.2)', 
                        color: '#EEEBE3', 
                        padding: '14px 18px', 
                        fontSize: '14px', 
                        outline: 'none', 
                        borderRadius: '4px', 
                        transition: 'all 0.3s', 
                        fontFamily: 'Barlow Condensed, sans-serif',
                      }}
                      onFocus={e => { e.currentTarget.style.borderColor = '#C94E0A'; e.currentTarget.style.boxShadow = '0 0 25px rgba(201,78,10,0.15)'; }}
                      onBlur={e => { e.currentTarget.style.borderColor = 'rgba(201,78,10,0.2)'; e.currentTarget.style.boxShadow = 'none'; }}
                    />
                  </motion.div>
                ))}
              </div>

              {/* Event Type */}
              <motion.div style={{ marginBottom: '24px' }} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <label style={{ fontSize: '10px', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#C94E0A', display: 'block', marginBottom: '8px', fontWeight: 700, fontFamily: 'Barlow Condensed, sans-serif' }}>Event Type</label>
                <select 
                  value={form.type} 
                  onChange={e => setForm({ ...form, type: e.target.value })} 
                  style={{ 
                    width: '100%', 
                    background: 'rgba(0,0,0,0.5)', 
                    border: '1.5px solid rgba(201,78,10,0.2)', 
                    color: '#EEEBE3', 
                    padding: '14px 18px', 
                    fontSize: '14px', 
                    outline: 'none', 
                    borderRadius: '4px', 
                    cursor: 'pointer', 
                    fontFamily: 'Barlow Condensed, sans-serif', 
                    transition: 'all 0.3s',
                    appearance: 'none',
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23C94E0A' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 18px center',
                  }} 
                  onFocus={e => { e.currentTarget.style.borderColor = '#C94E0A'; e.currentTarget.style.boxShadow = '0 0 25px rgba(201,78,10,0.15)'; }} 
                  onBlur={e => { e.currentTarget.style.borderColor = 'rgba(201,78,10,0.2)'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  {eventTypes.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </motion.div>

              {/* Description */}
              <motion.div style={{ marginBottom: '24px' }} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
                <label style={{ fontSize: '10px', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#C94E0A', display: 'block', marginBottom: '8px', fontWeight: 700, fontFamily: 'Barlow Condensed, sans-serif' }}>Description</label>
                <textarea 
                  value={form.description} 
                  onChange={e => setForm({ ...form, description: e.target.value })} 
                  rows={4} 
                  style={{ 
                    width: '100%', 
                    background: 'rgba(0,0,0,0.5)', 
                    border: '1.5px solid rgba(201,78,10,0.2)', 
                    color: '#EEEBE3', 
                    padding: '14px 18px', 
                    fontSize: '14px', 
                    outline: 'none', 
                    borderRadius: '4px', 
                    resize: 'vertical', 
                    fontFamily: 'Barlow Condensed, sans-serif', 
                    transition: 'all 0.3s',
                    lineHeight: 1.6,
                  }} 
                  placeholder="Describe the event..." 
                  onFocus={e => { e.currentTarget.style.borderColor = '#C94E0A'; e.currentTarget.style.boxShadow = '0 0 25px rgba(201,78,10,0.15)'; }} 
                  onBlur={e => { e.currentTarget.style.borderColor = 'rgba(201,78,10,0.2)'; e.currentTarget.style.boxShadow = 'none'; }} 
                />
              </motion.div>

              {/* Image & Video Upload with Drag Drop */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '32px' }}>
                {/* Image Upload with Drag Zone */}
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: 0.4 }}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <label style={{ fontSize: '10px', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#C94E0A', display: 'block', marginBottom: '12px', fontWeight: 700, fontFamily: 'Barlow Condensed, sans-serif' }}>
                    Event Image
                  </label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <CldUploadWidget uploadPreset="gunfits_events" onSuccess={(result) => { setForm({ ...form, imagePublicId: result.info.public_id }); setUploadStatus('✓ Image uploaded'); setTimeout(() => setUploadStatus(''), 1500); }}>
                      {({ open }) => (
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => open()}
                          style={{
                            background: isDragging ? 'rgba(201,78,10,0.15)' : 'rgba(0,0,0,0.4)',
                            border: isDragging ? '2px dashed #C94E0A' : '2px dashed rgba(201,78,10,0.3)',
                            color: '#EEEBE3',
                            padding: 'clamp(24px, 5vw, 40px)',
                            cursor: 'pointer',
                            fontSize: '12px',
                            letterSpacing: '0.1em',
                            textTransform: 'uppercase',
                            fontFamily: 'Bebas Neue, sans-serif',
                            fontWeight: 700,
                            borderRadius: '6px',
                            transition: 'all 0.3s',
                            textAlign: 'center',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '8px',
                          }}
                        >
                          <span style={{ fontSize: '24px' }}>{form.imagePublicId ? '✓' : '📤'}</span>
                          <span>{form.imagePublicId ? 'Change Image' : 'Drop image here or click to upload'}</span>
                          <span style={{ fontSize: '10px', color: '#666666', textTransform: 'none', fontFamily: 'Barlow Condensed, sans-serif', letterSpacing: '0.05em' }}>
                            Recommended: 1200×800, JPG or PNG
                          </span>
                        </motion.div>
                      )}
                    </CldUploadWidget>
                    {form.imagePublicId && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }} 
                        animate={{ opacity: 1, scale: 1 }} 
                        style={{ width: '100%', height: '180px', border: '1.5px solid rgba(201,78,10,0.3)', borderRadius: '6px', overflow: 'hidden', position: 'relative' }}
                      >
                        <CldImage src={form.imagePublicId} width={400} height={180} alt="Event" style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
                        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '8px 12px', background: 'linear-gradient(transparent, rgba(0,0,0,0.8))', fontSize: '10px', color: '#C94E0A', fontFamily: 'Barlow Condensed, sans-serif', letterSpacing: '0.1em' }}>
                          PREVIEW
                        </div>
                      </motion.div>
                    )}
                  </div>
                </motion.div>

                {/* Video Upload */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
                  <label style={{ fontSize: '10px', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#C94E0A', display: 'block', marginBottom: '12px', fontWeight: 700, fontFamily: 'Barlow Condensed, sans-serif' }}>
                    Event Video (Optional)
                  </label>
                  <CldUploadWidget uploadPreset="gunfits_events" onSuccess={(result) => { setForm({ ...form, videoPublicId: result.info.public_id }); setUploadStatus('✓ Video uploaded'); setTimeout(() => setUploadStatus(''), 1500); }}>
                    {({ open }) => (
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => open()}
                        style={{
                          background: 'rgba(0,0,0,0.4)',
                          border: '2px dashed rgba(201,78,10,0.3)',
                          color: '#EEEBE3',
                          padding: 'clamp(24px, 5vw, 40px)',
                          cursor: 'pointer',
                          fontSize: '12px',
                          letterSpacing: '0.1em',
                          textTransform: 'uppercase',
                          fontFamily: 'Bebas Neue, sans-serif',
                          fontWeight: 700,
                          borderRadius: '6px',
                          transition: 'all 0.3s',
                          textAlign: 'center',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '8px',
                          width: '100%',
                        }}
                      >
                        <span style={{ fontSize: '24px' }}>{form.videoPublicId ? '✓' : '🎬'}</span>
                        <span>{form.videoPublicId ? 'Change Video' : 'Drop video or click to upload'}</span>
                        <span style={{ fontSize: '10px', color: '#666666', textTransform: 'none', fontFamily: 'Barlow Condensed, sans-serif', letterSpacing: '0.05em' }}>
                          MP4, MOV up to 100MB
                        </span>
                      </motion.div>
                    )}
                  </CldUploadWidget>
                </motion.div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <motion.button 
                  type="button" 
                  onClick={handleSave} 
                  disabled={saving}
                  whileHover={!saving ? { scale: 1.03 } : {}}
                  whileTap={!saving ? { scale: 0.97 } : {}}
                  style={{ 
                    background: saving ? 'rgba(51,51,51,0.5)' : 'linear-gradient(135deg, #C94E0A, #F0BE00)', 
                    color: saving ? '#666666' : '#060606', 
                    border: 'none', 
                    fontFamily: 'Bebas Neue, sans-serif', 
                    fontSize: '13px', 
                    letterSpacing: '0.15em', 
                    padding: '16px 36px', 
                    cursor: saving ? 'not-allowed' : 'pointer', 
                    fontWeight: 900, 
                    textTransform: 'uppercase', 
                    borderRadius: '2px', 
                    boxShadow: !saving ? '0 10px 40px rgba(201,78,10,0.3)' : 'none', 
                    transition: 'all 0.3s',
                    position: 'relative',
                    overflow: 'hidden',
                  }}>
                  {saving ? 'SAVING...' : editingId ? '✓ UPDATE EVENT' : '+ CREATE EVENT'}
                </motion.button>
                <motion.button 
                  type="button" 
                  onClick={() => { setShowForm(false); setForm(emptyEvent); setEditingId(null); setUploadStatus(''); }} 
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  style={{ 
                    background: 'transparent', 
                    color: '#888888', 
                    border: '1.5px solid rgba(201,78,10,0.2)', 
                    fontFamily: 'Bebas Neue, sans-serif', 
                    fontSize: '13px', 
                    letterSpacing: '0.15em', 
                    padding: '16px 36px', 
                    cursor: 'pointer', 
                    fontWeight: 900, 
                    textTransform: 'uppercase', 
                    borderRadius: '2px', 
                    transition: 'all 0.3s',
                  }}>
                  CANCEL
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* EVENTS GRID — BENTO STYLE */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          {events.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              style={{ textAlign: 'center', padding: 'clamp(80px, 20vw, 140px) 0', position: 'relative' }}
            >
              <motion.div
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(3rem, 12vw, 8rem)', color: 'rgba(201,78,10,0.08)', letterSpacing: '0.05em', lineHeight: 1, marginBottom: '24px', userSelect: 'none' }}
              >
                EMPTY RUNWAY
              </motion.div>
              <p style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(1.2rem, 3vw, 1.8rem)', color: '#333333', letterSpacing: '0.1em', marginBottom: '16px' }}>
                THE RUNWAY IS EMPTY
              </p>
              <p style={{ fontSize: '13px', color: '#555555', margin: '0 0 32px 0', maxWidth: '400px', marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.6, fontFamily: 'Barlow Condensed, sans-serif' }}>
                Create your first event and start building the GUNFITS community. Fashion shows, pop-ups, collab drops — bring them to life.
              </p>
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(201,78,10,0.3)' }}
                whileTap={{ scale: 0.95 }}
                onClick={() => { setShowForm(true); setEditingId(null); setForm(emptyEvent); }}
                style={{
                  background: 'linear-gradient(135deg, #C94E0A, #F0BE00)',
                  color: '#060606',
                  border: 'none',
                  fontFamily: 'Bebas Neue, sans-serif',
                  fontSize: '13px',
                  letterSpacing: '0.15em',
                  padding: '16px 36px',
                  cursor: 'pointer',
                  fontWeight: 900,
                  textTransform: 'uppercase',
                  borderRadius: '2px',
                  boxShadow: '0 10px 40px rgba(201,78,10,0.2)',
                }}
              >
                + CREATE FIRST EVENT
              </motion.button>
            </motion.div>
          ) : (
            <motion.div 
              style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 380px), 1fr))', 
                gap: '24px',
              }}
              variants={{ 
                hidden: { opacity: 0 }, 
                visible: { 
                  opacity: 1, 
                  transition: { staggerChildren: 0.12, delayChildren: 0.1 } 
                } 
              }}
              initial="hidden"
              animate="visible"
            >
              {events.map((event, index) => {
                const soldPct = event.totalTickets > 0 ? ((event.soldTickets || 0) / event.totalTickets) * 100 : 0;
                const isSoldOut = soldPct >= 100;

                return (
                  <motion.div 
                    key={event.id}
                    variants={{
                      hidden: { opacity: 0, y: 40, scale: 0.95 },
                      visible: { 
                        opacity: 1, 
                        y: 0, 
                        scale: 1,
                        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
                      }
                    }}
                    layout
                    style={{ 
                      background: 'linear-gradient(135deg, rgba(201,78,10,0.06), rgba(240,190,0,0.02))', 
                      border: '1.5px solid rgba(201,78,10,0.15)', 
                      borderRadius: '8px', 
                      overflow: 'hidden',
                      position: 'relative',
                      transition: 'all 0.4s',
                    }}
                    whileHover={{ 
                      borderColor: 'rgba(201,78,10,0.4)', 
                      boxShadow: '0 20px 60px rgba(201,78,10,0.2)',
                      y: -4,
                    }}
                  >
                    {/* Delete Confirmation Overlay */}
                    <AnimatePresence>
                      {deleteConfirmId === event.id && (
                        <DeleteConfirm 
                          eventTitle={event.title}
                          onConfirm={() => handleDelete(event.id)}
                          onCancel={() => setDeleteConfirmId(null)}
                        />
                      )}
                    </AnimatePresence>

                    {/* Image Section */}
                    <div style={{ position: 'relative', width: '100%', aspectRatio: '16/10', overflow: 'hidden', background: 'rgba(0,0,0,0.3)' }}>
                      {event.imagePublicId ? (
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.6 }}
                          style={{ width: '100%', height: '100%' }}
                        >
                          <CldImage 
                            src={event.imagePublicId} 
                            width={600} 
                            height={375} 
                            alt={event.title} 
                            style={{ objectFit: 'cover', width: '100%', height: '100%' }} 
                          />
                        </motion.div>
                      ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(201,78,10,0.2)', fontFamily: 'Bebas Neue, sans-serif', fontSize: '3rem', letterSpacing: '0.1em' }}>
                          NO IMAGE
                        </div>
                      )}

                      {/* Type Badge */}
                      <div style={{ position: 'absolute', top: '16px', left: '16px', zIndex: 2 }}>
                        <motion.span 
                          whileHover={{ scale: 1.05 }}
                          style={{ 
                            background: 'linear-gradient(135deg, #C94E0A, #F0BE00)', 
                            color: '#060606', 
                            fontSize: '9px', 
                            letterSpacing: '0.15em', 
                            padding: '6px 14px', 
                            fontFamily: 'Bebas Neue, sans-serif', 
                            fontWeight: 900, 
                            borderRadius: '2px', 
                            whiteSpace: 'nowrap',
                            boxShadow: '0 4px 20px rgba(201,78,10,0.3)',
                          }}
                        >
                          {event.type}
                        </motion.span>
                      </div>

                      {/* Sold Out Badge */}
                      <AnimatePresence>
                        {isSoldOut && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            style={{ position: 'absolute', top: '16px', right: '16px', zIndex: 2 }}
                          >
                            <span style={{ 
                              background: 'rgba(255,68,68,0.9)', 
                              color: '#fff', 
                              fontSize: '9px', 
                              letterSpacing: '0.2em', 
                              padding: '6px 14px', 
                              fontFamily: 'Bebas Neue, sans-serif', 
                              fontWeight: 900, 
                              borderRadius: '2px',
                              boxShadow: '0 0 20px rgba(255,68,68,0.4)',
                            }}>
                              SOLD OUT
                            </span>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Gradient Overlay */}
                      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '50%', background: 'linear-gradient(transparent, rgba(6,6,6,0.9))', pointerEvents: 'none' }} />
                    </div>

                    {/* Content Section */}
                    <div style={{ padding: '24px' }}>
                      <h3 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)', color: '#EEEBE3', letterSpacing: '0.05em', margin: '0 0 12px 0', lineHeight: 1.2 }}>
                        {event.title}
                      </h3>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
                        <p style={{ fontSize: '12px', color: '#C94E0A', letterSpacing: '0.05em', margin: 0, fontWeight: 600, fontFamily: 'Barlow Condensed, sans-serif', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span>📅</span> {event.date} at {event.time}
                        </p>
                        <p style={{ fontSize: '12px', color: '#888888', margin: 0, fontFamily: 'Barlow Condensed, sans-serif', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span>📍</span> {event.location}
                        </p>
                        <p style={{ fontSize: '14px', color: '#F0BE00', margin: 0, fontWeight: 700, fontFamily: 'Bebas Neue, sans-serif', letterSpacing: '0.05em' }}>
                          KES {event.ticketPrice?.toLocaleString()}
                        </p>
                      </div>

                      {/* Ticket Progress */}
                      <div style={{ marginBottom: '20px' }}>
                        <TicketProgress sold={event.soldTickets || 0} total={event.totalTickets || 0} />
                      </div>

                      {/* Action Buttons */}
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <motion.button 
                          onClick={() => handleEdit(event)} 
                          whileHover={{ scale: 1.05, backgroundColor: 'rgba(201,78,10,0.15)' }}
                          whileTap={{ scale: 0.95 }}
                          style={{ 
                            flex: 1,
                            background: 'transparent', 
                            border: '1.5px solid rgba(201,78,10,0.3)', 
                            color: '#C94E0A', 
                            cursor: 'pointer', 
                            fontSize: '11px', 
                            letterSpacing: '0.15em', 
                            padding: '12px', 
                            fontFamily: 'Bebas Neue, sans-serif', 
                            fontWeight: 900, 
                            transition: 'all 0.3s', 
                            textTransform: 'uppercase', 
                            borderRadius: '2px',
                          }}>
                          EDIT
                        </motion.button>
                        <motion.button 
                          onClick={() => setDeleteConfirmId(event.id)} 
                          whileHover={{ scale: 1.05, borderColor: 'rgba(255,68,68,0.5)', color: '#ff4444' }}
                          whileTap={{ scale: 0.95 }}
                          style={{ 
                            flex: 1,
                            background: 'transparent', 
                            border: '1.5px solid rgba(255,68,68,0.2)', 
                            color: '#ff6666', 
                            cursor: 'pointer', 
                            fontSize: '11px', 
                            letterSpacing: '0.15em', 
                            padding: '12px', 
                            fontFamily: 'Bebas Neue, sans-serif', 
                            fontWeight: 900, 
                            transition: 'all 0.3s', 
                            textTransform: 'uppercase', 
                            borderRadius: '2px',
                          }}>
                          DELETE
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </motion.div>

      </main>
    </div>
  );
}