'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AdminView, CustomerView, DealerView } from '@/components/dashboard/Views';

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [payload, setPayload] = useState({
    orders: [],
    tickets: [],
    users: [],
    products: [],
    stats: {},
  });
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    let active = true;

    async function loadDashboard() {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        const meRes = await fetch('/api/auth/me');
        if (!meRes.ok) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          document.cookie = 'token=; path=/; max-age=0';
          router.push('/login');
          return;
        }

        const meData = await meRes.json();
        if (!active) return;

        localStorage.setItem('user', JSON.stringify(meData.user));
        setUser(meData.user);

        if (meData.user.role === 'admin') {
          const [ordersRes, ticketsRes, usersRes, productsRes, categoriesRes, postsRes] = await Promise.all([
            fetch('/api/orders'),
            fetch('/api/tickets'),
            fetch('/api/users'),
            fetch('/api/products?scope=all'),
            fetch('/api/categories'),
            fetch('/api/blog'),
          ]);

          const [ordersData, ticketsData, usersData, productsData, categoriesData, postsData] = await Promise.all([
            ordersRes.json(),
            ticketsRes.json(),
            usersRes.json(),
            productsRes.json(),
            categoriesRes.json(),
            postsRes.json(),
          ]);

          if (!active) return;

          const products = productsData.products || [];
          const users = usersData.users || [];

          setPayload({
            orders: ordersData.orders || [],
            tickets: ticketsData.tickets || [],
            users,
            products,
            stats: {
              products: products.length,
              b2bProducts: products.filter((product) => product.isB2B).length,
              customers: users.filter((account) => account.role === 'customer').length,
              dealers: users.filter((account) => account.role === 'dealer').length,
              categories: categoriesData.categories?.length || 0,
              posts: postsData.posts?.length || 0,
            },
          });
        } else {
          const [ordersRes, ticketsRes, productsRes] = await Promise.all([
            fetch('/api/orders'),
            fetch('/api/tickets'),
            fetch('/api/products'),
          ]);

          const [ordersData, ticketsData, productsData] = await Promise.all([
            ordersRes.json(),
            ticketsRes.json(),
            productsRes.json(),
          ]);

          if (!active) return;

          setPayload({
            orders: ordersData.orders || [],
            tickets: ticketsData.tickets || [],
            users: [],
            products: productsData.products || [],
            stats: {},
          });
        }
      } catch (error) {
        console.error('Dashboard load failed', error);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadDashboard();

    return () => {
      active = false;
    };
  }, [router]);

  if (!user && loading) {
    return <div className="dashboard-loading-state">Loading your workspace...</div>;
  }

  if (!user) {
    return <div className="dashboard-loading-state">Unable to load dashboard.</div>;
  }

  if (user.role === 'admin') {
    return (
      <AdminView
        user={user}
        orders={payload.orders}
        tickets={payload.tickets}
        users={payload.users}
        products={payload.products}
        stats={payload.stats}
        loading={loading}
      />
    );
  }

  if (user.role === 'dealer') {
    return (
      <DealerView
        user={user}
        orders={payload.orders}
        tickets={payload.tickets}
        b2bProducts={payload.products.filter((product) => product.isB2B)}
        loading={loading}
      />
    );
  }

  return <CustomerView user={user} orders={payload.orders} tickets={payload.tickets} loading={loading} />;
}
