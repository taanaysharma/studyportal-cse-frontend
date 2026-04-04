import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

const ManageContributions = () => {
  const { API_URL, token } = useContext(AuthContext);
  const [contributions, setContributions] = useState([]);
  const [filter, setFilter] = useState('pending');
  const [loading, setLoading] = useState(true);
  const [actionNote, setActionNote] = useState({});
  const [message, setMessage] = useState(null);

  const fetchContributions = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/admin/contributions?status=${filter}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) setContributions(res.data.data);
    } catch (err) {
      console.error('Failed to fetch contributions', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchContributions(); }, [filter]);

  const handleAction = async (id, action) => {
    try {
      const res = await axios.put(
        `${API_URL}/admin/contributions/${id}/${action}`,
        { adminNote: actionNote[id] || '' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        setMessage({ type: 'success', text: res.data.message });
        fetchContributions();
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Action failed' });
    }
  };

  const statusColor = (s) => s === 'approved' ? '#1D9E75' : s === 'rejected' ? '#E24B4A' : '#BA7517';

  return (
    <div>
      <h3 style={{ marginBottom: '1rem' }}>Manage Contributions</h3>

      <div style={{ display: 'flex', gap: 8, marginBottom: '1rem' }}>
        {['pending', 'approved', 'rejected'].map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            style={{
              padding: '6px 16px',
              borderRadius: 20,
              border: '0.5px solid #ccc',
              background: filter === s ? '#1D9E75' : 'transparent',
              color: filter === s ? '#fff' : 'inherit',
              cursor: 'pointer',
              fontSize: 13,
              textTransform: 'capitalize'
            }}
          >
            {s}
          </button>
        ))}
      </div>

      {message && (
        <div style={{
          padding: '10px 14px', borderRadius: 8, marginBottom: '1rem',
          background: message.type === 'error' ? '#FCEBEB' : '#E1F5EE',
          color: message.type === 'error' ? '#A32D2D' : '#085041',
          fontSize: 13
        }}>
          {message.text}
        </div>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : contributions.length === 0 ? (
        <p style={{ color: '#888', fontSize: 14 }}>No {filter} contributions.</p>
      ) : (
        <div style={{ display: 'grid', gap: 12 }}>
          {contributions.map(c => (
            <div key={c._id} style={{
              border: '0.5px solid #ddd',
              borderRadius: 12,
              padding: '1rem 1.25rem',
              background: 'var(--color-background-primary, #fff)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8 }}>
                <div>
                  <p style={{ fontWeight: 500, margin: 0 }}>{c.title}</p>
                  <p style={{ fontSize: 12, color: '#888', margin: '3px 0 0' }}>
                    {c.subject?.name} · {c.category} · Sem {c.semester} · {c.fileType}
                  </p>
                  <p style={{ fontSize: 12, color: '#888', margin: '3px 0 0' }}>
                    By: <strong>{c.submittedBy?.name}</strong> ({c.submittedBy?.scholarNumber})
                  </p>
                </div>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  <a
                    href={c.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={{ fontSize: 12, color: '#185FA5', textDecoration: 'underline' }}
                  >
                    Preview File
                  </a>
                  <span style={{
                    fontSize: 11, fontWeight: 500, padding: '2px 8px', borderRadius: 20,
                    background: statusColor(c.status) + '22',
                    color: statusColor(c.status)
                  }}>
                    {c.status}
                  </span>
                </div>
              </div>

              {c.status === 'pending' && (
                <div style={{ marginTop: '0.75rem', display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                  <input
                    type="text"
                    placeholder="Optional note to student..."
                    value={actionNote[c._id] || ''}
                    onChange={(e) => setActionNote(prev => ({ ...prev, [c._id]: e.target.value }))}
                    style={{
                      flex: 1, minWidth: 180, padding: '6px 10px', borderRadius: 6,
                      border: '0.5px solid #ccc', fontSize: 13, background: 'transparent', color: 'inherit'
                    }}
                  />
                  <button
                    onClick={() => handleAction(c._id, 'approve')}
                    style={{ padding: '6px 14px', borderRadius: 6, border: 'none', background: '#1D9E75', color: '#fff', cursor: 'pointer', fontSize: 13 }}
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleAction(c._id, 'reject')}
                    style={{ padding: '6px 14px', borderRadius: 6, border: 'none', background: '#E24B4A', color: '#fff', cursor: 'pointer', fontSize: 13 }}
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageContributions;
