'use client';
import { useState, useEffect } from 'react';

export default function QuotesPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState('customer');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setUserRole(user.role || 'customer');
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      setOrders(data.orders || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateOrder = async (id, payload) => {
    try {
      const res = await fetch('/api/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...payload })
      });
      if (res.ok) loadOrders();
    } catch (err) {
      console.error(err);
    }
  };

  const statusColors = {
    'Pending Quote': '#ff9800',
    'Quoted': '#2196f3',
    'Accepted': '#4caf50',
    'In Production': '#9c27b0',
    'Shipped': '#3f51b5',
    'Delivered': '#009688',
    'Cancelled': '#f44336'
  };

  return (
    <>
      <div className="admin-header">
        <h1>{userRole === 'admin' ? 'Manage Orders & Quotes' : 'My Orders & Quotes'}</h1>
        <p style={{ color: 'var(--color-text-muted)' }}>
          {userRole === 'admin' ? 'Review requests, send quotes, and upload bills.' : 'Track the status of your requests and view uploaded bills.'}
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center' }}>Loading orders...</div>
        ) : orders.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', background: 'var(--color-bg-card)', borderRadius: '8px' }}>No orders or quotes found.</div>
        ) : (
          orders.map(order => (
            <div key={order._id} style={{ background: 'var(--color-bg-card)', padding: '1.5rem', borderRadius: '8px', boxShadow: 'var(--shadow-sm)', display: 'flex', flexWrap: 'wrap', gap: '2rem' }}>
              
              <div style={{ flex: '1 1 300px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ margin: 0 }}>{order.orderNumber}</h3>
                  <span style={{ background: statusColors[order.status] || '#ccc', color: '#fff', padding: '4px 10px', borderRadius: '20px', fontSize: '0.85rem' }}>
                    {order.status}
                  </span>
                </div>
                
                {userRole === 'admin' && order.user && (
                  <div style={{ marginBottom: '1rem', padding: '1rem', background: 'var(--color-bg-alt)', borderRadius: '4px' }}>
                    <strong>Customer:</strong> {order.user.name} ({order.user.company || 'N/A'})<br/>
                    <strong>Email:</strong> {order.user.email}<br/>
                    <strong>Phone:</strong> {order.user.phone || 'N/A'}
                  </div>
                )}

                <div style={{ marginBottom: '1rem' }}>
                  <strong>Products:</strong>
                  <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
                    {order.products.map((p, i) => (
                      <li key={i}>{p.quantity}x {p.name} {p.dimensions ? `(${p.dimensions})` : ''} <br/><small style={{ color: 'var(--color-text-muted)' }}>{p.notes}</small></li>
                    ))}
                  </ul>
                </div>

                {order.notes && (
                  <div style={{ fontSize: '0.9rem', color: 'var(--color-text-light)', borderLeft: '3px solid var(--color-accent)', paddingLeft: '1rem' }}>
                    <em>"{order.notes}"</em>
                  </div>
                )}
              </div>

              <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: '1rem', borderLeft: '1px solid var(--color-border)', paddingLeft: '2rem' }}>
                
                {/* Admin Actions */}
                {userRole === 'admin' ? (
                  <>
                    <div className="form-group">
                      <label>Set Quote Amount (₹)</label>
                      <input 
                        type="number" defaultValue={order.quoteAmount || ''} 
                        onBlur={e => e.target.value !== String(order.quoteAmount) && updateOrder(order._id, { quoteAmount: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                    <div className="form-group">
                      <label>Bill / Invoice PDF URL</label>
                      <input 
                        type="url" defaultValue={order.billUrl || ''} placeholder="https://..."
                        onBlur={e => e.target.value !== String(order.billUrl) && updateOrder(order._id, { billUrl: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label>Update Status</label>
                      <select 
                        value={order.status} 
                        onChange={e => updateOrder(order._id, { status: e.target.value })}
                        style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--color-border)' }}
                      >
                        {['Pending Quote', 'Quoted', 'Accepted', 'In Production', 'Shipped', 'Delivered', 'Cancelled'].map(s => <option key={s}>{s}</option>)}
                      </select>
                    </div>
                  </>
                ) : (
                  /* Customer/Dealer Actions */
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', justifyContent: 'center', height: '100%' }}>
                    <div>
                      <div style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Quoted Price</div>
                      <div style={{ fontSize: '2rem', fontWeight: 600, color: 'var(--color-heading)' }}>
                        {order.quoteAmount ? `₹${order.quoteAmount.toLocaleString()}` : 'Pending...'}
                      </div>
                    </div>

                    {order.billUrl && (
                      <a href={order.billUrl} target="_blank" rel="noreferrer" className="btn btn-outline" style={{ display: 'inline-block', textAlign: 'center' }}>
                        📄 Download Bill/Invoice
                      </a>
                    )}

                    {order.status === 'Quoted' && (
                      <div style={{ display: 'flex', gap: '1rem', marginTop: 'auto' }}>
                        <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => updateOrder(order._id, { status: 'Accepted' })}>Accept Deal</button>
                        <button className="btn btn-outline" style={{ flex: 1, borderColor: '#f44336', color: '#f44336' }} onClick={() => { if(confirm('Cancel this request?')) updateOrder(order._id, { status: 'Cancelled' }) }}>Reject</button>
                      </div>
                    )}
                  </div>
                )}
                
              </div>

            </div>
          ))
        )}
      </div>
    </>
  );
}
