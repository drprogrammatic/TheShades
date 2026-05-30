'use client';

import { useState, useEffect } from 'react';

const statusColors = {
  Open: 'danger',
  'In Progress': 'warning',
  Resolved: 'success',
};

export default function TicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState('customer');
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [savingId, setSavingId] = useState('');
  const [filter, setFilter] = useState('All');
  const [form, setForm] = useState({ subject: '', message: '' });
  const [drafts, setDrafts] = useState({});

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    setUserRole(storedUser.role || 'customer');
    loadTickets();
  }, []);

  async function loadTickets() {
    try {
      const res = await fetch('/api/tickets');
      const data = await res.json();
      const loadedTickets = data.tickets || [];

      setTickets(loadedTickets);
      setDrafts(
        loadedTickets.reduce((accumulator, ticket) => {
          accumulator[ticket._id] = {
            status: ticket.status,
            adminResponse: ticket.adminResponse || '',
          };
          return accumulator;
        }, {})
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setForm({ subject: '', message: '' });
        setShowForm(false);
        loadTickets();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  }

  async function saveTicket(ticketId) {
    const draft = drafts[ticketId];
    if (!draft) return;

    setSavingId(ticketId);

    try {
      const res = await fetch('/api/tickets', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: ticketId,
          status: draft.status,
          adminResponse: draft.adminResponse,
        }),
      });

      if (res.ok) {
        await loadTickets();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSavingId('');
    }
  }

  const visibleTickets = filter === 'All' ? tickets : tickets.filter((ticket) => ticket.status === filter);

  return (
    <>
      <div className="admin-header">
        <div>
          <h1>Support Tickets</h1>
          <p style={{ color: 'var(--color-text-muted)' }}>
            {userRole === 'admin'
              ? 'Review and resolve customer and dealer support issues.'
              : 'Open support requests and follow their progress here.'}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div className="dashboard-filter-group">
            {['All', 'Open', 'In Progress', 'Resolved'].map((status) => (
              <button
                key={status}
                type="button"
                className={filter === status ? 'active' : ''}
                onClick={() => setFilter(status)}
              >
                {status}
              </button>
            ))}
          </div>

          {userRole !== 'admin' ? (
            <button className="btn btn-primary" onClick={() => setShowForm((value) => !value)}>
              {showForm ? 'Close ticket form' : 'Open New Ticket'}
            </button>
          ) : null}
        </div>
      </div>

      {showForm ? (
        <div className="dashboard-card" style={{ marginBottom: '2rem' }}>
          <div className="dashboard-card-header">
            <div>
              <h3>Raise a support request</h3>
              <p>Share enough context for the team to respond without back-and-forth.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
            <div className="form-group">
              <label>Subject</label>
              <input
                required
                value={form.subject}
                onChange={(event) => setForm({ ...form, subject: event.target.value })}
                placeholder="Example: Installation delay on living room blinds"
              />
            </div>

            <div className="form-group">
              <label>Details</label>
              <textarea
                required
                rows={5}
                value={form.message}
                onChange={(event) => setForm({ ...form, message: event.target.value })}
                placeholder="Mention product, site location, issue, and preferred resolution."
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={submitting} style={{ justifySelf: 'flex-start' }}>
              {submitting ? 'Submitting...' : 'Submit Ticket'}
            </button>
          </form>
        </div>
      ) : null}

      <div style={{ display: 'grid', gap: '1.5rem' }}>
        {loading ? (
          <div className="dashboard-loading-state">Loading tickets...</div>
        ) : !visibleTickets.length ? (
          <div className="dashboard-card">
            <div className="dashboard-empty-state">
              <p>No tickets found for the selected status.</p>
            </div>
          </div>
        ) : (
          visibleTickets.map((ticket) => {
            const draft = drafts[ticket._id] || { status: ticket.status, adminResponse: ticket.adminResponse || '' };

            return (
              <div key={ticket._id} className="dashboard-card">
                <div className="dashboard-card-header">
                  <div>
                    <div className="dashboard-list-topline" style={{ marginBottom: '0.5rem' }}>
                      <h3 style={{ margin: 0 }}>{ticket.subject}</h3>
                      <span className={`status-badge ${statusColors[ticket.status] || 'neutral'}`}>{ticket.status}</span>
                    </div>
                    <p>{ticket.ticketNumber}</p>
                  </div>
                </div>

                <div className="dashboard-content-grid">
                  <div>
                    {userRole === 'admin' && ticket.user ? (
                      <div className="dashboard-note" style={{ marginBottom: '1rem' }}>
                        <strong>{ticket.user.name}</strong>
                        <p>{ticket.user.email}</p>
                        <p>{ticket.user.company || 'No company listed'}</p>
                      </div>
                    ) : null}

                    <p style={{ lineHeight: 1.8, color: 'var(--color-text)' }}>{ticket.message}</p>

                    {ticket.adminResponse ? (
                      <div className="dashboard-alert success" style={{ marginTop: '1rem' }}>
                        <strong style={{ display: 'block', marginBottom: '0.25rem' }}>Team response</strong>
                        {ticket.adminResponse}
                      </div>
                    ) : null}
                  </div>

                  {userRole === 'admin' ? (
                    <div>
                      <div className="form-group">
                        <label>Status</label>
                        <select
                          value={draft.status}
                          onChange={(event) =>
                            setDrafts({
                              ...drafts,
                              [ticket._id]: { ...draft, status: event.target.value },
                            })
                          }
                        >
                          {['Open', 'In Progress', 'Resolved'].map((status) => (
                            <option key={status}>{status}</option>
                          ))}
                        </select>
                      </div>

                      <div className="form-group">
                        <label>Reply</label>
                        <textarea
                          rows={5}
                          value={draft.adminResponse}
                          onChange={(event) =>
                            setDrafts({
                              ...drafts,
                              [ticket._id]: { ...draft, adminResponse: event.target.value },
                            })
                          }
                          placeholder="Share the latest action, ETA, or resolution."
                        />
                      </div>

                      <button type="button" className="btn btn-primary" onClick={() => saveTicket(ticket._id)} disabled={savingId === ticket._id}>
                        {savingId === ticket._id ? 'Saving...' : 'Save Update'}
                      </button>
                    </div>
                  ) : null}
                </div>
              </div>
            );
          })
        )}
      </div>
    </>
  );
}
