'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminMediaPage() {
  const router = useRouter();

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      router.push('/login');
    }
  }, [router]);

  return (
    <>
      <div className="admin-header"><h1>Media Library</h1></div>
      <div className="dashboard-card" style={{ textAlign: 'center' }}>
        <h3>Media Management</h3>
        <p style={{ color: 'var(--color-text-light)', margin: '1rem 0' }}>
          Product and blog images are currently URL-based. Use a hosted image provider and paste the asset links into the relevant forms.
        </p>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
          If you want local uploads later, the next step is wiring a storage provider such as S3 or Cloudinary.
        </p>
      </div>
    </>
  );
}
