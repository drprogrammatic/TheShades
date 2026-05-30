'use client';

import { usePathname } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function AppChrome({ children }) {
  const pathname = usePathname();
  const isDashboardRoute = pathname?.startsWith('/dashboard');

  if (isDashboardRoute) {
    return <main>{children}</main>;
  }

  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
