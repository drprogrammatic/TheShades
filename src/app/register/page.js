'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '', company: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed');

      setSuccess('Account created successfully! Redirecting to login...');
      setTimeout(() => router.push('/login?registered=1'), 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="section" style={{ minHeight: 'calc(100vh - var(--header-height))', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg-alt)' }}>
      <div className="container" style={{ maxWidth: '500px' }}>
        <div className="admin-login-card">
          <h1>Create an Account</h1>
          <p>Create your account to request quotes online, track updates in your dashboard, and stay connected with our team.</p>
          <div style={{ background: 'rgba(201, 169, 110, 0.1)', border: '1px solid rgba(201, 169, 110, 0.2)', borderRadius: '12px', padding: '1rem 1.1rem', margin: '1rem 0 1.35rem', color: 'var(--color-text-light)', fontSize: '0.92rem' }}>
            <strong style={{ display: 'block', color: 'var(--color-heading)', marginBottom: '0.45rem' }}>What happens next</strong>
            <div>1. Create your account.</div>
            <div>2. Sign in to your dashboard.</div>
            <div>3. Submit and track your quote requests online.</div>
          </div>

          {error && <div style={{ background: '#ffebee', color: '#c62828', padding: '1rem', borderRadius: '4px', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
          {success && <div style={{ background: '#e8f5e9', color: '#2e7d32', padding: '1rem', borderRadius: '4px', marginBottom: '1rem', textAlign: 'center' }}>{success}</div>}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Full Name *</label>
              <input 
                type="text" name="name" required 
                value={formData.name} onChange={handleChange}
                style={{ width: '100%', padding: '0.8rem', border: '1px solid var(--color-border)', borderRadius: '4px' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Email Address *</label>
              <input 
                type="email" name="email" required 
                value={formData.email} onChange={handleChange}
                style={{ width: '100%', padding: '0.8rem', border: '1px solid var(--color-border)', borderRadius: '4px' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Phone Number</label>
              <input 
                type="tel" name="phone" 
                value={formData.phone} onChange={handleChange}
                style={{ width: '100%', padding: '0.8rem', border: '1px solid var(--color-border)', borderRadius: '4px' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Company Name (For Dealers)</label>
              <input 
                type="text" name="company" 
                value={formData.company} onChange={handleChange}
                style={{ width: '100%', padding: '0.8rem', border: '1px solid var(--color-border)', borderRadius: '4px' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Password *</label>
              <input 
                type="password" name="password" required minLength="6"
                value={formData.password} onChange={handleChange}
                style={{ width: '100%', padding: '0.8rem', border: '1px solid var(--color-border)', borderRadius: '4px' }}
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
              {loading ? 'Creating Account...' : 'Register'}
            </button>
            <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.9rem' }}>
              Already have an account? <Link href="/login" style={{ color: 'var(--color-accent)' }}>Login here</Link>
            </div>
          </form>
          <div style={{ marginTop: '1.25rem', color: 'var(--color-text-light)', fontSize: '0.9rem' }}>
            All new signups start as customer accounts. Dealer access is enabled by admin review after registration.
          </div>
        </div>
      </div>
    </div>
  );
}
