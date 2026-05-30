'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdsTxtPage() {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      router.push('/login');
      return;
    }
    loadAdsTxt();
  }, [router]);

  async function loadAdsTxt() {
    try {
      const res = await fetch('/api/ads-txt');
      if (res.ok) {
        const data = await res.json();
        setContent(data.content || '');
      }
    } catch (err) {
      setMessage('Error loading ads.txt: ' + err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    setMessage('');
    try {
      const res = await fetch('/api/ads-txt', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });
      if (res.ok) {
        setMessage('ads.txt saved successfully! Changes are live at /ads.txt');
      } else {
        const err = await res.json();
        setMessage('Error: ' + (err.error || 'Save failed'));
      }
    } catch (err) {
      setMessage('Error: ' + err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading ads.txt...</div>;
  }

  return (
    <>
      <div className="admin-header">
        <div>
          <h1>Ads.txt Manager</h1>
          <p style={{ color: 'var(--color-text-muted)' }}>
            Manage your ads.txt file for Google AdSense and other ad network monetization.
          </p>
        </div>
        <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {message && (
        <div style={{
          background: message.startsWith('Error') ? '#fce4ec' : '#e8f5e9',
          color: message.startsWith('Error') ? '#c62828' : '#2e7d32',
          padding: '0.75rem 1rem',
          borderRadius: '8px',
          marginBottom: '1rem',
          fontSize: '0.9rem',
        }}>
          {message}
        </div>
      )}

      <div className="dashboard-card">
        <div className="dashboard-card-header">
          <div>
            <h3>ads.txt Content</h3>
            <p>Add your authorized digital sellers entries below. One entry per line.</p>
          </div>
          <a
            href="/ads.txt"
            target="_blank"
            className="btn btn-outline"
            style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
          >
            Preview Live File ↗
          </a>
        </div>

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={18}
          placeholder={`# Example ads.txt entries:\ngoogle.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0\ngoogle.com, pub-XXXXXXXXXXXXXXXX, RESELLER, f08c47fec0942fa0`}
          style={{
            width: '100%',
            fontFamily: 'monospace',
            fontSize: '0.9rem',
            lineHeight: '1.6',
            padding: '1rem',
            border: '1px solid var(--color-border)',
            borderRadius: '8px',
            background: '#fafafa',
            resize: 'vertical',
          }}
        />
      </div>

      <div className="dashboard-card" style={{ marginTop: '1rem' }}>
        <div className="dashboard-card-header">
          <h3>How to Use</h3>
        </div>
        <div style={{ fontSize: '0.9rem', color: 'var(--color-text-light)', lineHeight: '1.8' }}>
          <p><strong>Google AdSense:</strong> Go to your AdSense account → Sites → select your site → find your ads.txt entry. It looks like:</p>
          <code style={{
            display: 'block',
            background: '#f5f5f5',
            padding: '0.75rem 1rem',
            borderRadius: '6px',
            margin: '0.5rem 0 1rem',
            fontSize: '0.85rem',
            fontFamily: 'monospace',
          }}>
            google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0
          </code>
          <p><strong>Format:</strong> Each line should follow: <code style={{ background: '#f5f5f5', padding: '2px 6px', borderRadius: '4px' }}>domain, publisher-ID, relationship, certification-ID</code></p>
          <p style={{ marginTop: '0.5rem' }}><strong>Note:</strong> Lines starting with <code style={{ background: '#f5f5f5', padding: '2px 6px', borderRadius: '4px' }}>#</code> are treated as comments.</p>
        </div>
      </div>
    </>
  );
}
