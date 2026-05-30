'use client';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function QuoteRequestForm() {
  const [products, setProducts] = useState([]);
  const searchParams = useSearchParams();
  const initialProductId = searchParams.get('product') || '';
  
  const [form, setForm] = useState({
    productId: initialProductId,
    name: '',
    quantity: 1,
    dimensions: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => setProducts(data.products || []));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // If product selected from dropdown, get name
    const selectedProd = products.find(p => p._id === form.productId);
    const prodName = selectedProd ? selectedProd.name : form.name;

    if (!prodName) {
      setError('Please select a product or enter a custom name.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          products: [{
            productId: form.productId || null,
            name: prodName,
            quantity: form.quantity,
            dimensions: form.dimensions,
            notes: form.notes
          }],
          notes: 'Standard Quote Request'
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit quote');

      setSuccess('Quote requested successfully! Our team will review and provide pricing shortly.');
      setForm({ productId: '', name: '', quantity: 1, dimensions: '', notes: '' });
      setTimeout(() => router.push('/dashboard/quotes'), 2500);
    } catch (err) {
      if (err.message === 'Unauthorized') {
        router.push(`/login?redirect=${encodeURIComponent('/dashboard/quote-request')}`);
        return;
      }
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', background: 'var(--color-bg-card)', padding: '2rem', borderRadius: '8px', boxShadow: 'var(--shadow-sm)' }}>
      <h2>Request a Custom Quote</h2>
      <p style={{ color: 'var(--color-text-muted)', marginBottom: '1rem' }}>Provide details about your project and we will prepare a personalized estimate.</p>
      <div style={{ background: 'rgba(201, 169, 110, 0.08)', border: '1px solid rgba(201, 169, 110, 0.18)', borderRadius: '12px', padding: '0.9rem 1rem', marginBottom: '1.4rem', color: 'var(--color-text-light)', fontSize: '0.92rem' }}>
        After submitting, you can track the quote from your dashboard, review updates from our team, and continue the conversation without leaving the website.
      </div>

      {error && <div style={{ background: '#ffebee', color: '#c62828', padding: '1rem', borderRadius: '4px', marginBottom: '1rem' }}>{error}</div>}
      {success && <div style={{ background: '#e8f5e9', color: '#2e7d32', padding: '1rem', borderRadius: '4px', marginBottom: '1rem' }}>{success}</div>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 500 }}>Select Product</label>
          <select 
            value={form.productId} 
            onChange={e => setForm({...form, productId: e.target.value, name: ''})}
            style={{ width: '100%', padding: '0.8rem', borderRadius: '4px', border: '1px solid var(--color-border)' }}
          >
            <option value="">-- Custom / Other Product --</option>
            {products.map(p => (
              <option key={p._id} value={p._id}>{p.name} ({p.category})</option>
            ))}
          </select>
        </div>

        {!form.productId && (
          <div>
            <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 500 }}>Custom Product Name *</label>
            <input 
              type="text" required={!form.productId} value={form.name} 
              onChange={e => setForm({...form, name: e.target.value})}
              placeholder="e.g. Motorized Custom Awning"
              style={{ width: '100%', padding: '0.8rem', borderRadius: '4px', border: '1px solid var(--color-border)' }}
            />
          </div>
        )}

        <div style={{ display: 'flex', gap: '1rem' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 500 }}>Quantity</label>
            <input 
              type="number" min="1" required value={form.quantity} 
              onChange={e => setForm({...form, quantity: parseInt(e.target.value)})}
              style={{ width: '100%', padding: '0.8rem', borderRadius: '4px', border: '1px solid var(--color-border)' }}
            />
          </div>
          <div style={{ flex: 2 }}>
            <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 500 }}>Approx Dimensions (W x H)</label>
            <input 
              type="text" value={form.dimensions} 
              onChange={e => setForm({...form, dimensions: e.target.value})}
              placeholder="e.g. 120cm x 150cm"
              style={{ width: '100%', padding: '0.8rem', borderRadius: '4px', border: '1px solid var(--color-border)' }}
            />
          </div>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 500 }}>Special Requirements / Notes</label>
          <textarea 
            rows="4" value={form.notes} 
            onChange={e => setForm({...form, notes: e.target.value})}
            placeholder="Fabric preferences, motorization details, delivery timing..."
            style={{ width: '100%', padding: '0.8rem', borderRadius: '4px', border: '1px solid var(--color-border)' }}
          ></textarea>
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading} style={{ padding: '1rem', marginTop: '0.5rem' }}>
          {loading ? 'Submitting...' : 'Submit Quote Request'}
        </button>
      </form>
    </div>
  );
}

export default function QuoteRequestPage() {
  return (
    <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Loading form...</div>}>
      <QuoteRequestForm />
    </Suspense>
  );
}
