'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminSeoPage() {
  const router = useRouter();

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      router.push('/login');
    }
  }, [router]);

  return (
    <>
      <div className="admin-header">
        <h1>SEO Controls</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div className="dashboard-card">
          <h3 style={{ marginBottom: '1rem' }}>Sitemap</h3>
          <p style={{ color: 'var(--color-text-light)', fontSize: '0.95rem', marginBottom: '1rem' }}>
            Your sitemap is automatically generated at <code>/sitemap.xml</code>. It includes public pages and product routes.
          </p>
          <a href="/sitemap.xml" target="_blank" className="btn btn-outline" rel="noreferrer">View Sitemap</a>
        </div>

        <div className="dashboard-card">
          <h3 style={{ marginBottom: '1rem' }}>Robots</h3>
          <p style={{ color: 'var(--color-text-light)', fontSize: '0.95rem', marginBottom: '1rem' }}>
            robots.txt blocks crawlers from admin and API routes while leaving public pages indexable.
          </p>
          <a href="/robots.txt" target="_blank" className="btn btn-outline" rel="noreferrer">View robots.txt</a>
        </div>

        <div className="dashboard-card">
          <h3 style={{ marginBottom: '1rem' }}>Structured Data</h3>
          <p style={{ color: 'var(--color-text-light)', fontSize: '0.95rem' }}>Schema markup is already included for:</p>
          <ul style={{ paddingLeft: '1.5rem', color: 'var(--color-text-light)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
            <li style={{ listStyle: 'disc', marginBottom: '0.3rem' }}>Organization on global pages</li>
            <li style={{ listStyle: 'disc', marginBottom: '0.3rem' }}>Product on product detail pages</li>
            <li style={{ listStyle: 'disc', marginBottom: '0.3rem' }}>FAQ pages when product FAQs exist</li>
          </ul>
        </div>

        <div className="dashboard-card">
          <h3 style={{ marginBottom: '1rem' }}>ads.txt</h3>
          <p style={{ color: 'var(--color-text-light)', fontSize: '0.95rem', marginBottom: '1rem' }}>
            Manage your ads.txt file for AdSense and partner verification.
          </p>
          <Link href="/dashboard/ads-txt" className="btn btn-outline">Edit ads.txt</Link>
        </div>
      </div>

      <div className="dashboard-card" style={{ marginTop: '1.5rem' }}>
        <h3 style={{ marginBottom: '1rem' }}>Per-page SEO</h3>
        <p style={{ color: 'var(--color-text-light)', fontSize: '0.95rem' }}>
          Products and blog posts already support meta title and description fields from their admin editors, so search snippets can be tuned per entry.
        </p>
      </div>
    </>
  );
}
