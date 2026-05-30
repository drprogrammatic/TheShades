'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function UserManagementPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const res = await fetch('/api/users');
      if (res.status === 401) {
        router.push('/dashboard');
        return;
      }
      const data = await res.json();
      setUsers(data.users || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      const res = await fetch('/api/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: userId, role: newRole })
      });
      if (res.ok) {
        loadUsers(); // Refresh list
      }
    } catch (err) {
      console.error('Failed to update role', err);
    }
  };

  return (
    <>
      <div className="admin-header">
        <h1>User Management</h1>
        <p style={{ color: 'var(--color-text-muted)' }}>View and upgrade customers to dealers</p>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Company</th>
            <th>Current Role</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan={6} style={{ textAlign: 'center', padding: '2rem' }}>Loading users...</td></tr>
          ) : users.length === 0 ? (
            <tr><td colSpan={6} style={{ textAlign: 'center', padding: '2rem' }}>No registered users found.</td></tr>
          ) : users.map(u => (
            <tr key={u._id}>
              <td><strong>{u.name}</strong></td>
              <td>{u.email}</td>
              <td>{u.phone || '—'}</td>
              <td>{u.company || '—'}</td>
              <td>
                <span style={{ 
                  background: u.role === 'dealer' ? '#e3f2fd' : '#f5f5f5', 
                  color: u.role === 'dealer' ? '#1565c0' : '#616161',
                  padding: '4px 8px', borderRadius: '4px', fontSize: '0.85rem', textTransform: 'capitalize' 
                }}>
                  {u.role}
                </span>
              </td>
              <td>
                <select 
                  value={u.role} 
                  onChange={(e) => handleRoleChange(u._id, e.target.value)}
                  style={{ padding: '0.3rem', borderRadius: '4px', border: '1px solid var(--color-border)' }}
                >
                  <option value="customer">Customer</option>
                  <option value="dealer">Dealer</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
