'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const categories = [
  { name: 'Roller Blinds', slug: 'roller-blinds' },
  { name: 'Zebra Blinds', slug: 'zebra-blinds' },
  { name: 'Venetian Blinds', slug: 'venetian-blinds' },
  { name: 'Honeycomb Blinds', slug: 'honeycomb-blinds' },
  { name: 'Roman Blinds', slug: 'roman-blinds' },
  { name: 'Curtains & Drapes', slug: 'curtains-drapes' },
  { name: 'Wallpapers', slug: 'wallpapers' },
  { name: 'Wooden Flooring', slug: 'wooden-flooring' },
  { name: 'Awnings', slug: 'awnings' },
];

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hasSession, setHasSession] = useState(false);

  // Pages that start with a dark hero/page-header behind the nav
  const darkTopPages = ['/', '/products', '/about', '/blog', '/contact'];
  const hasDarkTop = darkTopPages.includes(pathname) || pathname.startsWith('/products/');


  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setHasSession(Boolean(token));
  }, [pathname]);

  const accountHref = hasSession ? '/dashboard' : '/login';
  const accountLabel = hasSession ? 'Dashboard' : 'Login';

  return (
    <>
      <header className={`header ${scrolled ? 'scrolled' : ''} ${!hasDarkTop ? 'light-top' : ''}`}>
        <div className="header-inner">
          <Link href="/" className="logo">
            THE <span>SHADES</span>
          </Link>

          <nav className="nav">
            <Link href="/" className="nav-link">Home</Link>
            <div className="nav-dropdown">
              <Link href="/products" className="nav-link">Products</Link>
              <div className="nav-dropdown-menu">
                {categories.map((category) => (
                  <Link key={category.slug} href={`/products/${category.slug}`}>{category.name}</Link>
                ))}
              </div>
            </div>
            <Link href="/about" className="nav-link">About</Link>
            <Link href="/blog" className="nav-link">Blog</Link>
            <Link href="/contact" className="nav-link">Contact</Link>
            <Link href={accountHref} className="nav-link nav-link-account">{accountLabel}</Link>
          </nav>

          <button className="menu-toggle" onClick={() => setMobileOpen(true)} aria-label="Open menu">
            <span></span><span></span><span></span>
          </button>
        </div>
      </header>

      <div className={`mobile-nav ${mobileOpen ? 'open' : ''}`}>
        <button className="mobile-nav-close" onClick={() => setMobileOpen(false)} aria-label="Close menu">X</button>
        <Link href="/" onClick={() => setMobileOpen(false)}>Home</Link>
        <Link href="/products" onClick={() => setMobileOpen(false)}>Products</Link>
        {categories.map((category) => (
          <Link key={category.slug} href={`/products/${category.slug}`} onClick={() => setMobileOpen(false)} className="mobile-nav-subitem">
            - {category.name}
          </Link>
        ))}
        <Link href="/about" onClick={() => setMobileOpen(false)}>About</Link>
        <Link href="/blog" onClick={() => setMobileOpen(false)}>Blog</Link>
        <Link href="/contact" onClick={() => setMobileOpen(false)}>Contact</Link>
        <Link href={accountHref} onClick={() => setMobileOpen(false)}>{accountLabel}</Link>
      </div>
    </>
  );
}
