import React, { useState, useEffect, useContext, useRef } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

const AdminSupportPanel = () => {
  const { API_URL, token } = useContext(AuthContext);
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef(null);

  const fetchChats = async () => {
    try {
      const res = await axios.get(`${API_URL}/admin/support`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setChats(res.data.data);
        if (selectedChat) {
          const updated = res.data.data.find(c => c.user._id === selectedChat.user._id);
          if (updated) setSelectedChat(updated);
        }
      }
    } catch (err) {
      console.error('Failed to load chats', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChats();
    const interval = setInterval(fetchChats, 8000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedChat?.messages]);

  const handleReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedChat) return;
    setSending(true);
    try {
      const res = await axios.post(
        `${API_URL}/admin/support/${selectedChat.user._id}/reply`,
        { text: replyText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        setSelectedChat(res.data.data);
        setReplyText('');
        fetchChats();
      }
    } catch (err) {
      console.error('Reply failed', err);
    } finally {
      setSending(false);
    }
  };

  const handleClose = async (userId) => {
    try {
      await axios.put(`${API_URL}/admin/support/${userId}/close`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchChats();
      if (selectedChat?.user._id === userId) {
        setSelectedChat(prev => ({ ...prev, status: 'closed' }));
      }
    } catch (err) {
      console.error('Close failed', err);
    }
  };

  const formatTime = (date) => new Date(date).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 16, height: '70vh' }}>

      {/* Chat list */}
      <div style={{ border: '0.5px solid #ddd', borderRadius: 12, overflowY: 'auto' }}>
        <div style={{ padding: '12px 16px', borderBottom: '0.5px solid #ddd', fontWeight: 500 }}>
          Support Chats ({chats.length})
        </div>
        {loading ? (
          <p style={{ padding: '1rem', color: '#888', fontSize: 13 }}>Loading...</p>
        ) : chats.length === 0 ? (
          <p style={{ padding: '1rem', color: '#888', fontSize: 13 }}>No chats yet.</p>
        ) : (
          chats.map(chat => (
            <div
              key={chat._id}
              onClick={() => setSelectedChat(chat)}
              style={{
                padding: '12px 16px',
                cursor: 'pointer',
                borderBottom: '0.5px solid #eee',
                background: selectedChat?._id === chat._id ? '#E1F5EE' : 'transparent'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <p style={{ margin: 0, fontWeight: 500, fontSize: 13 }}>{chat.user?.name}</p>
                <span style={{
                  fontSize: 10, padding: '1px 6px', borderRadius: 10,
                  background: chat.status === 'open' ? '#E1F5EE' : '#eee',
                  color: chat.status === 'open' ? '#085041' : '#888'
                }}>
                  {chat.status}
                </span>
              </div>
              <p style={{ margin: '2px 0 0', fontSize: 11, color: '#888' }}>{chat.user?.scholarNumber}</p>
              <p style={{ margin: '3px 0 0', fontSize: 12, color: '#aaa' }}>
                {chat.messages.length > 0
                  ? chat.messages[chat.messages.length - 1].text.slice(0, 35) + '...'
                  : 'No messages'}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Chat window */}
      {selectedChat ? (
        <div style={{ display: 'flex', flexDirection: 'column', border: '0.5px solid #ddd', borderRadius: 12 }}>
          <div style={{ padding: '12px 16px', borderBottom: '0.5px solid #ddd', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ margin: 0, fontWeight: 500 }}>{selectedChat.user?.name}</p>
              <p style={{ margin: 0, fontSize: 12, color: '#888' }}>{selectedChat.user?.email}</p>
            </div>
            {selectedChat.status === 'open' && (
              <button
                onClick={() => handleClose(selectedChat.user._id)}
                style={{ fontSize: 12, padding: '5px 12px', borderRadius: 6, border: '0.5px solid #E24B4A', color: '#E24B4A', background: 'transparent', cursor: 'pointer' }}
              >
                Close Chat
              </button>
            )}
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {selectedChat.messages.map((msg, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.sender === 'admin' ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  maxWidth: '75%', padding: '8px 14px', fontSize: 13, lineHeight: 1.5,
                  borderRadius: msg.sender === 'admin' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                  background: msg.sender === 'admin' ? '#1D9E75' : '#fff',
                  color: msg.sender === 'admin' ? '#fff' : 'inherit',
                  border: msg.sender === 'user' ? '0.5px solid #ddd' : 'none'
                }}>
                  {msg.text}
                </div>
                <span style={{ fontSize: 11, color: '#aaa', marginTop: 2 }}>
                  {msg.sender === 'user' ? selectedChat.user?.name + ' · ' : 'You · '}{formatTime(msg.createdAt)}
                </span>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {selectedChat.status === 'closed' ? (
            <div style={{ padding: '12px 16px', borderTop: '0.5px solid #ddd', fontSize: 13, color: '#888', textAlign: 'center' }}>
              This chat is closed.
            </div>
          ) : (
            <form onSubmit={handleReply} style={{ display: 'flex', gap: 8, padding: '12px 16px', borderTop: '0.5px solid #ddd' }}>
              <input
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Type your reply..."
                style={{ flex: 1, padding: '8px 12px', borderRadius: 8, border: '0.5px solid #ccc', fontSize: 13, background: 'transparent', color: 'inherit' }}
              />
              <button
                type="submit"
                disabled={sending || !replyText.trim()}
                style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: '#1D9E75', color: '#fff', cursor: 'pointer', fontSize: 13 }}
              >
                {sending ? '...' : 'Reply'}
              </button>
            </form>
          )}
        </div>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', border: '0.5px solid #ddd', borderRadius: 12, color: '#aaa', fontSize: 14 }}>
          Select a chat to view messages
        </div>
      )}
    </div>
  );
};

export default AdminSupportPanel;
