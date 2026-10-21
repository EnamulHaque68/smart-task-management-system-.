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
  ArrowLeft,
  ExternalLink,
  Info,
  Clock,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth.jsx';
import { getTasksApi } from '../api/tasks.js';
import { getMessagesApi } from '../api/messages.js';

export default function Navbar({ title, subtitle, onSearch, searchValue = '' }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Profile Menu State
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Notification Popover State
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null); // null = list view, notif object = detail view
  const [activeTab, setActiveTab] = useState('all'); // 'all' or 'unread'
  const notificationRef = useRef(null);

  // Notifications State with rich details
  const [notifications, setNotifications] = useState([
    {
      id: 'default-1',
      title: 'New Team Message',
      desc: 'Sarah Wilson sent an update in #general-sprint-updates',
      details: 'Sarah Wilson: "Hey team, I have prepared the initial marketing collateral for review! Let me know if any changes are needed before publishing." Check out the conversation in team messages.',
      time: '5m ago',
      date: 'Today at 4:30 PM',
      unread: true,
      type: 'message',
      link: '/messages',
      actionLabel: 'Open Messages & Reply',
      source: 'Team Chat',
    },
    {
      id: 'default-2',
      title: 'Task Overdue Alert',
      desc: '"Review Security Guidelines" passed its due date',
      details: 'This task was scheduled for delivery on March 5, 2026. Current status is "In Progress" and assigned to John Doe. Immediate team review is recommended.',
      time: '1h ago',
      date: 'Today at 3:15 PM',
      unread: true,
      type: 'alert',
      link: '/tasks',
      actionLabel: 'View in Kanban Task Board',
      source: 'Task Engine',
    },
    {
      id: 'default-3',
      title: 'Milestone Progress',
      desc: 'Website Redesign project reached 29% overall completion',
      details: '2 out of 7 tasks in project "Website Redesign" have been marked as Completed. Next upcoming milestone: "Implement CRM Integration".',
      time: '3h ago',
      date: 'Today at 1:20 PM',
      unread: true,
      type: 'project',
      link: '/projects',
      actionLabel: 'View Project Details',
      source: 'Project Milestone',
    },
    {
      id: 'default-4',
      title: 'System Health Check',
      desc: 'PostgreSQL bright_mind_db connected and healthy',
      details: 'PostgreSQL 18 connection pool is active and operational. Average response time: 2ms. Centralized error logger active.',
      time: 'Today',
      date: 'Today at 9:00 AM',
      unread: false,
      type: 'system',
      link: '/dashboard',
      actionLabel: 'Open Live Dashboard',
      source: 'Database Health',
    },
  ]);

  // Sync real overdue tasks and recent messages into notifications
  useEffect(() => {
    let isMounted = true;

    const fetchLiveAlerts = async () => {
      try {
        const [tasksRes, messagesRes] = await Promise.allSettled([
          getTasksApi(),
          getMessagesApi(5),
        ]);

        if (!isMounted) return;

        const newItems = [];

        // Check for live overdue tasks
        if (tasksRes.status === 'fulfilled' && tasksRes.value?.tasks) {
          const now = new Date();
          const overdueTasks = tasksRes.value.tasks.filter((t) => {
            if (t.status === 'Completed' || !t.due_date) return false;
            return new Date(t.due_date) < now;
          });

          if (overdueTasks.length > 0) {
            newItems.push({
              id: `task-overdue-live`,
              title: `${overdueTasks.length} Overdue Task${overdueTasks.length > 1 ? 's' : ''} Pending`,
              desc: `Task "${overdueTasks[0].title}" requires immediate review.`,
              details: `There are currently ${overdueTasks.length} overdue tasks in your workspace. Earliest overdue task: "${overdueTasks[0].title}" (Priority: ${overdueTasks[0].priority}, Status: ${overdueTasks[0].status}). Check the Kanban board to reschedule or complete.`,
              time: 'Live',
              date: 'Just now',
              unread: true,
              type: 'alert',
              link: '/tasks',
              actionLabel: 'View Overdue Tasks',
              source: 'Task System',
            });
          }
        }

        // Check for live recent messages from other users
        if (messagesRes.status === 'fulfilled' && messagesRes.value?.messages) {
          const recentMsgs = messagesRes.value.messages.filter(
            (m) => m.sender_name && m.sender_name !== user?.name
          );
          if (recentMsgs.length > 0) {
            const latest = recentMsgs[0];
            newItems.push({
              id: `msg-live-${latest.id}`,
              title: `Message from ${latest.sender_name}`,
              desc: latest.message_text ? latest.message_text.slice(0, 50) + '...' : 'Shared an attachment',
              details: `${latest.sender_name} wrote: "${latest.message_text || 'Sent an attachment'}" at ${new Date(latest.created_at).toLocaleTimeString()}`,
              time: 'Recent',
              date: new Date(latest.created_at).toLocaleTimeString(),
              unread: true,
              type: 'message',
              link: '/messages',
              actionLabel: 'Open Team Messages',
              source: 'Chat Room',
            });
          }
        }

        if (newItems.length > 0) {
          setNotifications((prev) => {
            // Filter out existing ones with matching IDs
            const existingIds = new Set(newItems.map((item) => item.id));
            const retained = prev.filter((item) => !existingIds.has(item.id));
            return [...newItems, ...retained];
          });
        }
      } catch (err) {
        // Silently fall back to defaults
      }
    };

    fetchLiveAlerts();
    return () => {
      isMounted = false;
    };
  }, [user?.name]);

  const unreadCount = notifications.filter((n) => n.unread).length;
  const totalCount = notifications.length;

  const displayedNotifications = notifications.filter((n) => {
    if (activeTab === 'unread') return n.unread;
    return true;
  });

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsMenuOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(e.target)) {
        setIsNotificationOpen(false);
        setSelectedNotification(null);
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
    setSelectedNotification(null);
  };

  // Click on a notification to view its full details and mark as read
  const handleOpenDetails = (notif) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notif.id ? { ...n, unread: false } : n))
    );
    setSelectedNotification({ ...notif, unread: false });
  };

  const handleActionClick = (link) => {
    setIsNotificationOpen(false);
    setSelectedNotification(null);
    if (link) navigate(link);
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
    <header className="navbar-header">
      {/* Page Title & Breadcrumb */}
      <div>
        <h1
          className="navbar-title"
          style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.02em' }}
        >
          {title}
        </h1>
        {subtitle && (
          <p
            className="navbar-subtitle"
            style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '2px' }}
          >
            {subtitle}
          </p>
        )}
      </div>

      {/* Right Controls: Search, Bell Notification, and User Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
        {/* Global / Section Search Input */}
        <div className="navbar-search-box">
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

        {/* Notification Bell with Responsive Numeric Badge & Popover */}
        <div ref={notificationRef} style={{ position: 'relative' }}>
          <button
            type="button"
            onClick={() => {
              setIsNotificationOpen(!isNotificationOpen);
              setSelectedNotification(null);
              setIsMenuOpen(false);
            }}
            title={`Notifications: ${unreadCount} unread, ${totalCount} total`}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: isNotificationOpen ? '#eff6ff' : '#f8fafc',
              border: isNotificationOpen ? '1px solid #93c5fd' : '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: isNotificationOpen ? '#2563eb' : '#475569',
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
            <Bell size={19} />

            {/* Total Numeric Value Badge on Bell Icon */}
            {unreadCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  minWidth: '20px',
                  height: '20px',
                  padding: '0 5px',
                  backgroundColor: '#ef4444',
                  borderRadius: '9999px',
                  border: '2px solid #ffffff',
                  color: '#ffffff',
                  fontSize: '0.68rem',
                  fontWeight: '800',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 6px rgba(239, 68, 68, 0.45)',
                  lineHeight: 1,
                  animation: 'pulseBadge 2.5s infinite ease-in-out',
                }}
              >
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </button>

          {/* Mobile Backdrop Overlay (Allows tapping outside to close on mobile) */}
          {isNotificationOpen && (
            <div
              className="notification-mobile-backdrop"
              onClick={() => {
                setIsNotificationOpen(false);
                setSelectedNotification(null);
              }}
            />
          )}

          {/* Responsive Notification Popover Card */}
          {isNotificationOpen && (
            <div className="notification-popover">
              {/* Conditional View: Detail View OR List View */}
              {selectedNotification ? (
                /* --- Notification Details View ("click kore details dakabe") --- */
                <div>
                  {/* Detail View Header */}
                  <div style={{
                    padding: '12px 16px',
                    borderBottom: '1px solid #f1f5f9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: '#fafbfc',
                  }}>
                    <button
                      type="button"
                      onClick={() => setSelectedNotification(null)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '0.8rem',
                        color: '#2563eb',
                        fontWeight: '700',
                        cursor: 'pointer',
                        padding: '5px 10px',
                        borderRadius: '8px',
                        backgroundColor: '#eff6ff',
                        border: '1px solid #dbeafe',
                        transition: 'background-color 0.15s ease',
                      }}
                    >
                      <ArrowLeft size={14} />
                      <span>Back to all</span>
                    </button>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.75rem', color: '#64748b' }}>
                      <Clock size={13} color="#94a3b8" />
                      <span>{selectedNotification.date}</span>
                    </div>
                  </div>

                  {/* Detail Body */}
                  <div style={{ padding: '1.25rem', maxHeight: '380px', overflowY: 'auto' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '14px' }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '12px',
                        backgroundColor: '#f1f5f9',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}>
                        {getNotificationIcon(selectedNotification.type)}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          display: 'inline-block',
                          fontSize: '0.7rem',
                          fontWeight: '700',
                          color: '#2563eb',
                          backgroundColor: '#eff6ff',
                          padding: '2px 8px',
                          borderRadius: '9999px',
                          marginBottom: '4px',
                          textTransform: 'uppercase',
                        }}>
                          {selectedNotification.source}
                        </div>
                        <h4 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0f172a', lineHeight: 1.3 }}>
                          {selectedNotification.title}
                        </h4>
                      </div>
                    </div>

                    {/* Detailed Content Box */}
                    <div style={{
                      backgroundColor: '#f8fafc',
                      borderRadius: '12px',
                      padding: '1.1rem',
                      border: '1px solid #e2e8f0',
                      fontSize: '0.875rem',
                      color: '#334155',
                      lineHeight: 1.6,
                      marginBottom: '1.25rem',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                    }}>
                      {selectedNotification.details || selectedNotification.desc}
                    </div>

                    {/* Direct Action Link Button */}
                    <button
                      type="button"
                      onClick={() => handleActionClick(selectedNotification.link)}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        padding: '11px',
                        borderRadius: '10px',
                        background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                        color: '#ffffff',
                        fontSize: '0.9rem',
                        fontWeight: '700',
                        boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)',
                        cursor: 'pointer',
                        transition: 'transform 0.1s ease',
                      }}
                      onMouseDown={(e) => {
                        e.currentTarget.style.transform = 'scale(0.98)';
                      }}
                      onMouseUp={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                    >
                      <span>{selectedNotification.actionLabel || 'Open Details'}</span>
                      <ExternalLink size={16} />
                    </button>
                  </div>
                </div>
              ) : (
                /* --- Notification List View --- */
                <div>
                  {/* Popover Header with Total Numeric Count & Unread Badge */}
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
                      {/* Total Numeric Badge in Header */}
                      <span style={{
                        backgroundColor: unreadCount > 0 ? '#ef4444' : '#10b981',
                        color: '#ffffff',
                        fontSize: '0.7rem',
                        fontWeight: '800',
                        padding: '2px 8px',
                        borderRadius: '9999px',
                      }}>
                        {unreadCount > 0 ? `${unreadCount} unread` : `${totalCount} total`}
                      </span>
                    </div>

                    {unreadCount > 0 && (
                      <button
                        type="button"
                        onClick={handleMarkAllRead}
                        style={{
                          fontSize: '0.75rem',
                          color: '#2563eb',
                          fontWeight: '700',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <Check size={13} />
                        <span>Mark all read</span>
                      </button>
                    )}
                  </div>

                  {/* Filter Tabs: All (X) vs Unread (Y) */}
                  <div style={{
                    display: 'flex',
                    borderBottom: '1px solid #f1f5f9',
                    padding: '0 16px',
                    gap: '12px',
                    backgroundColor: '#ffffff',
                  }}>
                    <button
                      type="button"
                      onClick={() => setActiveTab('all')}
                      style={{
                        padding: '8px 4px',
                        fontSize: '0.8rem',
                        fontWeight: activeTab === 'all' ? '800' : '600',
                        color: activeTab === 'all' ? '#2563eb' : '#64748b',
                        borderBottom: activeTab === 'all' ? '2px solid #2563eb' : '2px solid transparent',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      All ({totalCount})
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('unread')}
                      style={{
                        padding: '8px 4px',
                        fontSize: '0.8rem',
                        fontWeight: activeTab === 'unread' ? '800' : '600',
                        color: activeTab === 'unread' ? '#2563eb' : '#64748b',
                        borderBottom: activeTab === 'unread' ? '2px solid #2563eb' : '2px solid transparent',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      Unread ({unreadCount})
                    </button>
                  </div>

                  {/* List Body */}
                  <div style={{ maxHeight: '360px', overflowY: 'auto' }}>
                    {displayedNotifications.length === 0 ? (
                      <div style={{ padding: '2.5rem 1rem', textAlign: 'center', color: '#94a3b8' }}>
                        <div style={{ fontSize: '1.75rem', marginBottom: '6px' }}>🎉</div>
                        <div style={{ fontWeight: '800', fontSize: '0.95rem', color: '#0f172a' }}>
                          {activeTab === 'unread' ? 'No unread notifications!' : 'All caught up!'}
                        </div>
                        <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px' }}>
                          {activeTab === 'unread'
                            ? 'You have viewed all pending notifications.'
                            : 'No alerts or notifications in your workspace.'}
                        </p>
                      </div>
                    ) : (
                      displayedNotifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => handleOpenDetails(n)}
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
                            width: '36px',
                            height: '36px',
                            borderRadius: '10px',
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
                              <span style={{ fontSize: '0.875rem', fontWeight: n.unread ? '800' : '700', color: '#0f172a' }}>
                                {n.title}
                              </span>
                              <span style={{ fontSize: '0.7rem', color: '#94a3b8', whiteSpace: 'nowrap' }}>{n.time}</span>
                            </div>
                            <p style={{
                              fontSize: '0.8rem',
                              color: '#64748b',
                              marginTop: '2px',
                              lineHeight: 1.35,
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                            }}>
                              {n.desc}
                            </p>
                            <span style={{ fontSize: '0.72rem', color: '#2563eb', fontWeight: '700', marginTop: '4px', display: 'inline-block' }}>
                              Click to view details →
                            </span>
                          </div>

                          {/* Unread dot */}
                          {n.unread && (
                            <span style={{
                              width: '8px',
                              height: '8px',
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

                  {/* Footer with Clear All and Total Count */}
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
                          fontWeight: '700',
                          cursor: 'pointer',
                        }}
                      >
                        <Trash2 size={13} />
                        <span>Clear all</span>
                      </button>

                      <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '600' }}>
                        Total: {totalCount} notifications
                      </span>
                    </div>
                  )}
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
              setSelectedNotification(null);
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

            {/* User Name & Email (Responsive: hidden on small mobile) */}
            <div className="navbar-user-text">
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
