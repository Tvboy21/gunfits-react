'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CldUploadWidget } from 'next-cloudinary';
import Navbar from '../../components/Navbar';
import { useAuth } from '../../context/AuthContext';
import { getFirestore, collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
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

const emptyProduct = {
  name: '', category: 'Tees', price: '',
  description: '', sizes: [], inStock: true, isNew: false, imagePublicId: ''
};

const allSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size'];
const allCategories = ['Tees', 'Hoodies', 'Bottoms', 'Outerwear', 'Accessories'];

export default function AdminProducts() {
  const { user, isAdmin, loading } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyProduct);
  const [saving, setSaving] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) router.push('/');
  }, [user, isAdmin, loading, router]);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    const snap = await getDocs(collection(db, 'products'));
    setProducts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  }

  function toggleSize(size) {
    setForm(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size]
    }));
  }

  function handleImageUpload(result) {
    if (result.event === 'success') {
      setForm(prev => ({
        ...prev,
        imagePublicId: result.info.public_id
      }));
      setUploadStatus('✓ Image uploaded successfully');
      setTimeout(() => setUploadStatus(''), 2000);
    }
  }

  async function handleSave() {
    if (!form.name || !form.price) {
      setUploadStatus('Please fill in name and price');
      return;
    }
    setSaving(true);
    const data = { 
      ...form, 
      price: Number(form.price),
      createdAt: editingId ? form.createdAt : new Date().toISOString()
    };
    try {
      if (editingId) {
        await updateDoc(doc(db, 'products', editingId), data);
        setUploadStatus('✓ Product updated successfully');
      } else {
        await addDoc(collection(db, 'products'), data);
        setUploadStatus('✓ Product added successfully');
      }
      await fetchProducts();
      setForm(emptyProduct);
      setEditingId(null);
      setShowForm(false);
      setTimeout(() => setUploadStatus(''), 2000);
    } catch (error) {
      setUploadStatus('Error saving product: ' + error.message);
    }
    setSaving(false);
  }

  async function handleDelete(id) {
    if (!confirm('Delete this product?')) return;
    try {
      await deleteDoc(doc(db, 'products', id));
      await fetchProducts();
      setUploadStatus('✓ Product deleted');
      setTimeout(() => setUploadStatus(''), 2000);
    } catch (error) {
      setUploadStatus('Error deleting: ' + error.message);
    }
  }

  function handleEdit(product) {
    setForm({ ...product });
    setEditingId(product.id);
    setShowForm(true);
  }

  if (loading) return null;
  if (!isAdmin) return null;

  return (
    <div style={{ background: '#060606', minHeight: '100vh' }}>
      <Navbar />
      <main style={{ padding: 'clamp(40px, 5vw, 80px) clamp(20px, 5vw, 48px)', maxWidth: '1200px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 'clamp(32px, 8vw, 48px)', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <Link href="/admin" style={{ fontSize: '11px', letterSpacing: '0.2em', color: '#666666', textDecoration: 'none', textTransform: 'uppercase' }}>← Back to Dashboard</Link>
            <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(2rem, 6vw, 4rem)', color: '#EEEBE3', letterSpacing: '0.05em', marginTop: '8px' }}>
              MANAGE <span style={{ color: '#C94E0A' }}>PRODUCTS</span>
            </h1>
          </div>
          <button onClick={() => { setShowForm(true); setEditingId(null); setForm(emptyProduct); setUploadStatus(''); }} style={{
            background: '#C94E0A', color: '#EEEBE3', border: 'none',
            fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(0.85rem, 2vw, 1rem)',
            letterSpacing: '0.12em', padding: 'clamp(10px, 2vw, 12px) clamp(20px, 4vw, 28px)', cursor: 'pointer', transition: 'background 0.2s'
          }}
          onMouseEnter={e => e.currentTarget.style.background = '#F0BE00'}
          onMouseLeave={e => e.currentTarget.style.background = '#C94E0A'}>+ Add Product</button>
        </div>

        {/* Status Messages */}
        {uploadStatus && (
          <div style={{
            padding: '12px 16px',
            marginBottom: '16px',
            background: uploadStatus.includes('✓') ? 'rgba(68,204,68,0.15)' : 'rgba(255,68,68,0.15)',
            border: `1px solid ${uploadStatus.includes('✓') ? '#44cc44' : '#ff4444'}`,
            color: uploadStatus.includes('✓') ? '#44cc44' : '#ff4444',
            fontSize: '12px',
            letterSpacing: '0.08em'
          }}>
            {uploadStatus}
          </div>
        )}

        {/* Add/Edit Form */}
        {showForm && (
          <div style={{
            background: 'linear-gradient(135deg, #1a1a1a, #111111)',
            border: '1.5px solid rgba(255,255,255,0.08)',
            borderTop: '3px solid #C94E0A',
            padding: 'clamp(20px, 5vw, 32px)',
            marginBottom: '40px'
          }}>
            <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(1.4rem, 4vw, 1.8rem)', color: '#EEEBE3', letterSpacing: '0.08em', marginBottom: '24px' }}>
              {editingId ? 'EDIT PRODUCT' : 'NEW PRODUCT'}
            </h2>

            {/* Image Upload */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#7FD4F0', display: 'block', marginBottom: '12px', fontWeight: 600 }}>Product Image</label>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                <CldUploadWidget
                  uploadPreset="gunfits_products"
                  onSuccess={handleImageUpload}
                >
                  {({ open }) => (
                    <button
                      type="button"
                      onClick={() => open()}
                      style={{
                        background: '#333333',
                        color: '#EEEBE3',
                        border: '1px solid #444444',
                        fontFamily: 'Bebas Neue, sans-serif',
                        fontSize: '0.9rem',
                        letterSpacing: '0.1em',
                        padding: 'clamp(8px, 2vw, 12px) clamp(14px, 3vw, 24px)',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = '#444444'}
                      onMouseLeave={e => e.currentTarget.style.background = '#333333'}
                    >
                      📤 Upload Image
                    </button>
                  )}
                </CldUploadWidget>
                
                {form.imagePublicId && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '80px',
                      height: '80px',
                      background: '#0e0e0e',
                      border: '1px solid #333333',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '10px',
                      color: '#666666'
                    }}>
                      ✓ Image set
                    </div>
                    <button
                      type="button"
                      onClick={() => setForm(prev => ({ ...prev, imagePublicId: '' }))}
                      style={{
                        background: 'transparent',
                        color: '#ff4444',
                        border: '1px solid #ff4444',
                        fontSize: '11px',
                        letterSpacing: '0.1em',
                        padding: '6px 12px',
                        cursor: 'pointer'
                      }}
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Form Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(clamp(200px, 45vw, 1fr), 1fr))', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#7FD4F0', display: 'block', marginBottom: '6px', fontWeight: 600 }}>Product Name</label>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={{
                  width: '100%', background: '#0e0e0e', border: '1px solid #333333',
                  color: '#EEEBE3', padding: 'clamp(10px, 2vw, 12px) 16px', fontSize: '14px', outline: 'none', transition: 'border-color 0.2s'
                }}
                onFocus={e => e.currentTarget.style.borderColor = '#C94E0A'}
                onBlur={e => e.currentTarget.style.borderColor = '#333333'}
                placeholder="e.g. GUN Circle Logo"/>
              </div>
              <div>
                <label style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#7FD4F0', display: 'block', marginBottom: '6px', fontWeight: 600 }}>Category</label>
                <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} style={{
                  width: '100%', background: '#0e0e0e', border: '1px solid #333333',
                  color: '#EEEBE3', padding: 'clamp(10px, 2vw, 12px) 16px', fontSize: '14px', outline: 'none', cursor: 'pointer'
                }}>
                  {allCategories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#7FD4F0', display: 'block', marginBottom: '6px', fontWeight: 600 }}>Price (KES)</label>
                <input type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} style={{
                  width: '100%', background: '#0e0e0e', border: '1px solid #333333',
                  color: '#EEEBE3', padding: 'clamp(10px, 2vw, 12px) 16px', fontSize: '14px', outline: 'none', transition: 'border-color 0.2s'
                }}
                onFocus={e => e.currentTarget.style.borderColor = '#C94E0A'}
                onBlur={e => e.currentTarget.style.borderColor = '#333333'}
                placeholder="e.g. 3500"/>
              </div>
              <div>
                <label style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#7FD4F0', display: 'block', marginBottom: '6px', fontWeight: 600 }}>Description</label>
                <input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} style={{
                  width: '100%', background: '#0e0e0e', border: '1px solid #333333',
                  color: '#EEEBE3', padding: 'clamp(10px, 2vw, 12px) 16px', fontSize: '14px', outline: 'none', transition: 'border-color 0.2s'
                }}
                onFocus={e => e.currentTarget.style.borderColor = '#C94E0A'}
                onBlur={e => e.currentTarget.style.borderColor = '#333333'}
                placeholder="Short description"/>
              </div>
            </div>

            {/* Sizes */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#7FD4F0', display: 'block', marginBottom: '10px', fontWeight: 600 }}>Available Sizes</label>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {allSizes.map(size => (
                  <button key={size} onClick={() => toggleSize(size)} type="button" style={{
                    padding: 'clamp(6px, 1.5vw, 8px) clamp(10px, 2vw, 14px)',
                    border: '1.5px solid',
                    borderColor: form.sizes.includes(size) ? '#F0BE00' : '#333333',
                    background: form.sizes.includes(size) ? 'linear-gradient(135deg, rgba(240,190,0,0.2), rgba(201,78,10,0.1))' : 'transparent',
                    color: form.sizes.includes(size) ? '#F0BE00' : '#666666',
                    cursor: 'pointer', fontSize: '11px', letterSpacing: '0.1em', transition: 'all 0.2s', fontWeight: 600
                  }}>{size}</button>
                ))}
              </div>
            </div>

            {/* Toggles */}
            <div style={{ display: 'flex', gap: 'clamp(16px, 4vw, 24px)', marginBottom: '24px', flexWrap: 'wrap' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '12px', color: '#666666', letterSpacing: '0.1em', userSelect: 'none' }}>
                <input type="checkbox" checked={form.inStock} onChange={e => setForm({ ...form, inStock: e.target.checked })} style={{ cursor: 'pointer' }}/>
                <span>IN STOCK</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '12px', color: '#666666', letterSpacing: '0.1em', userSelect: 'none' }}>
                <input type="checkbox" checked={form.isNew} onChange={e => setForm({ ...form, isNew: e.target.checked })} style={{ cursor: 'pointer' }}/>
                <span>MARK AS NEW</span>
              </label>
            </div>

            {/* Buttons */}
            <div style={{ display: 'flex', gap: 'clamp(8px, 2vw, 12px)', flexWrap: 'wrap' }}>
              <button onClick={handleSave} disabled={saving} style={{
                background: saving ? '#333333' : '#C94E0A',
                color: '#EEEBE3', border: 'none',
                fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(0.85rem, 2vw, 1rem)',
                letterSpacing: '0.12em', padding: 'clamp(10px, 2vw, 12px) clamp(20px, 4vw, 32px)', cursor: saving ? 'not-allowed' : 'pointer', transition: 'background 0.2s'
              }}
              onMouseEnter={e => !saving && (e.currentTarget.style.background = '#F0BE00')}
              onMouseLeave={e => !saving && (e.currentTarget.style.background = '#C94E0A')}
              >{saving ? 'SAVING...' : editingId ? 'UPDATE PRODUCT' : 'SAVE PRODUCT'}</button>
              <button onClick={() => { setShowForm(false); setForm(emptyProduct); setEditingId(null); setUploadStatus(''); }} type="button" style={{
                background: 'transparent', color: '#666666',
                border: '1px solid #333333', fontFamily: 'Bebas Neue, sans-serif',
                fontSize: 'clamp(0.85rem, 2vw, 1rem)', letterSpacing: '0.12em', padding: 'clamp(10px, 2vw, 12px) clamp(20px, 4vw, 32px)', cursor: 'pointer', transition: 'all 0.2s'
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#C94E0A'; e.currentTarget.style.color = '#C94E0A'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#333333'; e.currentTarget.style.color = '#666666'; }}>CANCEL</button>
            </div>
          </div>
        )}

        {/* Products List */}
        {products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 'clamp(40px, 10vw, 80px) 0' }}>
            <p style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(1.5rem, 5vw, 2rem)', color: '#333333', letterSpacing: '0.1em' }}>NO PRODUCTS YET</p>
            <p style={{ fontSize: '12px', color: '#555555', marginTop: '8px' }}>Click "Add Product" to add your first item</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 3vw, 16px)' }}>
            {products.map(product => (
              <div key={product.id} style={{
                display: 'grid', gridTemplateColumns: '1fr auto',
                alignItems: 'center', gap: 'clamp(16px, 4vw, 24px)',
                background: 'linear-gradient(135deg, #1a1a1a, #111111)',
                border: '1px solid rgba(255,255,255,0.08)',
                padding: 'clamp(14px, 3vw, 20px)',
                transition: 'all 0.2s'
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = '#C94E0A'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px', flexWrap: 'wrap' }}>
                    <p style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(1rem, 3vw, 1.2rem)', color: '#EEEBE3', letterSpacing: '0.05em' }}>{product.name}</p>
                    {product.isNew && <span style={{ background: 'linear-gradient(135deg, #F0BE00, #C94E0A)', color: '#060606', fontSize: '9px', letterSpacing: '0.1em', padding: '3px 8px', fontFamily: 'Bebas Neue, sans-serif', fontWeight: 600 }}>✨ NEW</span>}
                    {!product.inStock && <span style={{ background: '#333333', color: '#666666', fontSize: '9px', letterSpacing: '0.1em', padding: '3px 8px', fontFamily: 'Bebas Neue, sans-serif' }}>OUT OF STOCK</span>}
                  </div>
                  <p style={{ fontSize: '11px', color: '#7FD4F0', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '4px' }}>{product.category} — KES {product.price?.toLocaleString()}</p>
                  <p style={{ fontSize: 'clamp(10px, 2vw, 12px)', color: '#888888', marginTop: '4px' }}>{product.description}</p>
                </div>
                <div style={{ display: 'flex', gap: '8px', flexDirection: 'column' }}>
                  <button onClick={() => handleEdit(product)} style={{
                    background: 'transparent', border: '1px solid #333333',
                    color: '#7FD4F0', cursor: 'pointer', fontSize: '11px',
                    letterSpacing: '0.1em', padding: '8px 16px', fontFamily: 'Bebas Neue, sans-serif', transition: 'all 0.2s'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#7FD4F0'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#333333'; }}>EDIT</button>
                  <button onClick={() => handleDelete(product.id)} style={{
                    background: 'transparent', border: '1px solid #333333',
                    color: '#ff4444', cursor: 'pointer', fontSize: '11px',
                    letterSpacing: '0.1em', padding: '8px 16px', fontFamily: 'Bebas Neue, sans-serif', transition: 'all 0.2s'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#ff4444'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#333333'; }}>DELETE</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}