'use client';
import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Graffiti from '../components/Graffiti';
import Footer from '../components/Footer';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { initializeApp, getApps } from 'firebase/app';
import { CldImage } from 'next-cloudinary';

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

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('Soonest');
  const [showGraffiti, setShowGraffiti] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [phone, setPhone] = useState('');
  const [paying, setPaying] = useState(false);
  const [payStatus, setPayStatus] = useState('');

  const eventTypes = ['All', 'Fashion Show', 'Pop Up Store', 'Sale Event', 'Collab Drop', 'Community Event'];

  useEffect(() => {
    async function fetchEvents() {
      const snap = await getDocs(collection(db, 'events'));
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      data.sort((a, b) => new Date(a.date) - new Date(b.date));
      setEvents(data);
      setLoading(false);
    }
    fetchEvents();
  }, []);

  // apply type filter, search, then sort
  let filtered = filter === 'All' ? events.slice() : events.filter(e => e.type === filter);
  if (search && search.trim() !== '') {
    const q = search.trim().toLowerCase();
    filtered = filtered.filter(e => (
      (e.title || '').toLowerCase().includes(q) ||
      (e.location || '').toLowerCase().includes(q) ||
      (e.description || '').toLowerCase().includes(q)
    ));
  }

  if (sort === 'Soonest') {
    filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
  } else if (sort === 'Latest') {
    filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
  } else if (sort === 'Price Low') {
    filtered.sort((a, b) => (a.ticketPrice || 0) - (b.ticketPrice || 0));
  } else if (sort === 'Price High') {
    filtered.sort((a, b) => (b.ticketPrice || 0) - (a.ticketPrice || 0));
  }

  async function handlePayment() {
    if (!phone || phone.length < 9) {
      setPayStatus('error:Please enter a valid phone number');
      return;
    }
    setPaying(true);
    setPayStatus('pending:Sending payment request...');
    try {
      const res = await fetch('/api/mpesa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone,
          amount: selectedEvent.ticketPrice,
          eventTitle: selectedEvent.title,
          eventId: selectedEvent.id
        })
      });
      const data = await res.json();
      if (data.success) {
        setPayStatus('success:STK push sent! Check your phone and enter your M-Pesa PIN.');
      } else {
        setPayStatus('error:' + (data.message || 'Payment failed. Try again.'));
      }
    } catch (err) {
      setPayStatus('error:Something went wrong. Try again.');
    }
    setPaying(false);
  }

  function closeModal() {
    setSelectedEvent(null);
    setPhone('');
    setPayStatus('');
    setPaying(false);
  }

  const [statusType, statusMsg] = payStatus.includes(':')
    ? payStatus.split(':')
    : ['', payStatus];

  return (
    <div style={{ background: '#060606', minHeight: '100vh' }}>
      <Navbar />

      {/* M-Pesa Payment Modal */}
      {selectedEvent && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 999,
          background: 'rgba(0,0,0,0.85)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 'clamp(16px, 4vw, 24px)',
          overflowY: 'auto'
        }}>
          <div style={{
            background: '#111111',
            border: '1px solid #222222',
            borderTop: '3px solid #C94E0A',
            padding: 'clamp(20px, 5vw, 40px)',
            width: '100%',
            maxWidth: '440px',
            position: 'relative'
          }}>
            {/* Close button */}
            <button onClick={closeModal} style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              background: 'none',
              border: 'none',
              color: '#666666',
              fontSize: '1.2rem',
              cursor: 'pointer'
            }}>✕</button>

            {/* Modal header */}
            <p style={{ 
              fontSize: '10px', 
              letterSpacing: '0.2em', 
              textTransform: 'uppercase', 
              color: '#7FD4F0', 
              marginBottom: '8px' 
            }}>// M-Pesa Payment</p>
            <h2 style={{ 
              fontFamily: 'Bebas Neue, sans-serif', 
              fontSize: 'clamp(1.4rem, 4vw, 1.8rem)', 
              color: '#EEEBE3', 
              letterSpacing: '0.06em', 
              marginBottom: '4px' 
            }}>
              BUY TICKET
            </h2>
            <p style={{ 
              fontSize: 'clamp(11px, 2.5vw, 12px)', 
              color: '#666666', 
              marginBottom: '24px',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>{selectedEvent.title}</p>

            {/* Event summary */}
            <div style={{ background: '#0e0e0e', border: '1px solid #222222', padding: 'clamp(12px, 3vw, 16px)', marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', gap: '8px' }}>
                <span style={{ fontSize: 'clamp(11px, 2.5vw, 12px)', color: '#666666' }}>Event</span>
                <span style={{ fontSize: 'clamp(11px, 2.5vw, 12px)', color: '#EEEBE3', textAlign: 'right', overflow: 'hidden', textOverflow: 'ellipsis' }}>{selectedEvent.title}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', gap: '8px' }}>
                <span style={{ fontSize: 'clamp(11px, 2.5vw, 12px)', color: '#666666' }}>Date</span>
                <span style={{ fontSize: 'clamp(11px, 2.5vw, 12px)', color: '#EEEBE3' }}>{selectedEvent.date}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', gap: '8px' }}>
                <span style={{ fontSize: 'clamp(11px, 2.5vw, 12px)', color: '#666666' }}>Location</span>
                <span style={{ fontSize: 'clamp(11px, 2.5vw, 12px)', color: '#EEEBE3', textAlign: 'right' }}>{selectedEvent.location}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #222222', paddingTop: '8px', marginTop: '8px', gap: '8px' }}>
                <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(0.95rem, 2.5vw, 1rem)', color: '#EEEBE3' }}>TOTAL</span>
                <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(1rem, 3vw, 1.2rem)', color: '#F0BE00' }}>KES {selectedEvent.ticketPrice?.toLocaleString()}</span>
              </div>
            </div>

            {/* Phone input */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ 
                fontSize: '10px', 
                letterSpacing: '0.2em', 
                textTransform: 'uppercase', 
                color: '#7FD4F0', 
                display: 'block', 
                marginBottom: '8px' 
              }}>
                M-Pesa Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="e.g. 0712345678"
                style={{
                  width: '100%',
                  background: '#0e0e0e',
                  border: '1px solid #333333',
                  color: '#EEEBE3',
                  padding: 'clamp(12px, 2vw, 14px) 16px',
                  fontSize: 'clamp(13px, 2.5vw, 14px)',
                  outline: 'none',
                  letterSpacing: '0.08em'
                }}
              />
            </div>

            {/* Status message */}
            {statusMsg && (
              <div style={{
                padding: 'clamp(10px, 2vw, 12px) 16px',
                marginBottom: '16px',
                background: statusType === 'success' ? 'rgba(68,204,68,0.1)' : statusType === 'error' ? 'rgba(255,68,68,0.1)' : 'rgba(127,212,240,0.1)',
                border: `1px solid ${statusType === 'success' ? '#44cc44' : statusType === 'error' ? '#ff4444' : '#7FD4F0'}`,
              }}>
                <p style={{
                  fontSize: 'clamp(11px, 2.5vw, 12px)',
                  letterSpacing: '0.08em',
                  color: statusType === 'success' ? '#44cc44' : statusType === 'error' ? '#ff4444' : '#7FD4F0'
                }}>{statusMsg}</p>
              </div>
            )}

            {/* Pay button */}
            <button
              type="button"
              onClick={handlePayment}
              disabled={paying}
              style={{
                width: '100%',
                background: paying ? '#333333' : '#C94E0A',
                color: '#EEEBE3',
                border: 'none',
                fontFamily: 'Bebas Neue, sans-serif',
                fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)',
                letterSpacing: '0.14em',
                padding: 'clamp(12px, 3vw, 16px)',
                cursor: paying ? 'not-allowed' : 'pointer',
                transition: 'background 0.2s',
                marginBottom: '12px'
              }}>
              {paying ? 'PROCESSING...' : `PAY KES ${selectedEvent.ticketPrice?.toLocaleString()}`}
            </button>

            <p style={{ 
              fontSize: 'clamp(9px, 2vw, 10px)', 
              color: '#444444', 
              textAlign: 'center', 
              letterSpacing: '0.08em' 
            }}>
              You will receive an STK push on your phone. Enter your M-Pesa PIN to complete payment.
            </p>
          </div>
        </div>
      )}

      <main style={{ 
        padding: 'clamp(40px, 5vw, 80px) clamp(16px, 5vw, 48px)', 
        maxWidth: '1400px', 
        margin: '0 auto' 
      }}>

        {/* Header */}
        <div style={{ marginBottom: 'clamp(32px, 8vw, 48px)' }}>
          <div style={{ position: 'relative' }}>
            <Graffiti visible={showGraffiti} />
          </div>
          <p style={{ 
            fontSize: '11px', 
            letterSpacing: '0.25em', 
            textTransform: 'uppercase', 
            color: '#7FD4F0', 
            marginBottom: '8px' 
          }}>
            // What's Happening
          </p>
          <h1 style={{
            fontFamily: 'Bebas Neue, sans-serif',
            fontSize: 'clamp(2rem, 8vw, 5rem)',
            color: '#EEEBE3',
            letterSpacing: '0.05em',
            lineHeight: 1
          }}>
            UPCOMING <span style={{ color: '#C94E0A' }}>EVENTS</span>
          </h1>
        </div>

        {/* Filter + Search + Sort */}
        <div style={{ 
          display: 'flex', 
          gap: 'clamp(12px, 3vw, 20px)',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 'clamp(32px, 8vw, 48px)', 
          borderBottom: '1px solid #222222', 
          paddingBottom: '16px'
        }}>
          <div style={{ display: 'flex', gap: 'clamp(8px, 2vw, 12px)', flexWrap: 'wrap', overflowX: 'auto' }}>
            {eventTypes.map(type => (
              <button key={type} onClick={() => setFilter(type)} style={{
                fontFamily: 'Bebas Neue, sans-serif',
                fontSize: 'clamp(0.8rem, 2.5vw, 0.9rem)',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                padding: 'clamp(6px, 2vw, 8px) clamp(12px, 3vw, 20px)',
                cursor: 'pointer',
                border: '1px solid',
                borderColor: filter === type ? '#C94E0A' : '#333333',
                background: filter === type ? '#C94E0A' : 'transparent',
                color: filter === type ? '#EEEBE3' : '#666666',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap'
              }}>{type}</button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginLeft: 'auto' }}>
            <input
              aria-label="Search events"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by title, location, description"
              style={{
                background: '#0e0e0e',
                border: '1px solid #333333',
                color: '#EEEBE3',
                padding: '8px 12px',
                fontSize: '14px',
                outline: 'none',
                minWidth: '220px'
              }}
            />

            <select value={sort} onChange={e => setSort(e.target.value)} style={{
              background: '#0e0e0e',
              border: '1px solid #333333',
              color: '#EEEBE3',
              padding: '8px 12px',
              fontSize: '14px',
              outline: 'none'
            }}>
              <option value="Soonest">Soonest</option>
              <option value="Latest">Latest</option>
              <option value="Price Low">Price: Low</option>
              <option value="Price High">Price: High</option>
            </select>
            <button
              type="button"
              onClick={() => setShowGraffiti(s => !s)}
              aria-pressed={showGraffiti}
              style={{
                background: showGraffiti ? '#C94E0A' : 'transparent',
                color: showGraffiti ? '#EEEBE3' : '#666666',
                border: '1px solid #333333',
                padding: '8px 10px',
                cursor: 'pointer',
                fontFamily: 'Bebas Neue, sans-serif',
                letterSpacing: '0.12em',
                textTransform: 'uppercase'
              }}
            >
              Graffiti: {showGraffiti ? 'On' : 'Off'}
            </button>
          </div>
        </div>

        {loading && (
          <div style={{ textAlign: 'center', padding: 'clamp(40px, 10vw, 80px) 0' }}>
            <p style={{ 
              fontFamily: 'Bebas Neue, sans-serif', 
              fontSize: 'clamp(1.5rem, 5vw, 2rem)', 
              color: '#C94E0A', 
              letterSpacing: '0.1em' 
            }}>LOADING...</p>
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: 'clamp(40px, 10vw, 80px) 0' }}>
            <p style={{ 
              fontFamily: 'Bebas Neue, sans-serif', 
              fontSize: 'clamp(1.5rem, 5vw, 2rem)', 
              color: '#333333', 
              letterSpacing: '0.1em' 
            }}>NO EVENTS YET</p>
            <p style={{ fontSize: 'clamp(11px, 2.5vw, 12px)', color: '#555555', marginTop: '8px' }}>Check back soon — something is always cooking.</p>
          </div>
        )}

        {!loading && filtered.length > 0 && (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 'clamp(16px, 4vw, 24px)',
            width: '100%'
          }}>
            {filtered.map(event => (
              <div key={event.id} style={{
                background: '#111111',
                border: '1px solid #222222',
                overflow: 'hidden',
                transition: 'transform 0.2s, border-color 0.2s'
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = '#C94E0A'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = '#222222'; }}>

                <div style={{ 
                  width: '100%', 
                  height: 'clamp(200px, 40vw, 240px)', 
                  background: '#1a1a1a', 
                  position: 'relative', 
                  overflow: 'hidden' 
                }}>
                  {event.imagePublicId ? (
                    <CldImage 
                      src={event.imagePublicId} 
                      width={400}
                      height={240}
                      alt={event.title} 
                      style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                    />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ 
                        fontFamily: 'Bebas Neue, sans-serif', 
                        fontSize: 'clamp(2rem, 10vw, 4rem)', 
                        color: 'rgba(201,78,10,0.15)' 
                      }}>GUN</span>
                    </div>
                  )}
                  <div style={{ 
                    position: 'absolute', 
                    top: '14px', 
                    left: '14px', 
                    background: '#C94E0A', 
                    color: '#EEEBE3', 
                    fontFamily: 'Bebas Neue, sans-serif', 
                    fontSize: 'clamp(0.65rem, 2vw, 0.7rem)', 
                    letterSpacing: '0.1em', 
                    padding: '4px 10px',
                    textTransform: 'uppercase'
                  }}>{event.type}</div>
                </div>

                <div style={{ padding: 'clamp(16px, 4vw, 24px)' }}>
                  <h2 style={{ 
                    fontFamily: 'Bebas Neue, sans-serif', 
                    fontSize: 'clamp(1.2rem, 4vw, 1.6rem)', 
                    color: '#EEEBE3', 
                    letterSpacing: '0.05em', 
                    marginBottom: '12px',
                    lineHeight: 1.2
                  }}>{event.title}</h2>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '16px' }}>
                    <p style={{ 
                      fontSize: 'clamp(10px, 2.5vw, 12px)', 
                      color: '#7FD4F0', 
                      letterSpacing: '0.1em' 
                    }}>📅 {new Date(event.date).toLocaleDateString('en-KE', { weekday: 'short', month: 'short', day: 'numeric' })}</p>
                    <p style={{ 
                      fontSize: 'clamp(10px, 2.5vw, 12px)', 
                      color: '#7FD4F0', 
                      letterSpacing: '0.1em' 
                    }}>🕐 {event.time}</p>
                    <p style={{ 
                      fontSize: 'clamp(10px, 2.5vw, 12px)', 
                      color: '#7FD4F0', 
                      letterSpacing: '0.1em',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>📍 {event.location}</p>
                  </div>

                  <p style={{ 
                    fontSize: 'clamp(10px, 2.5vw, 12px)', 
                    color: '#666666', 
                    lineHeight: 1.6, 
                    marginBottom: '20px',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>{event.description}</p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: '1px solid #222222', paddingTop: '16px', gap: '12px' }}>
                    <div>
                      <p style={{ 
                        fontFamily: 'Bebas Neue, sans-serif', 
                        fontSize: 'clamp(1.1rem, 4vw, 1.4rem)', 
                        color: '#F0BE00' 
                      }}>KES {event.ticketPrice?.toLocaleString()}</p>
                      <p style={{ 
                        fontSize: 'clamp(9px, 2vw, 10px)', 
                        color: '#555555', 
                        letterSpacing: '0.1em' 
                      }}>{event.totalTickets - (event.soldTickets || 0)} left</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedEvent(event)}
                      disabled={event.totalTickets - (event.soldTickets || 0) <= 0}
                      style={{
                        background: event.totalTickets - (event.soldTickets || 0) <= 0 ? '#333333' : '#C94E0A',
                        color: '#EEEBE3',
                        border: 'none',
                        fontFamily: 'Bebas Neue, sans-serif',
                        fontSize: 'clamp(0.8rem, 2.5vw, 0.95rem)',
                        letterSpacing: '0.12em',
                        padding: 'clamp(8px, 2vw, 12px) clamp(12px, 3vw, 24px)',
                        cursor: event.totalTickets - (event.soldTickets || 0) <= 0 ? 'not-allowed' : 'pointer',
                        transition: 'background 0.2s',
                        whiteSpace: 'nowrap'
                      }}
                      onMouseEnter={e => { if (event.totalTickets - (event.soldTickets || 0) > 0) e.currentTarget.style.background = '#F0BE00'; }}
                      onMouseLeave={e => { if (event.totalTickets - (event.soldTickets || 0) > 0) e.currentTarget.style.background = '#C94E0A'; }}>
                      {event.totalTickets - (event.soldTickets || 0) <= 0 ? 'SOLD OUT' : 'BUY'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}