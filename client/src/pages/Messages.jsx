import React, { useState } from 'react';
import Navbar from '../components/Navbar.jsx';
import { MessageSquare, Send, CheckCircle2, User } from 'lucide-react';

export default function Messages() {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'Sarah Wilson', text: 'Hey Alex, I have prepared the initial marketing collateral for review!', time: '10:45 AM', isMe: false, avatar: '#f59e0b' },
    { id: 2, sender: 'Alex Morgan', text: 'Great work Sarah! I will review the copy this afternoon.', time: '10:50 AM', isMe: true, avatar: '#2563eb' },
    { id: 3, sender: 'Mike Fisher', text: 'Just completed the trade show floor plan checklist item.', time: '11:15 AM', isMe: false, avatar: '#10b981' },
    { id: 4, sender: 'John Doe', text: 'Security review is 50% completed on the CRM sync pipeline.', time: '11:42 AM', isMe: false, avatar: '#0d9488' },
  ]);
  const [inputText, setInputText] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    setMessages([
      ...messages,
      {
        id: Date.now(),
        sender: 'Alex Morgan',
        text: inputText.trim(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isMe: true,
        avatar: '#2563eb',
      },
    ]);
    setInputText('');
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <Navbar
        title="Team Messages"
        subtitle="Real-time communication and project updates with team members"
      />

      <div style={{ padding: '2rem', flex: 1, display: 'flex', flexDirection: 'column', maxHeight: 'calc(100vh - 100px)' }}>
        {/* Messages Card */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
        }}>
          {/* Messages Header */}
          <div style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid #f1f5f9',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}>
            <MessageSquare size={20} color="#2563eb" />
            <h3 style={{ fontSize: '1rem', fontWeight: '800', color: '#0f172a' }}>
              # general-sprint-updates
            </h3>
            <span style={{ fontSize: '0.75rem', backgroundColor: '#ecfdf5', color: '#059669', padding: '2px 8px', borderRadius: '9999px', fontWeight: '700' }}>
              ● 5 Active
            </span>
          </div>

          {/* Message List */}
          <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {messages.map((m) => (
              <div
                key={m.id}
                style={{
                  display: 'flex',
                  flexDirection: m.isMe ? 'row-reverse' : 'row',
                  alignItems: 'flex-start',
                  gap: '10px',
                }}
              >
                <div style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  backgroundColor: m.avatar,
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.8rem',
                  fontWeight: '700',
                  flexShrink: 0,
                }}>
                  {m.sender[0]}
                </div>

                <div style={{
                  maxWidth: '65%',
                  backgroundColor: m.isMe ? '#2563eb' : '#f8fafc',
                  color: m.isMe ? '#ffffff' : '#0f172a',
                  padding: '10px 14px',
                  borderRadius: '12px',
                  border: m.isMe ? 'none' : '1px solid #e2e8f0',
                  fontSize: '0.9rem',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', fontSize: '0.75rem', opacity: 0.8, marginBottom: '4px' }}>
                    <strong>{m.sender}</strong>
                    <span>{m.time}</span>
                  </div>
                  <div>{m.text}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Message Input Box */}
          <form onSubmit={handleSend} style={{ display: 'flex', gap: '10px', padding: '1rem 1.5rem', borderTop: '1px solid #f1f5f9', backgroundColor: '#fafbfc' }}>
            <input
              type="text"
              placeholder="Type your message here..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              style={{
                flex: 1,
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontSize: '0.9rem',
                outline: 'none',
              }}
            />
            <button
              type="submit"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '10px 20px',
                borderRadius: '8px',
                backgroundColor: '#2563eb',
                color: '#ffffff',
                fontWeight: '700',
                fontSize: '0.9rem',
                cursor: 'pointer',
              }}
            >
              <Send size={16} />
              <span>Send</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
