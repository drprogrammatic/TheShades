'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ImageUploader from '@/components/dashboard/ImageUploader';

const emptyForm = {
  title: '',
  slug: '',
  content: '',
  excerpt: '',
  featuredImage: '',
  tags: '',
  metaTitle: '',
  metaDescription: '',
  published: true,
  author: 'The Shades Team',
};

export default function AdminBlogPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editPost, setEditPost] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const router = useRouter();

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      router.push('/login');
      return;
    }

    loadPosts();
  }, [router]);

  function loadPosts() {
    fetch('/api/blog?scope=all')
      .then((response) => response.json())
      .then((data) => {
        setPosts(data.posts || []);
        setLoading(false);
      });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const slug = form.slug || form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const body = {
      ...form,
      slug,
      tags: typeof form.tags === 'string'
        ? form.tags.split(',').map((tag) => tag.trim()).filter(Boolean)
        : form.tags,
    };

    const method = editPost ? 'PUT' : 'POST';
    const url = editPost ? `/api/blog/${editPost.slug}` : '/api/blog';

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    setShowForm(false);
    setEditPost(null);
    setForm(emptyForm);
    loadPosts();
  }

  async function handleDelete(slug) {
    if (!confirm('Delete this post?')) return;
    await fetch(`/api/blog/${slug}`, { method: 'DELETE' });
    loadPosts();
  }

  function startEdit(post) {
    setEditPost(post);
    setForm({
      ...post,
      tags: Array.isArray(post.tags) ? post.tags.join(', ') : post.tags || '',
    });
    setShowForm(true);
  }

  return (
    <>
      <div className="admin-header">
        <h1>Blog Posts</h1>
        <button className="btn btn-primary" onClick={() => { setShowForm((value) => !value); setEditPost(null); }}>
          {showForm ? 'Cancel' : 'New Post'}
        </button>
      </div>

      {showForm ? (
        <div className="dashboard-card" style={{ marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>{editPost ? 'Edit Post' : 'New Post'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Title *</label>
              <input required value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} />
            </div>
            <div className="form-group">
              <label>Excerpt</label>
              <textarea rows={2} value={form.excerpt} onChange={(event) => setForm({ ...form, excerpt: event.target.value })} />
            </div>
            <div className="form-group">
              <label>Content *</label>
              <textarea required rows={15} value={form.content} onChange={(event) => setForm({ ...form, content: event.target.value })} style={{ fontFamily: 'monospace', fontSize: '0.9rem' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label>Featured Image</label>
                <ImageUploader value={form.featuredImage} onChange={(url) => setForm({ ...form, featuredImage: url })} />
              </div>
              <div className="form-group">
                <label>Tags</label>
                <input value={form.tags} onChange={(event) => setForm({ ...form, tags: event.target.value })} placeholder="blinds, design, trends" />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label>SEO Meta Title</label>
                <input value={form.metaTitle} onChange={(event) => setForm({ ...form, metaTitle: event.target.value })} />
              </div>
              <div className="form-group">
                <label>SEO Meta Description</label>
                <input value={form.metaDescription} onChange={(event) => setForm({ ...form, metaDescription: event.target.value })} />
              </div>
            </div>
            <label className="dashboard-toggle" style={{ paddingTop: 0, marginBottom: '1rem' }}>
              <input type="checkbox" checked={form.published} onChange={(event) => setForm({ ...form, published: event.target.checked })} />
              <span>Published</span>
            </label>
            <button type="submit" className="btn btn-primary">{editPost ? 'Update Post' : 'Publish Post'}</button>
          </form>
        </div>
      ) : null}

      <table className="admin-table">
        <thead>
          <tr><th>Title</th><th>Author</th><th>Published</th><th>Date</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan={5} style={{ textAlign: 'center', padding: '2rem' }}>Loading...</td></tr>
          ) : !posts.length ? (
            <tr><td colSpan={5} style={{ textAlign: 'center', padding: '2rem' }}>No posts yet</td></tr>
          ) : (
            posts.map((post) => (
              <tr key={post._id || post.slug}>
                <td><strong>{post.title}</strong></td>
                <td>{post.author}</td>
                <td>{post.published ? 'Yes' : 'Draft'}</td>
                <td>{new Date(post.createdAt).toLocaleDateString()}</td>
                <td className="admin-actions">
                  <button className="btn-edit" onClick={() => startEdit(post)}>Edit</button>
                  <button className="btn-delete" onClick={() => handleDelete(post.slug)}>Delete</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </>
  );
}
