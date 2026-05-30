'use client';

import { useState } from 'react';
import Link from 'next/link';
import { LOCAL_ASSETS, localizeImagePath } from '@/lib/siteAssets';

const orderStatusClasses = {
  'Pending Quote': 'warning',
  Quoted: 'info',
  Accepted: 'success',
  'In Production': 'info',
  Shipped: 'info',
  Delivered: 'success',
  Cancelled: 'danger',
};

const ticketStatusClasses = {
  Open: 'danger',
  'In Progress': 'warning',
  Resolved: 'success',
};

function formatDate(value) {
  if (!value) return 'Recently';

  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value));
}

function DashboardShell({ title, subtitle, tabs, activeTab, setActiveTab, actions, children }) {
  return (
    <div className="dashboard-shell">
      <div className="dashboard-shell-header">
        <div>
          <p className="dashboard-shell-kicker">Role-based workspace</p>
          <h1>{title}</h1>
          <p className="dashboard-shell-subtitle">{subtitle}</p>
        </div>
        {actions ? <div className="dashboard-shell-actions">{actions}</div> : null}
      </div>

      <div className="dashboard-tabs" role="tablist" aria-label={`${title} sections`}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={activeTab === tab.id ? 'active' : ''}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="dashboard-tab-panel animate-fade-in">{children}</div>
    </div>
  );
}

function MetricCard({ label, value, hint }) {
  return (
    <div className="dashboard-metric-card">
      <span className="dashboard-metric-label">{label}</span>
      <strong className="dashboard-metric-value">{value}</strong>
      {hint ? <p className="dashboard-metric-hint">{hint}</p> : null}
    </div>
  );
}

function StatusBadge({ status, type = 'order' }) {
  const toneMap = type === 'ticket' ? ticketStatusClasses : orderStatusClasses;
  return <span className={`status-badge ${toneMap[status] || 'neutral'}`}>{status}</span>;
}

function SectionCard({ title, description, action, children }) {
  return (
    <section className="dashboard-card">
      <div className="dashboard-card-header">
        <div>
          <h3>{title}</h3>
          {description ? <p>{description}</p> : null}
        </div>
        {action ? <div>{action}</div> : null}
      </div>
      {children}
    </section>
  );
}

