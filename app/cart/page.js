'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';

export default function CartPage() {
  const router = useRouter();
  const { cart, removeFromCart, updateQuantity, totalPrice } = useCart();

  return (
    <div style={{ background: '#060606', minHeight: '100vh' }}>
      <Navbar />

      <main style={{ 
        padding: 'clamp(40px, 5vw, 80px) clamp(16px, 5vw, 48px)', 
        maxWidth: '1200px', 
        margin: '0 auto' 
      }}>

        {/* Header */}
        <div style={{ marginBottom: 'clamp(32px, 8vw, 48px)' }}>
          <p style={{ 
            fontSize: '11px', 
            letterSpacing: '0.25em', 
            textTransform: 'uppercase', 
            color: '#7FD4F0', 
            marginBottom: '8px' 
          }}>
            // Your Bag
          </p>
          <h1 style={{
            fontFamily: 'Bebas Neue, sans-serif',
            fontSize: 'clamp(2rem, 8vw, 5rem)',
            color: '#EEEBE3',
            letterSpacing: '0.05em',
            lineHeight: 1
          }}>
            CART <span style={{ color: '#C94E0A' }}>({cart.length})</span>
          </h1>
        </div>

        {cart.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 'clamp(40px, 10vw, 80px) 0' }}>
            <p style={{
              fontFamily: 'Bebas Neue, sans-serif',
              fontSize: 'clamp(1.5rem, 5vw, 2rem)',
              color: '#333333',
              letterSpacing: '0.1em',
              marginBottom: '24px'
            }}>YOUR BAG IS EMPTY</p>
            <Link href="/collections" className="hero-btn">Shop the Drop</Link>
          </div>
        ) : (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 'clamp(24px, 5vw, 40px)', 
            alignItems: 'start' 
          }}>

            {/* Cart Items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 3vw, 16px)' }}>
              {cart.map((item, index) => (
                <div key={`${item.id}-${item.size}-${index}`} style={{
                  display: 'grid',
                  gridTemplateColumns: 'clamp(80px, 20vw, 120px) 1fr auto',
                  gap: 'clamp(12px, 4vw, 24px)',
                  alignItems: 'start',
                  background: '#111111',
                  border: '1px solid #222222',
                  padding: 'clamp(12px, 3vw, 20px)',
                }}>
                  {/* Image */}
                  <div style={{
                    width: 'clamp(80px, 20vw, 120px)',
                    height: 'clamp(80px, 20vw, 120px)',
                    background: '#1a1a1a',
                    border: '1px solid #222222',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <span style={{ 
                      fontFamily: 'Bebas Neue, sans-serif', 
                      fontSize: 'clamp(0.9rem, 3vw, 1.2rem)', 
                      color: '#C94E0A', 
                      opacity: 0.5 
                    }}>GUN</span>
                  </div>

                  {/* Info */}
                  <div>
                    <p style={{ 
                      fontSize: '10px', 
                      letterSpacing: '0.2em', 
                      textTransform: 'uppercase', 
                      color: '#7FD4F0', 
                      marginBottom: '6px' 
                    }}>{item.category}</p>
                    <p style={{ 
                      fontFamily: 'Bebas Neue, sans-serif', 
                      fontSize: 'clamp(1rem, 4vw, 1.4rem)', 
                      color: '#EEEBE3', 
                      letterSpacing: '0.05em', 
                      marginBottom: '4px',
                      lineHeight: 1.2
                    }}>{item.name}</p>
                    <p style={{ 
                      fontSize: '11px', 
                      color: '#666666', 
                      letterSpacing: '0.1em', 
                      marginBottom: '8px' 
                    }}>Size: {item.size}</p>
                    <p style={{ 
                      fontSize: 'clamp(11px, 2.5vw, 13px)', 
                      color: '#F0BE00', 
                      letterSpacing: '0.1em' 
                    }}>KES {item.price.toLocaleString()}</p>

                    {/* Quantity */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '16px' }}>
                      <button onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)} style={{
                        width: '28px',
                        height: '28px',
                        background: '#222222',
                        border: '1px solid #333333',
                        color: '#EEEBE3',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        transition: 'all 0.2s'
                      }}>−</button>
                      <span style={{ 
                        fontFamily: 'Bebas Neue, sans-serif', 
                        fontSize: '1.1rem', 
                        color: '#EEEBE3', 
                        minWidth: '20px', 
                        textAlign: 'center' 
                      }}>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)} style={{
                        width: '28px',
                        height: '28px',
                        background: '#222222',
                        border: '1px solid #333333',
                        color: '#EEEBE3',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        transition: 'all 0.2s'
                      }}>+</button>
                    </div>
                  </div>

                  {/* Subtotal + Remove */}
                  <div style={{ textAlign: 'right', minWidth: 'clamp(80px, 20vw, 120px)' }}>
                    <p style={{ 
                      fontFamily: 'Bebas Neue, sans-serif', 
                      fontSize: 'clamp(0.95rem, 3vw, 1.2rem)', 
                      color: '#F0BE00', 
                      marginBottom: '12px',
                      wordBreak: 'break-word'
                    }}>
                      KES {(item.price * item.quantity).toLocaleString()}
                    </p>
                    <button onClick={() => removeFromCart(item.id, item.size)} style={{
                      background: 'none',
                      border: '1px solid #333333',
                      color: '#666666',
                      cursor: 'pointer',
                      fontSize: 'clamp(9px, 2vw, 10px)',
                      letterSpacing: '0.15em',
                      textTransform: 'uppercase',
                      padding: '6px 8px',
                      transition: 'all 0.2s',
                      whiteSpace: 'nowrap'
                    }}>Remove</button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="cart-summary" style={{
              background: '#111111',
              border: '1px solid #222222',
              borderTop: '3px solid #C94E0A',
              padding: 'clamp(20px, 5vw, 32px)',
              position: 'sticky',
              top: '100px'
            }}>
              <h2 style={{
                fontFamily: 'Bebas Neue, sans-serif',
                fontSize: 'clamp(1.4rem, 4vw, 1.8rem)',
                color: '#EEEBE3',
                letterSpacing: '0.08em',
                marginBottom: '24px'
              }}>ORDER SUMMARY</h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                {cart.map((item, index) => (
                  <div key={`${item.id}-${item.size}-${index}`} style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <span style={{ 
                      fontSize: 'clamp(10px, 2.5vw, 12px)', 
                      color: '#666666', 
                      letterSpacing: '0.08em',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>{item.name} x{item.quantity}</span>
                    <span style={{ 
                      fontSize: 'clamp(10px, 2.5vw, 12px)', 
                      color: '#EEEBE3',
                      whiteSpace: 'nowrap'
                    }}>KES {(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div style={{ borderTop: '1px solid #222222', paddingTop: '16px', marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
                  <span style={{ 
                    fontFamily: 'Bebas Neue, sans-serif', 
                    fontSize: 'clamp(1rem, 3vw, 1.2rem)', 
                    color: '#EEEBE3', 
                    letterSpacing: '0.08em' 
                  }}>TOTAL</span>
                  <span style={{ 
                    fontFamily: 'Bebas Neue, sans-serif', 
                    fontSize: 'clamp(1.1rem, 4vw, 1.4rem)', 
                    color: '#F0BE00',
                    whiteSpace: 'nowrap'
                  }}>KES {totalPrice.toLocaleString()}</span>
                </div>
              </div>

              <button onClick={() => router.push('/checkout')} style={{
                width: '100%',
                background: '#C94E0A',
                color: '#EEEBE3',
                border: 'none',
                fontFamily: 'Bebas Neue, sans-serif',
                fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)',
                letterSpacing: '0.14em',
                padding: 'clamp(12px, 3vw, 16px)',
                cursor: 'pointer',
                transition: 'background 0.2s',
                marginBottom: '12px'
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#F0BE00'}
              onMouseLeave={e => e.currentTarget.style.background = '#C94E0A'}>
                CHECKOUT
              </button>

              <Link href="/collections" style={{
                display: 'block',
                textAlign: 'center',
                fontSize: 'clamp(10px, 2vw, 11px)',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: '#666666',
                textDecoration: 'none',
                marginTop: '8px',
                transition: 'color 0.2s'
              }}>
                ← Continue Shopping
              </Link>
            </div>

          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}