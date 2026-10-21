import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar.jsx';
import { useAuth } from '../hooks/useAuth.jsx';
import { getMessagesApi, sendMessageApi } from '../api/messages.js';
import {
  MessageSquare,
  Send,
  Paperclip,
  Image as ImageIcon,
  FileText,
  Download,
  X,
  UploadCloud,
  CheckCircle2,
} from 'lucide-react';

export default function Messages() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  // File / Image Attachment State
  const [attachment, setAttachment] = useState(null); // { fileUrl, fileName, fileType, fileSize }
  const [isDragging, setIsDragging] = useState(false);

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Fetch messages from backend database
  const fetchMessages = async (isInitial = false) => {
    try {
      const res = await getMessagesApi(150);
      setMessages(res.data.messages || []);
      if (isInitial) {
        scrollToBottom();
      }
    } catch (err) {
      console.error('Failed to load messages', err);
    } finally {
      if (isInitial) setLoading(false);
    }
  };

  // Initial load and polling every 2 seconds for real-time multi-browser sync
  useEffect(() => {
    fetchMessages(true);
    const interval = setInterval(() => {
      fetchMessages(false);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    setTimeout(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  // Helper to convert File to base64 Data URL
  const processFile = (file) => {
    if (!file) return;

    // Check size limit: max 8MB
    if (file.size > 8 * 1024 * 1024) {
      alert('File size exceeds 8MB limit. Please select a smaller file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setAttachment({
        fileUrl: e.target.result,
        fileName: file.name,
        fileType: file.type || 'application/octet-stream',
        fileSize: (file.size / 1024).toFixed(1) + ' KB',
      });
    };
    reader.readAsDataURL(file);
  };

  // File input change handler
  const handleFileInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    e.target.value = '';
  };

  // Drag and Drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  // Send Message
  const handleSend = async (e) => {
    if (e) e.preventDefault();
    if (!inputText.trim() && !attachment) return;

    setSending(true);
    try {
      const payload = {
        text: inputText.trim() || null,
        fileUrl: attachment?.fileUrl || null,
        fileName: attachment?.fileName || null,
        fileType: attachment?.fileType || null,
      };

      const res = await sendMessageApi(payload);
      if (res.data?.message) {
        setMessages((prev) => [...prev, res.data.message]);
      }

      setInputText('');
      setAttachment(null);
      scrollToBottom();
      fetchMessages(false);
    } catch (err) {
      alert(err.message || 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <div
      style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <Navbar
        title="Team Messages"
        subtitle="Real-time multi-user communication and file sharing across team members"
      />

      <div style={{ padding: '1.5rem 2rem', flex: 1, display: 'flex', flexDirection: 'column', maxHeight: 'calc(100vh - 90px)' }}>
        {/* Messages Card */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          border: isDragging ? '2px dashed #2563eb' : '1px solid #e2e8f0',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.04)',
          position: 'relative',
        }}>
          {/* Drag Overlay Banner */}
          {isDragging && (
            <div style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: 'rgba(239, 246, 255, 0.92)',
              backdropFilter: 'blur(3px)',
              zIndex: 50,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#1d4ed8',
              pointerEvents: 'none',
            }}>
              <UploadCloud size={48} />
              <div style={{ fontSize: '1.25rem', fontWeight: '800', marginTop: '12px' }}>
                Drop image or file here
              </div>
              <p style={{ fontSize: '0.875rem', color: '#3b82f6', marginTop: '4px' }}>
                Will be attached to your message
              </p>
            </div>
          )}

          {/* Messages Header */}
          <div style={{
            padding: '1rem 1.5rem',
            borderBottom: '1px solid #f1f5f9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#ffffff',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: '#eff6ff',
                color: '#2563eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <MessageSquare size={18} />
              </div>
              <div>
                <h3 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#0f172a' }}>
                  # general-sprint-updates
                </h3>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  Connected as: <strong style={{ color: '#2563eb' }}>{user?.name || 'User'}</strong>
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                fontSize: '0.75rem',
                backgroundColor: '#ecfdf5',
                color: '#059669',
                padding: '3px 10px',
                borderRadius: '9999px',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981' }} />
                <span>Live Sync Active</span>
              </span>
            </div>
          </div>

          {/* Message List Body */}
          <div style={{
            flex: 1,
            padding: '1.5rem',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            backgroundColor: '#f8fafc',
          }}>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '3rem 0', color: '#94a3b8' }}>
                Loading conversation...
              </div>
            ) : messages.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem 0', color: '#94a3b8' }}>
                No messages yet. Send a message or drop an image below to start the conversation!
              </div>
            ) : (
              messages.map((m) => {
                // Sender check: Does this message belong to the logged-in user?
                const isMe =
                  (m.user_id && user && m.user_id === user.id) ||
                  (m.sender_name && user && m.sender_name.trim().toLowerCase() === user.name.trim().toLowerCase());

                const timeString = m.created_at
                  ? new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  : 'Just now';

                const isImage = m.file_type?.startsWith('image/') || m.file_url?.startsWith('data:image/');

                return (
                  <div
                    key={m.id}
                    style={{
                      display: 'flex',
                      flexDirection: isMe ? 'row-reverse' : 'row',
                      alignItems: 'flex-start',
                      gap: '10px',
                    }}
                  >
                    {/* User Avatar */}
                    <div
                      title={m.sender_name}
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        backgroundColor: m.sender_avatar || '#2563eb',
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.8rem',
                        fontWeight: '700',
                        flexShrink: 0,
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                      }}
                    >
                      {getInitials(m.sender_name)}
                    </div>

                    {/* Chat Bubble Container */}
                    <div style={{ maxWidth: '65%', display: 'flex', flexDirection: 'column', alignItems: isMe ? 'flex-end' : 'flex-start' }}>
                      {/* Sender Info Line */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '0.75rem',
                        color: '#64748b',
                        marginBottom: '3px',
                        padding: '0 4px',
                      }}>
                        <strong style={{ color: isMe ? '#2563eb' : '#0f172a' }}>
                          {isMe ? 'You' : m.sender_name}
                        </strong>
                        <span>{timeString}</span>
                      </div>

                      {/* Bubble Card */}
                      <div style={{
                        backgroundColor: isMe ? '#2563eb' : '#ffffff',
                        color: isMe ? '#ffffff' : '#0f172a',
                        padding: '10px 14px',
                        borderRadius: '14px',
                        borderTopRightRadius: isMe ? '2px' : '14px',
                        borderTopLeftRadius: isMe ? '14px' : '2px',
                        border: isMe ? 'none' : '1px solid #e2e8f0',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                        wordBreak: 'break-word',
                        fontSize: '0.9rem',
                        lineHeight: 1.45,
                      }}>
                        {/* Text message */}
                        {m.text && <div>{m.text}</div>}

                        {/* File or Image Attachment */}
                        {m.file_url && (
                          <div style={{ marginTop: m.text ? '8px' : '0' }}>
                            {isImage ? (
                              <div style={{ borderRadius: '8px', overflow: 'hidden', border: isMe ? '1px solid rgba(255,255,255,0.3)' : '1px solid #e2e8f0' }}>
                                <img
                                  src={m.file_url}
                                  alt={m.file_name || 'Attached Image'}
                                  style={{
                                    maxWidth: '100%',
                                    maxHeight: '260px',
                                    display: 'block',
                                    objectFit: 'contain',
                                    borderRadius: '8px',
                                    backgroundColor: '#000000',
                                  }}
                                />
                                {m.file_name && (
                                  <div style={{
                                    fontSize: '0.75rem',
                                    padding: '4px 6px',
                                    opacity: 0.9,
                                    backgroundColor: isMe ? '#1d4ed8' : '#f8fafc',
                                    color: isMe ? '#ffffff' : '#475569',
                                    textOverflow: 'ellipsis',
                                    overflow: 'hidden',
                                    whiteSpace: 'nowrap',
                                  }}>
                                    📷 {m.file_name}
                                  </div>
                                )}
                              </div>
                            ) : (
                              <a
                                href={m.file_url}
                                download={m.file_name || 'attachment'}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '8px',
                                  padding: '8px 12px',
                                  borderRadius: '8px',
                                  backgroundColor: isMe ? '#1d4ed8' : '#f1f5f9',
                                  color: isMe ? '#ffffff' : '#0f172a',
                                  textDecoration: 'none',
                                  fontSize: '0.85rem',
                                  fontWeight: '600',
                                  border: isMe ? '1px solid rgba(255,255,255,0.2)' : '1px solid #cbd5e1',
                                }}
                              >
                                <FileText size={18} />
                                <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '200px' }}>
                                  {m.file_name || 'Download File'}
                                </span>
                                <Download size={14} style={{ marginLeft: 'auto' }} />
                              </a>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Attachment Preview Box (if user has selected or dragged a file) */}
          {attachment && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '8px 16px',
              backgroundColor: '#eff6ff',
              borderTop: '1px solid #bfdbfe',
              fontSize: '0.85rem',
              color: '#1e40af',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {attachment.fileType.startsWith('image/') ? (
                  <img
                    src={attachment.fileUrl}
                    alt="preview"
                    style={{ width: '32px', height: '32px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #93c5fd' }}
                  />
                ) : (
                  <FileText size={20} color="#2563eb" />
                )}
                <div>
                  <strong style={{ display: 'block', maxWidth: '280px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                    {attachment.fileName}
                  </strong>
                  <span style={{ fontSize: '0.75rem', color: '#3b82f6' }}>{attachment.fileSize}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setAttachment(null)}
                style={{
                  padding: '4px',
                  borderRadius: '50%',
                  color: '#ef4444',
                  backgroundColor: '#fee2e2',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <X size={16} />
              </button>
            </div>
          )}

          {/* Message Input Form */}
          <form
            onSubmit={handleSend}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 14px',
              borderTop: '1px solid #f1f5f9',
              backgroundColor: '#ffffff',
            }}
          >
            {/* Hidden File Input */}
            <input
              ref={fileInputRef}
              type="file"
              style={{ display: 'none' }}
              onChange={handleFileInputChange}
            />

            {/* Paperclip Button for File / Image picker */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              title="Attach an image or file (or drag & drop anywhere)"
              style={{
                padding: '8px',
                borderRadius: '8px',
                color: '#64748b',
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#2563eb';
                e.currentTarget.style.backgroundColor = '#eff6ff';
                e.currentTarget.style.borderColor = '#bfdbfe';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#64748b';
                e.currentTarget.style.backgroundColor = '#f8fafc';
                e.currentTarget.style.borderColor = '#e2e8f0';
              }}
            >
              <Paperclip size={18} />
            </button>

            {/* Text Input Field */}
            <input
              type="text"
              placeholder="Type your message here, or drag & drop files/images..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={sending}
              style={{
                flex: 1,
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontSize: '0.9rem',
                outline: 'none',
                color: '#0f172a',
              }}
            />

            {/* Send Button */}
            <button
              type="submit"
              disabled={sending || (!inputText.trim() && !attachment)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '10px 18px',
                borderRadius: '8px',
                backgroundColor: '#2563eb',
                color: '#ffffff',
                fontWeight: '700',
                fontSize: '0.9rem',
                cursor: sending || (!inputText.trim() && !attachment) ? 'not-allowed' : 'pointer',
                opacity: sending || (!inputText.trim() && !attachment) ? 0.6 : 1,
                boxShadow: '0 2px 6px rgba(37, 99, 235, 0.25)',
                transition: 'all 0.15s ease',
              }}
            >
              <Send size={16} />
              <span>{sending ? 'Sending...' : 'Send'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
