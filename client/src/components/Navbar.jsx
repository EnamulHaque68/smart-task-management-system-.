import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Bell,
  ChevronDown,
  LogOut,
  User,
  ShieldCheck,
  Building2,
  CheckCircle2,
  AlertTriangle,
  MessageSquare,
  FolderKanban,
  Check,
  Trash2,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth.jsx';

export default function Navbar({ title, subtitle, onSearch, searchValue = '' }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Profile Menu State
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Notification Popover State
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const notificationRef = useRef(null);

  // Notifications State
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'New Team Message',
      desc: 'Sarah Wilson sent an update in #general-sprint-updates',
      time: '5m ago',
      unread: true,
      type: 'message',
      link: '/messages',
    },
    {
      id: 2,
      title: 'Task Overdue Alert',
      desc: '"Review Security Guidelines" passed its due date',
      time: '1h ago',
      unread: true,
      type: 'alert',
      link: '/tasks',
    },
    {
      id: 3,
      title: 'Milestone Progress',
      desc: 'Website Redesign project reached 29% overall completion',
      time: '3h ago',
      unread: true,
      type: 'project',
      link: '/projects',
    },
    {
      id: 4,
      title: 'System Health Check',
      desc: 'PostgreSQL bright_mind_db connected and healthy',
      time: 'Today',
      unread: false,
      type: 'system',
      link: '/dashboard',
    },
  ]);

  const unreadCount = notifications.filter((n) => n.unread).length;

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsMenuOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(e.target)) {
        setIsNotificationOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getInitials = (name) => {
    if (!name) return 'BM';
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  const handleLogout = () => {
    setIsMenuOpen(false);
    logout();
  };

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  const handleNotificationClick = (notif) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notif.id ? { ...n, unread: false } : n))
    );
    setIsNotificationOpen(false);
    if (notif.link) {
      navigate(notif.link);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'message':
        return <MessageSquare size={16} color="#2563eb" />;
      case 'alert':
        return <AlertTriangle size={16} color="#ef4444" />;
      case 'project':
        return <FolderKanban size={16} color="#8b5cf6" />;
      case 'system':
      default:
        return <CheckCircle2 size={16} color="#10b981" />;
    }
  };

  return (
    <header style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '1.25rem 2rem',
      backgroundColor: '#ffffff',
      borderBottom: '1px solid #f1f5f9',
      position: 'sticky',
      top: 0,
      zIndex: 90,
    }}>
      {/* Page Title & Breadcrumb */}
      <div>
        <h1 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.02em' }}>
          {title}
        </h1>
        {subtitle && (
          <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '2px' }}>
            {subtitle}
          </p>
        )}
      </div>

      {/* Right Controls: Search, Bell Notification, and User Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {/* Global / Section Search Input */}
        <div style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          backgroundColor: '#f8fafc',
          borderRadius: '9999px',
          border: '1px solid #e2e8f0',
          padding: '6px 14px',
          width: '240px',
        }}>
          <Search size={16} color="#94a3b8" />
          <input
            type="text"
            placeholder="Search here..."
            value={searchValue}
            onChange={(e) => onSearch && onSearch(e.target.value)}
            style={{
              border: 'none',
              background: 'transparent',
              outline: 'none',
              fontSize: '0.85rem',
              color: '#0f172a',
              marginLeft: '8px',
              width: '100%',
            }}
          />
        </div>

        {/* Notification Bell with Interactive Popover */}
        <div ref={notificationRef} style={{ position: 'relative' }}>
          <button
            type="button"
            onClick={() => {
              setIsNotificationOpen(!isNotificationOpen);
              setIsMenuOpen(false);
            }}
            title="Notifications"
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              backgroundColor: isNotificationOpen ? '#eff6ff' : '#f8fafc',
              border: isNotificationOpen ? '1px solid #93c5fd' : '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: isNotificationOpen ? '#2563eb' : '#64748b',
              cursor: 'pointer',
              position: 'relative',
              outline: 'none',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              if (!isNotificationOpen) e.currentTarget.style.backgroundColor = '#f1f5f9';
            }}
            onMouseLeave={(e) => {
              if (!isNotificationOpen) e.currentTarget.style.backgroundColor = '#f8fafc';
            }}
          >
            <Bell size={18} />

            {/* Red Notification Badge */}
            {unreadCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '2px',
                right: '2px',
                width: '9px',
                height: '9px',
                backgroundColor: '#ef4444',
                borderRadius: '50%',
                border: '2px solid #ffffff',
              }} />
            )}
          </button>

          {/* Notification Popover Card */}
          {isNotificationOpen && (
            <div style={{
              position: 'absolute',
              top: 'calc(100% + 10px)',
              right: 0,
              width: '340px',
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              boxShadow: '0 20px 30px -10px rgba(15, 23, 42, 0.2), 0 4px 6px -2px rgba(15, 23, 42, 0.05)',
              border: '1px solid #e2e8f0',
              zIndex: 100,
              animation: 'fadeIn 0.15s ease-out',
              overflow: 'hidden',
            }}>
              {/* Header */}
              <div style={{
                padding: '12px 16px',
                borderBottom: '1px solid #f1f5f9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: '#fafbfc',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontWeight: '800', fontSize: '0.95rem', color: '#0f172a' }}>
                    Notifications
                  </span>
                  {unreadCount > 0 && (
                    <span style={{
                      backgroundColor: '#eff6ff',
                      color: '#2563eb',
                      fontSize: '0.7rem',
                      fontWeight: '700',
                      padding: '2px 8px',
                      borderRadius: '9999px',
                      border: '1px solid #bfdbfe',
                    }}>
                      {unreadCount} new
                    </span>
                  )}
                </div>

                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={handleMarkAllRead}
                    style={{
                      fontSize: '0.75rem',
                      color: '#2563eb',
                      fontWeight: '600',
                      cursor: 'pointer',
                    }}
                  >
                    Mark all read
                  </button>
                )}
              </div>

              {/* Notification List */}
              <div style={{ maxHeight: '340px', overflowY: 'auto' }}>
                {notifications.length === 0 ? (
                  <div style={{ padding: '2.5rem 1rem', textAlign: 'center', color: '#94a3b8' }}>
                    <div style={{ fontSize: '1.5rem', marginBottom: '6px' }}>🎉</div>
                    <div style={{ fontWeight: '700', fontSize: '0.9rem', color: '#0f172a' }}>All caught up!</div>
                    <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px' }}>
                      No unread alerts or notifications right now.
                    </p>
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => handleNotificationClick(n)}
                      style={{
                        padding: '12px 16px',
                        borderBottom: '1px solid #f8fafc',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '12px',
                        cursor: 'pointer',
                        backgroundColor: n.unread ? '#f8fafc' : '#ffffff',
                        transition: 'background-color 0.15s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#f1f5f9';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = n.unread ? '#f8fafc' : '#ffffff';
                      }}
                    >
                      {/* Icon */}
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        backgroundColor: n.unread ? '#eff6ff' : '#f1f5f9',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}>
                        {getNotificationIcon(n.type)}
                      </div>

                      {/* Content */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px' }}>
                          <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#0f172a' }}>
                            {n.title}
                          </span>
                          <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{n.time}</span>
                        </div>
                        <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px', lineHeight: 1.35 }}>
                          {n.desc}
                        </p>
                      </div>

                      {/* Unread indicator dot */}
                      {n.unread && (
                        <span style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          backgroundColor: '#2563eb',
                          marginTop: '6px',
                          flexShrink: 0,
                        }} />
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              {notifications.length > 0 && (
                <div style={{
                  padding: '8px 16px',
                  borderTop: '1px solid #f1f5f9',
                  backgroundColor: '#fafbfc',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                  <button
                    type="button"
                    onClick={handleClearAll}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '0.75rem',
                      color: '#ef4444',
                      fontWeight: '600',
                      cursor: 'pointer',
                    }}
                  >
                    <Trash2 size={13} />
                    <span>Clear all</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsNotificationOpen(false);
                      navigate('/dashboard');
                    }}
                    style={{
                      fontSize: '0.75rem',
                      color: '#64748b',
                      fontWeight: '600',
                      cursor: 'pointer',
                    }}
                  >
                    View Activity
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* User Profile Pill with Interactive Dropdown Menu */}
        <div ref={menuRef} style={{ position: 'relative' }}>
          <button
            type="button"
            onClick={() => {
              setIsMenuOpen(!isMenuOpen);
              setIsNotificationOpen(false);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '4px 10px 4px 4px',
              borderRadius: '9999px',
              backgroundColor: isMenuOpen ? '#eff6ff' : '#f8fafc',
              border: isMenuOpen ? '1px solid #93c5fd' : '1px solid #e2e8f0',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              outline: 'none',
            }}
            onMouseEnter={(e) => {
              if (!isMenuOpen) e.currentTarget.style.backgroundColor = '#f1f5f9';
            }}
            onMouseLeave={(e) => {
              if (!isMenuOpen) e.currentTarget.style.backgroundColor = '#f8fafc';
            }}
          >
            {/* Avatar Circle */}
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: user?.avatar_color || '#2563eb',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.8rem',
              fontWeight: '700',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            }}>
              {getInitials(user?.name)}
            </div>

            {/* User Name & Email */}
            <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#0f172a', lineHeight: 1.2 }}>
                {user?.name || 'User'}
              </span>
              <span style={{ fontSize: '0.725rem', color: '#64748b', lineHeight: 1.1 }}>
                {user?.email || 'user@brightmind.com'}
              </span>
            </div>

            {/* Chevron Arrow */}
            <ChevronDown
              size={15}
              color={isMenuOpen ? '#2563eb' : '#94a3b8'}
              style={{
                transition: 'transform 0.2s ease',
                transform: isMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              }}
            />
          </button>

          {/* Sleek User Profile Dropdown Menu */}
          {isMenuOpen && (
            <div style={{
              position: 'absolute',
              top: 'calc(100% + 8px)',
              right: 0,
              width: '240px',
              backgroundColor: '#ffffff',
              borderRadius: '14px',
              boxShadow: '0 20px 25px -5px rgba(15, 23, 42, 0.15), 0 8px 10px -6px rgba(15, 23, 42, 0.1)',
              border: '1px solid #e2e8f0',
              padding: '6px',
              zIndex: 100,
              animation: 'fadeIn 0.15s ease-out',
            }}>
              {/* Dropdown Header */}
              <div style={{
                padding: '10px 12px',
                borderBottom: '1px solid #f1f5f9',
                marginBottom: '4px',
              }}>
                <div style={{ fontWeight: '700', fontSize: '0.9rem', color: '#0f172a' }}>
                  {user?.name || 'User'}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>
                  {user?.email || 'user@brightmind.com'}
                </div>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  marginTop: '6px',
                  padding: '2px 8px',
                  borderRadius: '9999px',
                  backgroundColor: '#eff6ff',
                  color: '#2563eb',
                  fontSize: '0.7rem',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                }}>
                  <ShieldCheck size={12} />
                  <span>{user?.role || 'Admin'}</span>
                </div>
              </div>

              {/* Organization Info */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 12px',
                fontSize: '0.8rem',
                color: '#64748b',
                borderBottom: '1px solid #f1f5f9',
                marginBottom: '4px',
              }}>
                <Building2 size={14} color="#94a3b8" />
                <span>Bright Mind Ltd</span>
              </div>

              {/* Prominent Log Out Button */}
              <button
                type="button"
                onClick={handleLogout}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  color: '#ef4444',
                  backgroundColor: '#fef2f2',
                  fontSize: '0.875rem',
                  fontWeight: '700',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'background-color 0.15s ease',
                  border: '1px solid #fecaca',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#fee2e2';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#fef2f2';
                }}
              >
                <LogOut size={16} color="#ef4444" />
                <span>Log Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
