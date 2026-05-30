'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminCategoriesPage() {
  const router = useRouter();

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      router.push('/login');
    }
  }, [router]);

  return (
    <>
      <div className="admin-header"><h1>Categories</h1></div>
      <div className="dashboard-card" style={{ textAlign: 'center' }}>
        <h3>Category Management</h3>
        <p style={{ color: 'var(--color-text-light)', margin: '1rem 0' }}>
          Categories are pre-configured with your product range. Use the seed flow if you need to reset them or add new category definitions.
        </p>
        <Link href="/dashboard" className="btn btn-primary">Go to Dashboard</Link>
      </div>
    </>
  );
}
