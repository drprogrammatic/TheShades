'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadUser() {
      const redirectTarget = typeof window !== 'undefined'
        ? `${window.location.pathname}${window.location.search}`
        : pathname;
      const token = localStorage.getItem('token');
      if (!token) {
        router.push(`/login?redirect=${encodeURIComponent(redirectTarget)}`);
        return;
      }

      try {
        const res = await fetch('/api/auth/me');
        if (!res.ok) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          document.cookie = 'token=; path=/; max-age=0';
          router.push(`/login?redirect=${encodeURIComponent(redirectTarget)}`);
          return;
        }

        const data = await res.json();
        if (!active) return;

        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
      } catch (error) {
        if (active) {
          router.push(`/login?redirect=${encodeURIComponent(redirectTarget)}`);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadUser();

    return () => {
      active = false;
    };
  }, [pathname, router]);

  const handleLogout = (event) => {
    event.preventDefault();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    document.cookie = 'token=; path=/; max-age=0';
    router.push('/login');
  };

  if (loading || !user) {
    return <div className="dashboard-loading-state">Loading dashboard...</div>;
  }

  let links = [];
  if (user.role === 'admin') {
    links = [
      { href: '/dashboard', label: 'Overview' },
      { href: '/dashboard/users', label: 'User Management' },
      { href: '/dashboard/quotes', label: 'Quotes & Orders' },
      { href: '/dashboard/products', label: 'Products' },
      { href: '/dashboard/tickets', label: 'Support Tickets' },
      { href: '/dashboard/blog', label: 'Blog Posts' },
      { href: '/dashboard/pages', label: 'Pages' },
      { href: '/dashboard/ads-txt', label: 'Ads.txt' },
      { href: '/dashboard/categories', label: 'Categories' },
    ];
  } else if (user.role === 'dealer') {
    links = [
      { href: '/dashboard', label: 'Dashboard' },
      { href: '/dashboard/quote-request', label: 'Request Quote' },
      { href: '/dashboard/quotes', label: 'Pending Quotes' },
      { href: '/dashboard/tickets', label: 'Support Tickets' },
      { href: '/products', label: 'Dealer Catalog' },
    ];
  } else {
    links = [
      { href: '/dashboard', label: 'Dashboard' },
      { href: '/products', label: 'Browse Products' },
      { href: '/dashboard/quote-request', label: 'Request Quote' },
      { href: '/dashboard/quotes', label: 'My Orders' },
      { href: '/dashboard/tickets', label: 'Support Tickets' },
    ];
  }

  return (
    <div className="admin-layout">
      <div className="admin-sidebar">
        <div className="admin-sidebar-logo">
          <h2>THE <span style={{ color: '#C9A96E' }}>SHADES</span></h2>
          <span style={{ textTransform: 'capitalize' }}>{user.role} portal</span>
          <strong className="dashboard-sidebar-user">{user.name}</strong>
          <small>{user.email}</small>
        </div>
        <nav className="admin-nav">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className={pathname === link.href ? 'active' : ''}>
              {link.label}
            </Link>
          ))}
          <a href="#" onClick={handleLogout} style={{ marginTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem' }}>
            Logout
          </a>
          <Link href="/" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem' }}>
            Back to website
          </Link>
        </nav>
      </div>
      <div className="admin-main">{children}</div>
    </div>
  );
}
