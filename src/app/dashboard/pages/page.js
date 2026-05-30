'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const defaultPages = [
  { slug: 'about', title: 'About Us' },
  { slug: 'contact', title: 'Contact' },
  { slug: 'privacy-policy', title: 'Privacy Policy' },
  { slug: 'terms', title: 'Terms & Conditions' },
];

const emptyForm = {
  title: '',
  slug: '',
  content: '',
  metaTitle: '',
  metaDescription: '',
  published: true,
};

export default function AdminPagesPage() {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editPage, setEditPage] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      router.push('/login');
      return;
    }
    loadPages();
  }, [router]);

  async function loadPages() {
    try {
      const res = await fetch('/api/pages');
      if (res.ok) {
        const data = await res.json();
        setPages(data.pages || []);
      }
    } catch (err) {
      console.error('Error loading pages:', err);
    } finally {
      setLoading(false);
    }
  }

  function startCreate() {
    setEditPage(null);
    setForm(emptyForm);
    setShowForm(true);
    setMessage('');
  }

  function startEdit(page) {
    setEditPage(page);
    setForm({
      title: page.title || '',
      slug: page.slug || '',
      content: page.content || '',
      metaTitle: page.metaTitle || '',
      metaDescription: page.metaDescription || '',
      published: page.published !== false,
    });
    setShowForm(true);
    setMessage('');
  }

  async function initDefaultPages() {
    setSaving(true);
    try {
      for (const dp of defaultPages) {
        const exists = pages.find(p => p.slug === dp.slug);
        if (!exists) {
          await fetch('/api/pages', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              title: dp.title,
              slug: dp.slug,
              content: '',
              published: true,
            }),
          });
        }
      }
      setMessage('Default pages created successfully!');
      loadPages();
    } catch (err) {
      setMessage('Error: ' + err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);

    const slug = form.slug || form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const body = { ...form, slug };

    try {
      let res;
      if (editPage) {
        res = await fetch('/api/pages', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editPage._id, ...body }),
        });
      } else {
        res = await fetch('/api/pages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
      }

      if (res.ok) {
        setMessage(editPage ? 'Page updated!' : 'Page created!');
        setShowForm(false);
        setEditPage(null);
        setForm(emptyForm);
        loadPages();
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

  async function handleDelete(page) {
    if (!confirm(`Delete "${page.title}"? This cannot be undone.`)) return;

    try {
      await fetch('/api/pages', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: page._id }),
      });
      setMessage('Page deleted.');
      loadPages();
    } catch (err) {
      setMessage('Error: ' + err.message);
    }
  }

  return (
    <>
      <div className="admin-header">
        <div>
          <h1>Page Management</h1>
          <p style={{ color: 'var(--color-text-muted)' }}>
            Edit website content for About, Contact, Privacy Policy, Terms, or create new pages.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          {!loading && pages.length === 0 && (
            <button className="btn btn-outline" onClick={initDefaultPages} disabled={saving}>
              {saving ? 'Creating...' : 'Init Default Pages'}
            </button>
          )}
          <button className="btn btn-primary" onClick={showForm ? () => { setShowForm(false); setEditPage(null); } : startCreate}>
            {showForm ? 'Close Form' : 'New Page'}
          </button>
        </div>
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

      {showForm && (
        <div className="dashboard-card" style={{ marginBottom: '2rem' }}>
          <div className="dashboard-card-header">
            <h3>{editPage ? `Editing: ${editPage.title}` : 'Create New Page'}</h3>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label>Page Title *</label>
                <input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g. About Us" />
              </div>
              <div className="form-group">
                <label>URL Slug *</label>
                <input required value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} placeholder="e.g. about" />
                <small style={{ color: 'var(--color-text-muted)' }}>This determines the URL: /{form.slug || 'your-page'}</small>
              </div>
            </div>

            <div className="form-group">
              <label>Page Content (HTML supported)</label>
              <textarea
                rows={20}
                value={form.content}
                onChange={e => setForm({ ...form, content: e.target.value })}
                placeholder="Enter your page content here. You can use HTML tags for formatting."
                style={{ fontFamily: 'monospace', fontSize: '0.9rem', lineHeight: '1.6' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label>SEO Meta Title</label>
                <input value={form.metaTitle} onChange={e => setForm({ ...form, metaTitle: e.target.value })} placeholder="Page title for search engines" />
              </div>
              <div className="form-group">
                <label>SEO Meta Description</label>
                <input value={form.metaDescription} onChange={e => setForm({ ...form, metaDescription: e.target.value })} placeholder="Brief description for search results" />
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginTop: '0.5rem' }}>
              <label className="dashboard-toggle" style={{ paddingTop: 0 }}>
                <input type="checkbox" checked={form.published} onChange={e => setForm({ ...form, published: e.target.checked })} />
                <span>Published</span>
              </label>

              <div style={{ display: 'flex', gap: '1rem', marginLeft: 'auto' }}>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Saving...' : editPage ? 'Update Page' : 'Create Page'}
                </button>
                <button type="button" className="btn btn-outline" onClick={() => { setShowForm(false); setEditPage(null); }}>
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      <table className="admin-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Slug</th>
            <th>Status</th>
            <th>Last Updated</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan={5} style={{ textAlign: 'center', padding: '2rem' }}>Loading pages...</td></tr>
          ) : !pages.length ? (
            <tr><td colSpan={5} style={{ textAlign: 'center', padding: '2rem' }}>
              No pages yet. Click "Init Default Pages" to create About, Contact, Privacy Policy, and Terms pages.
            </td></tr>
          ) : (
            pages.map(page => (
              <tr key={page._id}>
                <td><strong>{page.title}</strong></td>
                <td style={{ fontFamily: 'monospace', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>/{page.slug}</td>
                <td>
                  <span style={{
                    background: page.published ? '#e8f5e9' : '#fff3e0',
                    color: page.published ? '#2e7d32' : '#e65100',
                    padding: '3px 10px',
                    borderRadius: '12px',
                    fontSize: '0.8rem',
                    fontWeight: 500,
                  }}>
                    {page.published ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                  {page.updatedAt ? new Date(page.updatedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                </td>
                <td className="admin-actions">
                  <button className="btn-edit" onClick={() => startEdit(page)}>Edit</button>
                  <button className="btn-delete" onClick={() => handleDelete(page)}>Delete</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </>
  );
}
