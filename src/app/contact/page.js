'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', service: '', message: '' });
  const [status, setStatus] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('Thank you for your message! Our team will contact you within 24 hours.');
    setForm({ name: '', email: '', phone: '', service: '', message: '' });
  };

  return (
    <>
      <section className="page-header">
        <div className="page-header-content container">
          <div className="breadcrumb">
            <Link href="/">Home</Link><span>/</span>
            <span style={{ color: 'rgba(255,255,255,0.9)' }}>Contact</span>
          </div>
          <h1>Contact Us</h1>
          <p>Get in touch for a free consultation or any enquiries</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="contact-grid">
            <div className="contact-form">
              <h3 style={{ marginBottom: '0.5rem' }}>Send Us a Message</h3>
              <p style={{ color: 'var(--color-text-light)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
                Fill in the form below and we'll get back to you within 24 hours.
              </p>
              {status && (
                <div style={{ background: '#e8f5e9', color: '#2e7d32', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
                  {status}
                </div>
              )}
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Full Name *</label>
                  <input id="name" type="text" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Your name" />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label htmlFor="email">Email Address *</label>
                    <input id="email" type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="you@email.com" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="phone">Phone Number</label>
                    <input id="phone" type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="+91 XXXXX XXXXX" />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="service">Interested In</label>
                  <select id="service" value={form.service} onChange={e => setForm({...form, service: e.target.value})}>
                    <option value="">Select a service...</option>
                    <option>Roller Blinds</option>
                    <option>Zebra Blinds</option>
                    <option>Venetian Blinds</option>
                    <option>Honeycomb Blinds</option>
                    <option>Roman Blinds</option>
                    <option>Curtains & Drapes</option>
                    <option>Wallpapers</option>
                    <option>Wooden Flooring</option>
                    <option>Awnings</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="message">Your Message *</label>
                  <textarea id="message" required value={form.message} onChange={e => setForm({...form, message: e.target.value})} placeholder="Tell us about your project..." />
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Send Message</button>
              </form>
            </div>

            <div>
              <h3 style={{ marginBottom: '1.5rem' }}>Get In Touch</h3>
              <div className="contact-info-list">
                <div className="contact-info-item">
                  <div className="contact-info-icon">📍</div>
                  <div>
                    <h4>Visit Us</h4>
                    <p>3rd Floor, VARDHMAN CROWN MALL,<br />337, Sector 19, Dwarka,<br />Delhi 110075</p>
                  </div>
                </div>
                <div className="contact-info-item">
                  <div className="contact-info-icon">📞</div>
                  <div>
                    <h4>Call Us</h4>
                    <p>+91 9953042031</p>
                  </div>
                </div>
                <div className="contact-info-item">
                  <div className="contact-info-icon">✉️</div>
                  <div>
                    <h4>Email Us</h4>
                    <p>Theshades74@Gmail.com</p>
                  </div>
                </div>
                <div className="contact-info-item">
                  <div className="contact-info-icon">🕐</div>
                  <div>
                    <h4>Business Hours</h4>
                    <p>Monday – Saturday: 10:00 AM – 7:00 PM<br/>Sunday: By appointment only</p>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '2rem', background: 'var(--color-bg-alt)', borderRadius: '12px', padding: '1.5rem' }}>
                <h4 style={{ marginBottom: '0.5rem' }}>Free Home Consultation</h4>
                <p style={{ fontSize: '0.95rem', color: 'var(--color-text-light)', marginBottom: '1rem' }}>
                  Our experts will visit your space, take measurements, and recommend the perfect solutions — absolutely free.
                </p>
                <a href="tel:+919953042031" className="btn btn-primary" style={{ width: '100%' }}>Call Now to Book</a>
              </div>
              <div style={{ marginTop: '1rem', background: 'rgba(201, 169, 110, 0.1)', border: '1px solid rgba(201, 169, 110, 0.2)', borderRadius: '12px', padding: '1.5rem' }}>
                <h4 style={{ marginBottom: '0.5rem' }}>Prefer to Manage It Online?</h4>
                <p style={{ fontSize: '0.95rem', color: 'var(--color-text-light)', marginBottom: '1rem' }}>
                  Create an account to request quotes online, track updates in your dashboard, and raise support tickets whenever you need help.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <Link href="/register" className="btn btn-primary" style={{ width: '100%' }}>Create Account</Link>
                  <Link href="/dashboard" className="btn btn-outline" style={{ width: '100%' }}>Open Dashboard</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
