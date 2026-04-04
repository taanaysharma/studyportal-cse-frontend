import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

const ContributeForm = () => {
  const { API_URL, token } = useContext(AuthContext);
  const [subjects, setSubjects] = useState([]);
  const [form, setForm] = useState({ title: '', subject: '', category: '', semester: '' });
  const [file, setFile] = useState(null);
  const [myContributions, setMyContributions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const categories = ['Notes', 'Books', 'PYQs', 'Syllabus'];

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await axios.get(`${API_URL}/subjects`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data.success) setSubjects(res.data.data);
      } catch (err) {
        console.error('Failed to fetch subjects', err);
      }
    };
    const fetchMyContributions = async () => {
      try {
        const res = await axios.get(`${API_URL}/contributions/my`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data.success) setMyContributions(res.data.data);
      } catch (err) {
        console.error('Failed to fetch contributions', err);
      }
    };
    fetchSubjects();
    fetchMyContributions();
  }, [API_URL, token]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected && selected.size > 10 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'File size must be under 10MB.' });
      setFile(null);
      return;
    }
    setFile(selected);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return setMessage({ type: 'error', text: 'Please select a file.' });

    const data = new FormData();
    data.append('file', file);
    data.append('title', form.title);
    data.append('subject', form.subject);
    data.append('category', form.category);
    data.append('semester', form.semester);

    setLoading(true);
    setMessage(null);
    try {
      const res = await axios.post(`${API_URL}/contributions`, data, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      });
      if (res.data.success) {
        setMessage({ type: 'success', text: 'Contribution submitted! Waiting for admin approval.' });
        setForm({ title: '', subject: '', category: '', semester: '' });
        setFile(null);
        setMyContributions(prev => [res.data.data, ...prev]);
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Upload failed.' });
    } finally {
      setLoading(false);
    }
  };

  const statusColor = (status) => {
    if (status === 'approved') return '#1D9E75';
    if (status === 'rejected') return '#E24B4A';
    return '#BA7517';
  };

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: '1rem' }}>
      <h3 style={{ marginBottom: '1rem' }}>Contribute Study Material</h3>
      <p style={{ color: '#888', marginBottom: '1.5rem', fontSize: 14 }}>
        Upload a file (max 10MB). It will be reviewed by the admin before being published.
      </p>

      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
        <input
          type="text"
          name="title"
          placeholder="Material Title"
          value={form.title}
          onChange={handleChange}
          required
          style={inputStyle}
        />

        <select name="semester" value={form.semester} onChange={handleChange} required style={inputStyle}>
          <option value="">Select Semester</option>
          {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>Semester {s}</option>)}
        </select>

        <select name="subject" value={form.subject} onChange={handleChange} required style={inputStyle}>
          <option value="">Select Subject</option>
          {subjects.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
        </select>

        <select name="category" value={form.category} onChange={handleChange} required style={inputStyle}>
          <option value="">Select Category</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        <div>
          <input type="file" accept=".pdf,image/*" onChange={handleFileChange} required />
          <p style={{ fontSize: 12, color: '#888', marginTop: 4 }}>PDF or Image, max 10MB</p>
        </div>

        {message && (
          <div style={{
            padding: '10px 14px',
            borderRadius: 8,
            background: message.type === 'error' ? '#FCEBEB' : '#E1F5EE',
            color: message.type === 'error' ? '#A32D2D' : '#085041',
            fontSize: 13
          }}>
            {message.text}
          </div>
        )}

        <button type="submit" disabled={loading} style={btnStyle}>
          {loading ? 'Uploading...' : 'Submit Contribution'}
        </button>
      </form>

      {myContributions.length > 0 && (
        <div style={{ marginTop: '2rem' }}>
          <h4 style={{ marginBottom: '0.75rem' }}>My Contributions</h4>
          <div style={{ display: 'grid', gap: 10 }}>
            {myContributions.map(c => (
              <div key={c._id} style={{
                background: 'var(--color-background-primary, #fff)',
                border: '0.5px solid #ddd',
                borderRadius: 10,
                padding: '12px 16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <p style={{ fontWeight: 500, margin: 0 }}>{c.title}</p>
                  <p style={{ fontSize: 12, color: '#888', margin: 0 }}>
                    {c.subject?.name} · {c.category} · Sem {c.semester}
                  </p>
                  {c.adminNote && (
                    <p style={{ fontSize: 12, color: '#888', margin: '4px 0 0' }}>Note: {c.adminNote}</p>
                  )}
                </div>
                <span style={{
                  fontSize: 12,
                  fontWeight: 500,
                  padding: '3px 10px',
                  borderRadius: 20,
                  background: statusColor(c.status) + '22',
                  color: statusColor(c.status)
                }}>
                  {c.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const inputStyle = {
  width: '100%',
  padding: '10px 12px',
  borderRadius: 8,
  border: '0.5px solid #ccc',
  fontSize: 14,
  background: 'transparent',
  color: 'inherit'
};

const btnStyle = {
  padding: '10px 20px',
  borderRadius: 8,
  border: '0.5px solid #ccc',
  background: 'transparent',
  fontSize: 14,
  cursor: 'pointer',
  fontWeight: 500
};

export default ContributeForm;