function EmptyState({ message, actionLabel, href }) {
  return (
    <div className="dashboard-empty-state">
      <p>{message}</p>
      {href ? (
        <Link href={href} className="btn btn-outline">
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}

function OrdersList({ orders, emptyMessage, href }) {
  if (!orders.length) {
    return <EmptyState message={emptyMessage} actionLabel="Request a quote" href={href} />;
  }

  return (
    <div className="dashboard-list">
      {orders.map((order) => (
        <article key={order._id} className="dashboard-list-item">
          <div>
            <div className="dashboard-list-topline">
              <strong>{order.orderNumber}</strong>
              <StatusBadge status={order.status} />
            </div>
            <p className="dashboard-list-meta">
              {order.products?.map((product) => product.name).join(', ') || 'Custom request'}
            </p>
            <p className="dashboard-list-submeta">
              Updated {formatDate(order.updatedAt || order.createdAt)}
              {order.quoteAmount ? ` • Quote: Rs ${order.quoteAmount.toLocaleString('en-IN')}` : ''}
            </p>
          </div>
          <Link href="/dashboard/quotes" className="dashboard-inline-link">
            Open
          </Link>
        </article>
      ))}
    </div>
  );
}

function TicketsList({ tickets, emptyMessage }) {
  if (!tickets.length) {
    return <EmptyState message={emptyMessage} actionLabel="Open support" href="/dashboard/tickets" />;
  }

  return (
    <div className="dashboard-list">
      {tickets.map((ticket) => (
        <article key={ticket._id} className="dashboard-list-item">
          <div>
            <div className="dashboard-list-topline">
              <strong>{ticket.subject}</strong>
              <StatusBadge status={ticket.status} type="ticket" />
            </div>
            <p className="dashboard-list-meta">{ticket.ticketNumber}</p>
            <p className="dashboard-list-submeta">Opened {formatDate(ticket.createdAt)}</p>
          </div>
          <Link href="/dashboard/tickets" className="dashboard-inline-link">
            View
          </Link>
        </article>
      ))}
    </div>
  );
}

function ProductGrid({ products, emptyMessage }) {
  if (!products.length) {
    return <EmptyState message={emptyMessage} actionLabel="Browse catalog" href="/products" />;
  }

  return (
    <div className="dashboard-product-grid">
      {products.map((product) => (
        <article key={product._id || product.slug} className="dashboard-product-card">
          <div className="dashboard-product-media">
            <img src={localizeImagePath(product.images?.[0], LOCAL_ASSETS.placeholder)} alt={product.name} />
            {product.isB2B ? <span className="dashboard-product-pill">B2B only</span> : null}
          </div>
          <div className="dashboard-product-body">
            <p>{product.category}</p>
            <h4>{product.name}</h4>
            <span>{product.price || 'Quote on request'}</span>
            <div className="dashboard-product-actions">
              <Link href={`/products/${product.categorySlug}/${product.slug}`} className="btn btn-outline">
                View details
              </Link>
              <Link href={`/dashboard/quote-request?product=${product._id || ''}`} className="btn btn-primary">
                Request quote
              </Link>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

function AccountPanel({ user, label }) {
  return (
    <SectionCard title="Account details" description="Your primary profile information used for quotes and support.">
      <div className="dashboard-account-grid">
        <div>
          <span>Name</span>
          <strong>{user?.name || 'Not set'}</strong>
        </div>
        <div>
          <span>Email</span>
          <strong>{user?.email || 'Not set'}</strong>
        </div>
        <div>
          <span>Phone</span>
          <strong>{user?.phone || 'Add in profile later'}</strong>
        </div>
        <div>
          <span>{label}</span>
          <strong>{user?.company || 'Not provided'}</strong>
        </div>
      </div>
    </SectionCard>
  );
}

export function CustomerView({ user, orders = [], tickets = [], loading }) {
  const [activeTab, setActiveTab] = useState('overview');
  const activeOrders = orders.filter((order) => !['Cancelled', 'Delivered'].includes(order.status));
  const openTickets = tickets.filter((ticket) => ticket.status !== 'Resolved');

  return (
    <DashboardShell
      title={`Welcome, ${user?.name?.split(' ')[0] || 'Customer'}`}
      subtitle="Track custom quotes, revisit your latest requests, and keep support conversations in one place."
      tabs={[
        { id: 'overview', label: 'Overview' },
        { id: 'orders', label: 'My Orders' },
        { id: 'tickets', label: 'My Tickets' },
      ]}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      actions={<Link href="/dashboard/quote-request" className="btn btn-primary">Request Quote</Link>}
    >
      {activeTab === 'overview' ? (
        <>
          <div className="dashboard-metric-grid">
            <MetricCard label="Active requests" value={loading ? '...' : activeOrders.length} hint="Quotes and live orders currently in motion." />
            <MetricCard label="Open tickets" value={loading ? '...' : openTickets.length} hint="Support conversations still awaiting closure." />
            <MetricCard label="Completed orders" value={loading ? '...' : orders.filter((order) => order.status === 'Delivered').length} hint="Projects marked delivered." />
          </div>

          <div className="dashboard-content-grid">
            <SectionCard title="Recent orders" description="A quick look at the latest order and quote activity." action={<Link href="/dashboard/quotes" className="dashboard-inline-link">See all</Link>}>
              <OrdersList orders={orders.slice(0, 3)} emptyMessage="No orders yet. Start with a product quote request." href="/dashboard/quote-request" />
            </SectionCard>

            <AccountPanel user={user} label="Company" />
          </div>

          <SectionCard title="Support pulse" description="Recent conversations with the support team." action={<Link href="/dashboard/tickets" className="dashboard-inline-link">Open tickets</Link>}>
            <TicketsList tickets={tickets.slice(0, 3)} emptyMessage="No tickets raised yet. You can reach support anytime from the tickets page." />
          </SectionCard>
        </>
      ) : null}

      {activeTab === 'orders' ? (
        <SectionCard title="My orders and quotes" description="Every request in one timeline.">
          <OrdersList orders={orders} emptyMessage="You haven't created any orders or quote requests yet." href="/dashboard/quote-request" />
        </SectionCard>
      ) : null}

      {activeTab === 'tickets' ? (
        <SectionCard title="My support tickets" description="Open new issues and follow existing ones from the dedicated support page.">
          <TicketsList tickets={tickets} emptyMessage="No support tickets yet." />
        </SectionCard>
      ) : null}
    </DashboardShell>
  );
}

export function DealerView({ user, orders = [], tickets = [], b2bProducts = [], loading }) {
  const [activeTab, setActiveTab] = useState('overview');
  const pendingQuotes = orders.filter((order) => ['Pending Quote', 'Quoted'].includes(order.status));
  const openTickets = tickets.filter((ticket) => ticket.status !== 'Resolved');

  return (
    <DashboardShell
      title={`${user?.company || user?.name || 'Dealer'} workspace`}
      subtitle="Manage quote pipelines, monitor dealer-specific products, and stay close to your ongoing B2B support needs."
      tabs={[
        { id: 'overview', label: 'Overview' },
        { id: 'quotes', label: 'Pending Quotes' },
        { id: 'catalog', label: 'B2B Products' },
        { id: 'support', label: 'Support' },
      ]}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      actions={<Link href="/dashboard/quote-request" className="btn btn-primary">Request Bulk Quote</Link>}
    >
      {activeTab === 'overview' ? (
        <>
          <div className="dashboard-metric-grid">
            <MetricCard label="Pending quotes" value={loading ? '...' : pendingQuotes.length} hint="Requests that still need pricing or approval." />
            <MetricCard label="B2B products" value={loading ? '...' : b2bProducts.length} hint="Dealer-exclusive catalog items available to quote." />
            <MetricCard label="Open tickets" value={loading ? '...' : openTickets.length} hint="Support threads still active." />
          </div>

          <div className="dashboard-content-grid">
            <SectionCard title="Quote pipeline" description="Your most recent high-priority quote activity." action={<Link href="/dashboard/quotes" className="dashboard-inline-link">Manage quotes</Link>}>
              <OrdersList orders={pendingQuotes.slice(0, 4)} emptyMessage="No pending quotes right now." href="/dashboard/quote-request" />
            </SectionCard>

            <AccountPanel user={user} label="Business" />
          </div>

          <SectionCard title="Dealer-only catalog" description="Products marked for B2B access and bulk sales.">
            <ProductGrid products={b2bProducts.slice(0, 3)} emptyMessage="No B2B products are published yet." />
          </SectionCard>
        </>
      ) : null}

      {activeTab === 'quotes' ? (
        <SectionCard title="Pending quotes" description="Requests that still need pricing, approval, or production action.">
          <OrdersList orders={pendingQuotes} emptyMessage="You're all caught up. No pending quotes at the moment." href="/dashboard/quote-request" />
        </SectionCard>
      ) : null}

      {activeTab === 'catalog' ? (
        <SectionCard title="B2B products" description="Use these products for faster dealer quote creation and bulk requests.">
          <ProductGrid products={b2bProducts} emptyMessage="Dealer-only products will appear here once published." />
        </SectionCard>
      ) : null}

      {activeTab === 'support' ? (
        <div className="dashboard-content-grid">
          <SectionCard title="Support tickets" description="Ticket visibility for your current installations and dealer follow-ups.">
            <TicketsList tickets={tickets} emptyMessage="No support conversations yet." />
          </SectionCard>
          <AccountPanel user={user} label="Business" />
        </div>
      ) : null}
    </DashboardShell>
  );
}

export function AdminView({ user, orders = [], tickets = [], users = [], products = [], stats = {}, loading }) {
  const [activeTab, setActiveTab] = useState('overview');
  const pendingQuotes = orders.filter((order) => ['Pending Quote', 'Quoted'].includes(order.status));
  const openTickets = tickets.filter((ticket) => ticket.status !== 'Resolved');
  const recentUsers = users.slice(0, 5);

  return (
    <DashboardShell
      title={`Admin control for ${user?.name || 'The Shades'}`}
      subtitle="Keep the catalog, user roles, support queue, and quote pipeline in sync across both B2B and B2C journeys."
      tabs={[
        { id: 'overview', label: 'Overview' },
        { id: 'orders', label: 'Orders' },
        { id: 'users', label: 'Users' },
        { id: 'tickets', label: 'Tickets' },
      ]}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      actions={
        <>
          <Link href="/dashboard/products" className="btn btn-outline">Manage Catalog</Link>
          <Link href="/dashboard/users" className="btn btn-primary">Manage Users</Link>
        </>
      }
    >
      {activeTab === 'overview' ? (
        <>
          <div className="dashboard-metric-grid">
            <MetricCard label="Products" value={loading ? '...' : stats.products ?? products.length} hint={`${stats.b2bProducts ?? 0} marked as B2B-only.`} />
            <MetricCard label="Customers" value={loading ? '...' : stats.customers ?? 0} hint={`${stats.dealers ?? 0} dealer accounts approved.`} />
            <MetricCard label="Open tickets" value={loading ? '...' : openTickets.length} hint="Support items needing team attention." />
            <MetricCard label="Pending quotes" value={loading ? '...' : pendingQuotes.length} hint="Quotes still awaiting action." />
          </div>

          <div className="dashboard-content-grid">
            <SectionCard
              title="Business pulse"
              description="Top-level counts across content and commerce."
              action={<Link href="/dashboard/quotes" className="dashboard-inline-link">Open order desk</Link>}
            >
              <div className="dashboard-account-grid">
                <div>
                  <span>Categories</span>
                  <strong>{stats.categories ?? 0}</strong>
                </div>
                <div>
                  <span>Blog posts</span>
                  <strong>{stats.posts ?? 0}</strong>
                </div>
                <div>
                  <span>Published products</span>
                  <strong>{products.filter((product) => product.published).length}</strong>
                </div>
                <div>
                  <span>Draft products</span>
                  <strong>{products.filter((product) => !product.published).length}</strong>
                </div>
              </div>
            </SectionCard>

            <SectionCard title="Registration path" description="Current operational note for dealer access.">
              <div className="dashboard-note">
                <strong>Dealer onboarding is admin-reviewed.</strong>
                <p>
                  New signups still enter as customer accounts. Upgrade approved business accounts from the user management screen when you're ready to grant dealer access.
                </p>
              </div>
            </SectionCard>
          </div>

          <div className="dashboard-content-grid">
            <SectionCard title="Recent quote activity" description="Latest requests across all users." action={<Link href="/dashboard/quotes" className="dashboard-inline-link">View all</Link>}>
              <OrdersList orders={orders.slice(0, 4)} emptyMessage="No orders have been created yet." href="/dashboard/quote-request" />
            </SectionCard>

            <SectionCard title="Recent users" description="Customers and dealers added most recently." action={<Link href="/dashboard/users" className="dashboard-inline-link">Manage roles</Link>}>
              {recentUsers.length ? (
                <div className="dashboard-list">
                  {recentUsers.map((account) => (
                    <article key={account._id} className="dashboard-list-item">
                      <div>
                        <div className="dashboard-list-topline">
                          <strong>{account.name}</strong>
                          <span className="status-badge neutral">{account.role}</span>
                        </div>
                        <p className="dashboard-list-meta">{account.email}</p>
                        <p className="dashboard-list-submeta">Joined {formatDate(account.createdAt)}</p>
                      </div>
                      <Link href="/dashboard/users" className="dashboard-inline-link">
                        Review
                      </Link>
                    </article>
                  ))}
                </div>
              ) : (
                <EmptyState message="No customer or dealer accounts found yet." actionLabel="Open users" href="/dashboard/users" />
              )}
            </SectionCard>
          </div>
        </>
      ) : null}

      {activeTab === 'orders' ? (
        <SectionCard title="All quotes and orders" description="Full visibility into customer and dealer quote activity.">
          <OrdersList orders={orders} emptyMessage="No orders or quotes are currently in the system." href="/dashboard/quote-request" />
        </SectionCard>
      ) : null}

      {activeTab === 'users' ? (
        <SectionCard title="User approvals" description="Review role mix and continue manual dealer promotion.">
          {users.length ? (
            <div className="dashboard-list">
              {users.map((account) => (
                <article key={account._id} className="dashboard-list-item">
                  <div>
                    <div className="dashboard-list-topline">
                      <strong>{account.name}</strong>
                      <span className="status-badge neutral">{account.role}</span>
                    </div>
                    <p className="dashboard-list-meta">{account.email}</p>
                    <p className="dashboard-list-submeta">{account.company || 'No company provided'}</p>
                  </div>
                  <Link href="/dashboard/users" className="dashboard-inline-link">
                    Open
                  </Link>
                </article>
              ))}
            </div>
          ) : (
            <EmptyState message="No users available for review." actionLabel="Open users" href="/dashboard/users" />
          )}
        </SectionCard>
      ) : null}

      {activeTab === 'tickets' ? (
        <SectionCard title="Support oversight" description="Monitor unresolved issues and respond directly from the support desk.">
          <TicketsList tickets={tickets} emptyMessage="Support tickets will appear here when customers or dealers raise them." />
        </SectionCard>
      ) : null}
    </DashboardShell>
  );
}
