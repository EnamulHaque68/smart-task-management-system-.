import React from 'react';
import { NavLink } from 'react-router-dom';
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
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth.jsx';

export default function Sidebar() {
  const { logout } = useAuth();

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Tasks', path: '/tasks', icon: CheckSquare },
    { label: 'Projects', path: '/projects', icon: FolderKanban },
    { label: 'Analytics', path: '/analytics', icon: BarChart2 },
    { label: 'Calendar', path: '/calendar', icon: Calendar },
    { label: 'Team Members', path: '/team', icon: Users },
    { label: 'Reports', path: '/reports', icon: FileText },
    { label: 'Messages', path: '/messages', icon: MessageSquare, badge: '5' },
  ];

  const generalItems = [
    { label: 'Settings', path: '/settings', icon: Settings },
    { label: 'Help & Support', path: '/support', icon: HelpCircle },
  ];

  return (
    <aside style={{
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
      zIndex: 100,
    }}>
      {/* Brand Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '0 0.75rem',
        marginBottom: '2rem',
      }}>
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
                    {item.badge && (
                      <span style={{
                        backgroundColor: '#ef4444',
                        color: '#ffffff',
                        fontSize: '0.7rem',
                        fontWeight: '700',
                        padding: '2px 7px',
                        borderRadius: '9999px',
                      }}>
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
            onClick={logout}
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
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fef2f2'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Upgrade to Pro Card */}
      <div style={{
        marginTop: '1rem',
        padding: '1.25rem',
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
        <div style={{ fontWeight: '700', fontSize: '0.9rem', color: '#0f172a' }}>
          Upgrade to Pro
        </div>
        <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px', lineHeight: 1.4 }}>
          Unlock advanced analytics and manage unlimited projects.
        </p>
        <button
          onClick={() => alert('Upgrade to Pro simulated for Bright Mind Ltd')}
          style={{
            marginTop: '10px',
            width: '100%',
            padding: '8px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
            color: '#ffffff',
            fontSize: '0.8rem',
            fontWeight: '600',
            boxShadow: '0 4px 10px rgba(37, 99, 235, 0.25)',
            cursor: 'pointer',
          }}
        >
          Upgrade Now
        </button>
      </div>
    </aside>
  );
}
