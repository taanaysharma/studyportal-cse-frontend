import React, { useState, useEffect, useContext, useRef } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

const SupportChat = () => {
  const { API_URL, token, user } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState('open');
  const bottomRef = useRef(null);

  const fetchChat = async () => {
    try {
      const res = await axios.get(`${API_URL}/support`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setMessages(res.data.data.messages);
        setStatus(res.data.data.status);
      }
    } catch (err) {
      console.error('Failed to load chat', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChat();
    const interval = setInterval(fetchChat, 8000); // poll every 8s
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim() || status === 'closed') return;
    setSending(true);
    try {
      const res = await axios.post(`${API_URL}/support/message`, { text }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setMessages(res.data.data.messages);
        setText('');
      }
    } catch (err) {
      console.error('Failed to send', err);
    } finally {
      setSending(false);
    }
  };

  const formatTime = (date) => new Date(date).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  if (loading) return <p style={{ padding: '1rem', color: '#888' }}>Loading chat...</p>;

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', display: 'flex', flexDirection: 'column', height: '70vh' }}>
      <div style={{ marginBottom: '0.75rem' }}>
        <h3 style={{ margin: 0 }}>Support Chat</h3>
        <p style={{ fontSize: 13, color: '#888', margin: '4px 0 0' }}>
          Send a message to the admin. We typically reply within 24 hours.
          {status === 'closed' && <span style={{ color: '#E24B4A', marginLeft: 8 }}>· Chat closed by admin</span>}
        </p>
      </div>

      <div style={{
        flex: 1,
        overflowY: 'auto',
        border: '0.5px solid #ddd',
        borderRadius: 12,
        padding: '1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        background: 'var(--color-background-secondary, #f9f9f9)'
      }}>
        {messages.length === 0 && (
          <p style={{ color: '#aaa', fontSize: 13, textAlign: 'center', marginTop: '2rem' }}>
            No messages yet. Start the conversation below.
          </p>
        )}
        {messages.map((msg, i) => (
          <div key={i} style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start'
          }}>
            <div style={{
              maxWidth: '75%',
              padding: '8px 14px',
              borderRadius: msg.sender === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
              background: msg.sender === 'user' ? '#1D9E75' : '#fff',
              color: msg.sender === 'user' ? '#fff' : 'inherit',
              border: msg.sender === 'admin' ? '0.5px solid #ddd' : 'none',
              fontSize: 14,
              lineHeight: 1.5
            }}>
              {msg.text}
            </div>
            <span style={{ fontSize: 11, color: '#aaa', marginTop: 2 }}>
              {msg.sender === 'admin' ? 'Admin · ' : ''}{formatTime(msg.createdAt)}
            </span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSend} style={{ display: 'flex', gap: 8, marginTop: 12 }}>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={status === 'closed' ? 'Chat is closed' : 'Type your message...'}
          disabled={status === 'closed' || sending}
          style={{
            flex: 1,
            padding: '10px 14px',
            borderRadius: 8,
            border: '0.5px solid #ccc',
            fontSize: 14,
            background: 'transparent',
            color: 'inherit'
          }}
        />
        <button
          type="submit"
          disabled={status === 'closed' || sending || !text.trim()}
          style={{
            padding: '10px 18px',
            borderRadius: 8,
            border: '0.5px solid #ccc',
            background: 'transparent',
            fontSize: 14,
            cursor: 'pointer',
            fontWeight: 500
          }}
        >
          {sending ? '...' : 'Send'}
        </button>
      </form>
    </div>
  );
};

export default SupportChat;
