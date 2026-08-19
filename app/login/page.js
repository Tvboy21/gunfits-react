'use client';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function LoginPage() {
  const { login, signup, loginWithGoogle } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState('login');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirm, setSignupConfirm] = useState('');
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');

  async function handleLogin() {
    const newErrors = {};
    if (!loginEmail.includes('@') || !loginEmail.includes('.')) {
      newErrors.loginEmail = 'Please enter a valid email address.';
    }
    if (loginPassword.length < 6) {
      newErrors.loginPassword = 'Password must be at least 6 characters.';
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors); return;
    }
    try {
      await login(loginEmail, loginPassword);
      setSuccess('Login successful! Redirecting...');
      setTimeout(() => { router.push('/collections'); }, 1500);
    } catch (error) {
      if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
        setErrors({ loginEmail: 'No account found with this email.' });
      } else if (error.code === 'auth/wrong-password') {
        setErrors({ loginPassword: 'Incorrect password.' });
      } else {
        setErrors({ loginEmail: error.message });
      }
    }
  }

  async function handleSignup() {
    const newErrors = {};
    if (signupName.length < 2) newErrors.signupName = 'Please enter your full name.';
    if (!signupEmail.includes('@') || !signupEmail.includes('.')) newErrors.signupEmail = 'Please enter a valid email.';
    if (signupPassword.length < 6) newErrors.signupPassword = 'Password must be at least 6 characters.';
    if (signupConfirm !== signupPassword) newErrors.signupConfirm = 'Passwords do not match.';
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors); return;
    }
    try {
      await signup(signupEmail, signupPassword, signupName);
      setSuccess('Account created! Please log in.');
      setTimeout(() => { setTab('login'); setSuccess(''); }, 1500);
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        setErrors({ signupEmail: 'This email is already registered.' });
      } else {
        setErrors({ signupEmail: error.message });
      }
    }
  }

  async function handleGoogleAuth() {
    setErrors({});
    setSuccess('');

    try {
      await loginWithGoogle();
      setSuccess('Login successful! Redirecting...');
      setTimeout(() => { router.push('/collections'); }, 1500);
    } catch (error) {
      if (error?.code === 'auth/popup-closed-by-user' || error?.code === 'auth/cancelled-popup-request') {
        setErrors({ googleAuth: 'Google sign-in was cancelled.' });
      } else if (error?.code === 'auth/network-request-failed') {
        setErrors({ googleAuth: 'Network error. Please check your connection.' });
      } else {
        setErrors({ googleAuth: error?.message || 'Error during Google authentication.' });
      }
    }
  }

  return (
    <div className="auth-body">
      <div className="auth-card">
        <div className="auth-tabs">
          <button className={`tab ${tab === 'login' ? 'active' : ''}`} onClick={() => { setTab('login'); setErrors({}); setSuccess(''); }}>Login</button>
          <button className={`tab ${tab === 'signup' ? 'active' : ''}`} onClick={() => { setTab('signup'); setErrors({}); setSuccess(''); }}>Sign Up</button>
        </div>

        {success && <p className="success-msg" style={{display:'block'}}>{success}</p>}

        {tab === 'login' && (
          <div className="auth-form">
            <h2 className="auth-title">Welcome Back</h2>
            <p className="auth-sub">Log in to your GUNFITS account</p>
            <input type="email" placeholder="Email" className="auth-input" value={loginEmail} onChange={e => setLoginEmail(e.target.value)}/>
            {errors.loginEmail && <p className="error-msg" style={{display:'block'}}>{errors.loginEmail}</p>}
            <input type="password" placeholder="Password" className="auth-input" value={loginPassword} onChange={e => setLoginPassword(e.target.value)}/>
            {errors.loginPassword && <p className="error-msg" style={{display:'block'}}>{errors.loginPassword}</p>}
            <button className="auth-btn" onClick={handleLogin}>Login</button>
            <p className="auth-divider">OR</p>
            <button className="google-btn" onClick={handleGoogleAuth}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Login with Google
            </button>
            {errors.googleAuth && <p className="error-msg" style={{display:'block'}}>{errors.googleAuth}</p>}
            <p className="auth-note">Forgot your password? <a href="#">Reset it</a></p>
          </div>
        )}

        {tab === 'signup' && (
          <div className="auth-form">
            <h2 className="auth-title">Join GUNFITS</h2>
            <p className="auth-sub">Create your account</p>
            <input type="text" placeholder="Full Name" className="auth-input" value={signupName} onChange={e => setSignupName(e.target.value)}/>
            {errors.signupName && <p className="error-msg" style={{display:'block'}}>{errors.signupName}</p>}
            <input type="email" placeholder="Email" className="auth-input" value={signupEmail} onChange={e => setSignupEmail(e.target.value)}/>
            {errors.signupEmail && <p className="error-msg" style={{display:'block'}}>{errors.signupEmail}</p>}
            <input type="password" placeholder="Password" className="auth-input" value={signupPassword} onChange={e => setSignupPassword(e.target.value)}/>
            {errors.signupPassword && <p className="error-msg" style={{display:'block'}}>{errors.signupPassword}</p>}
            <input type="password" placeholder="Confirm Password" className="auth-input" value={signupConfirm} onChange={e => setSignupConfirm(e.target.value)}/>
            {errors.signupConfirm && <p className="error-msg" style={{display:'block'}}>{errors.signupConfirm}</p>}
            <button className="auth-btn" onClick={handleSignup}>Create Account</button>
            <p className="auth-divider">OR</p>
            <button className="google-btn" onClick={handleGoogleAuth}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Sign up with Google
            </button>
            {errors.googleAuth && <p className="error-msg" style={{display:'block'}}>{errors.googleAuth}</p>}
          </div>
        )}
      </div>

      <div className="welcome-graffiti">
        <div>WELCOME</div>
        <div>TO YOUR</div>
        <div>WORLD</div>
      </div>
      <div className="graffiti">ELEGANCE</div>
      <div className="quote">Let the past make you better, not bitter</div>
      <div className="graffiti2">RAW</div>
      <div className="graffiti3">URBAN</div>
      <div className="graffiti4">SWAG</div>
      <div className="graffiti5">21</div>
    </div>
  );
}