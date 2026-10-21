import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  CheckSquare,
  FolderKanban,
  BarChart2,
  Calendar,
  Users,
  FileText,
  MessageSquare,
  Settings,
  HelpCircle,
  LogOut,
  Layers,
  Sparkles,
  X,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth.jsx';
import { useSidebar } from '../context/SidebarContext.jsx';
import { getMessagesApi } from '../api/messages.js';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const { isSidebarOpen, closeSidebar } = useSidebar();
  const location = useLocation();

  // Dynamic unread message count state
  const [unreadMsgCount, setUnreadMsgCount] = useState(0);

  // Sync unread messages dynamically from database
  useEffect(() => {
    let isMounted = true;

    // If currently on the /messages page, user is actively viewing/reading messages!
    if (location.pathname === '/messages') {
      setUnreadMsgCount(0);
      localStorage.setItem('taskflow_last_read_msg_ts', Date.now().toString());
    }

    const checkUnreadMessages = async () => {
      // Don't show unread count if user is currently inside the chat room
      if (location.pathname === '/messages') {
        if (isMounted) setUnreadMsgCount(0);
        return;
      }

      try {
        const res = await getMessagesApi(50);
        if (!isMounted) return;

        if (res?.messages && Array.isArray(res.messages)) {
          const lastReadTs = parseInt(
            localStorage.getItem('taskflow_last_read_msg_ts') || '0',
            10
          );

          // Count messages sent by OTHER team members after user's last read timestamp
          const newMessages = res.messages.filter((m) => {
            if (m.sender_name && m.sender_name === user?.name) {
              return false; // User's own messages don't count as unread
            }
            if (!lastReadTs) {
              return true; // If never opened, all incoming messages count initially
            }
            const msgTime = new Date(m.created_at).getTime();
            return msgTime > lastReadTs;
          });

          setUnreadMsgCount(newMessages.length);
        }
      } catch (err) {
        // Silently handle if server temporarily unreachable
      }
    };

    // Initial check
    checkUnreadMessages();

    // Live background polling every 3 seconds to keep badge responsive across browsers
    const interval = setInterval(checkUnreadMessages, 3000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [location.pathname, user?.name]);

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Tasks', path: '/tasks', icon: CheckSquare },
    { label: 'Projects', path: '/projects', icon: FolderKanban },
    { label: 'Analytics', path: '/analytics', icon: BarChart2 },
    { label: 'Calendar', path: '/calendar', icon: Calendar },
    { label: 'Team Members', path: '/team', icon: Users },
    { label: 'Reports', path: '/reports', icon: FileText },
    {
      label: 'Messages',
      path: '/messages',
      icon: MessageSquare,
      // Dynamic unread count: NO longer hardcoded! Only displayed when > 0!
      badge: unreadMsgCount > 0 ? (unreadMsgCount > 99 ? '99+' : unreadMsgCount) : null,
    },
  ];

  const generalItems = [
    { label: 'Settings', path: '/settings', icon: Settings },
    { label: 'Help & Support', path: '/support', icon: HelpCircle },
  ];

  return (
    <>
      {/* Mobile Drawer Backdrop Overlay */}
      {isSidebarOpen && (
        <div
          onClick={closeSidebar}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.45)',
            backdropFilter: 'blur(3px)',
            zIndex: 998,
          }}
        />
      )}

      {/* Main Sidebar Element */}
      <aside
        className={`app-sidebar ${isSidebarOpen ? 'open' : ''}`}
        style={{
          width: '260px',
          backgroundColor: '#ffffff',
          borderRight: '1px solid #e2e8f0',
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          position: 'sticky',
          top: 0,
          padding: '1.5rem 1rem',
          userSelect: 'none',
          zIndex: 999,
          transition: 'transform 0.25s ease-in-out',
        }}
      >
        {/* Brand Header with Mobile Close Button */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 0.5rem',
          marginBottom: '1.75rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              backgroundColor: '#2563eb',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 10px rgba(37, 99, 235, 0.35)',
            }}>
              <Layers size={22} />
            </div>
            <div>
              <span style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.02em' }}>
                TaskFlow
              </span>
              <span style={{ display: 'block', fontSize: '0.65rem', fontWeight: '700', color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Bright Mind Ltd
              </span>
            </div>
          </div>

          {/* Close Button on Mobile Drawer */}
          <button
            type="button"
            className="sidebar-close-btn"
            onClick={closeSidebar}
            style={{
              padding: '6px',
              borderRadius: '8px',
              color: '#64748b',
              cursor: 'pointer',
              display: 'none', // Controlled via index.css media queries
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Main Nav Section */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '0 0.75rem', marginBottom: '0.75rem' }}>
            Menu
          </div>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {navItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={closeSidebar}
                  style={({ isActive }) => ({
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    color: isActive ? '#2563eb' : '#475569',
                    backgroundColor: isActive ? '#eff6ff' : 'transparent',
                    fontWeight: isActive ? '700' : '500',
                    fontSize: '0.9rem',
                    transition: 'all 0.15s ease',
                    textDecoration: 'none',
                  })}
                >
                  {({ isActive }) => (
                    <>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Icon size={18} color={isActive ? '#2563eb' : '#64748b'} />
                        <span>{item.label}</span>
                      </div>

                      {/* Dynamic Badge: Displays ONLY if there are real unread items */}
                      {item.badge !== null && item.badge !== undefined && (
                        <span
                          style={{
                            backgroundColor: '#ef4444',
                            color: '#ffffff',
                            fontSize: '0.7rem',
                            fontWeight: '800',
                            padding: '2px 7px',
                            borderRadius: '9999px',
                            minWidth: '20px',
                            textAlign: 'center',
                            boxShadow: '0 2px 5px rgba(239, 68, 68, 0.4)',
                            animation: 'pulseBadge 2.5s infinite ease-in-out',
                          }}
                        >
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* General Nav Section */}
          <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '0 0.75rem', marginTop: '1.75rem', marginBottom: '0.75rem' }}>
            General
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {generalItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={closeSidebar}
                  style={({ isActive }) => ({
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    color: isActive ? '#2563eb' : '#475569',
                    backgroundColor: isActive ? '#eff6ff' : 'transparent',
                    fontSize: '0.9rem',
                    fontWeight: isActive ? '700' : '500',
                    transition: 'all 0.15s ease',
                    textDecoration: 'none',
                  })}
                >
                  {({ isActive }) => (
                    <>
                      <Icon size={18} color={isActive ? '#2563eb' : '#64748b'} />
                      <span>{item.label}</span>
                    </>
                  )}
                </NavLink>
              );
            })}

            {/* Logout Button */}
            <button
              onClick={() => {
                closeSidebar();
                logout();
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 12px',
                borderRadius: '10px',
                color: '#ef4444',
                fontSize: '0.9rem',
                fontWeight: '600',
                textAlign: 'left',
                width: '100%',
                transition: 'background-color 0.15s ease',
                marginTop: '4px',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#fef2f2')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Upgrade to Pro Card */}
        <div style={{
          marginTop: '1rem',
          padding: '1.1rem',
          borderRadius: '14px',
          background: 'linear-gradient(135deg, #f8fafc 0%, #eff6ff 100%)',
          border: '1px solid #dbeafe',
          textAlign: 'center',
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: '#3b82f6',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 8px',
          }}>
            <Sparkles size={16} />
          </div>
          <div style={{ fontWeight: '700', fontSize: '0.85rem', color: '#0f172a' }}>
            Upgrade to Pro
          </div>
          <p style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '2px', lineHeight: 1.35 }}>
            Unlock advanced analytics & team tools.
          </p>
          <button
            onClick={() => alert('Bright Mind Ltd - Pro Plan active')}
            style={{
              marginTop: '8px',
              width: '100%',
              padding: '7px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
              color: '#ffffff',
              fontSize: '0.78rem',
              fontWeight: '600',
              boxShadow: '0 4px 10px rgba(37, 99, 235, 0.25)',
              cursor: 'pointer',
            }}
          >
            Manage Plan
          </button>
        </div>
      </aside>
    </>
  );
}
