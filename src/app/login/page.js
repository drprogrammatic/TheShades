'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [redirectTarget, setRedirectTarget] = useState('/dashboard');
  const [registered, setRegistered] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const params = new URLSearchParams(window.location.search);
    setRedirectTarget(params.get('redirect') || '/dashboard');
    setRegistered(params.get('registered') === '1');
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      document.cookie = `token=${data.token}; path=/; max-age=${60*60*24*7}`;
      
      router.push(redirectTarget);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section" style={{ minHeight: 'calc(100vh - var(--header-height))', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg-alt)' }}>
      <div className="container" style={{ maxWidth: '400px' }}>
        <div className="admin-login-card">
          <h1>THE <span style={{ color: '#C9A96E' }}>SHADES</span></h1>
          <p>Sign in to request quotes, track progress, and manage everything from your dashboard.</p>
          {registered && (
            <div style={{ background: '#e8f5e9', color: '#2e7d32', padding: '0.85rem 1rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.92rem' }}>
              Your account is ready. Sign in to open your dashboard and start requesting quotes.
            </div>
          )}
          {error && (
            <div style={{ background: '#fde8e8', color: '#e53935', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.9rem' }}>
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input id="email" type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input id="password" type="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
            <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.9rem' }}>
              Don't have an account? <Link href="/register" style={{ color: 'var(--color-accent)' }}>Register here</Link>
            </div>
          </form>
          <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid rgba(44, 44, 44, 0.08)', color: 'var(--color-text-light)', fontSize: '0.9rem' }}>
            <strong style={{ display: 'block', color: 'var(--color-heading)', marginBottom: '0.55rem' }}>Inside your dashboard</strong>
            <div>Request quotes, review updates, track orders, and open support tickets without leaving the website.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
