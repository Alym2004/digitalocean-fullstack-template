import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';

function App() {
  const apiBase = useMemo(() => import.meta.env.VITE_API_URL || '/api', []);
  const [items, setItems] = useState([]);
  const [name, setName] = useState('');
  const [status, setStatus] = useState('Loading...');
  const [error, setError] = useState('');

  const loadItems = async () => {
    setError('');
    try {
      const response = await fetch(`${apiBase}/items`);
      if (!response.ok) throw new Error('Failed to load items');
      const data = await response.json();
      setItems(data);
      setStatus('Connected to backend and database');
    } catch (err) {
      setStatus('Connection problem');
      setError(err.message);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch(`${apiBase}/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to add item');
      }

      setName('');
      await loadItems();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>DigitalOcean Full-Stack Demo</h1>
        <p style={styles.subtitle}>Frontend + Backend API + PostgreSQL + Nginx reverse proxy</p>
        <p style={styles.status}>Status: {status}</p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Add new item"
            style={styles.input}
          />
          <button type="submit" style={styles.button}>Add</button>
        </form>

        {error ? <p style={styles.error}>{error}</p> : null}

        <div style={styles.list}>
          {items.length === 0 ? (
            <p style={styles.empty}>No items yet.</p>
          ) : (
            items.map((item) => (
              <div key={item.id} style={styles.item}>
                <strong>{item.name}</strong>
                <small>{new Date(item.created_at).toLocaleString()}</small>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    display: 'grid',
    placeItems: 'center',
    fontFamily: 'Arial, sans-serif',
    background: '#f4f7fb',
    padding: 20
  },
  card: {
    width: 'min(800px, 100%)',
    background: 'white',
    borderRadius: 20,
    padding: 28,
    boxShadow: '0 10px 30px rgba(0,0,0,0.08)'
  },
  title: { margin: 0, fontSize: 32 },
  subtitle: { marginTop: 8, color: '#555' },
  status: {
    padding: '10px 14px',
    background: '#eef6ff',
    borderRadius: 12,
    display: 'inline-block'
  },
  form: { display: 'flex', gap: 12, marginTop: 20, marginBottom: 20 },
  input: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    border: '1px solid #ccc',
    fontSize: 16
  },
  button: {
    padding: '14px 18px',
    borderRadius: 12,
    border: 'none',
    background: '#2563eb',
    color: 'white',
    fontSize: 16,
    cursor: 'pointer'
  },
  error: {
    color: '#b91c1c',
    background: '#fee2e2',
    padding: 12,
    borderRadius: 12
  },
  list: { display: 'grid', gap: 10, marginTop: 20 },
  item: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 12,
    padding: 14,
    border: '1px solid #e5e7eb',
    borderRadius: 12
  },
  empty: { color: '#666' }
};

createRoot(document.getElementById('root')).render(<App />);
