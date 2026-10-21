import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, ChevronDown, LogOut, User, ShieldCheck, Building2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth.jsx';

export default function Navbar({ title, subtitle, onSearch, searchValue = '' }) {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Close dropdown menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsMenuOpen(false);
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

      {/* Right Controls: Search, Bell, User Profile & Direct Logout */}
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

        {/* Notification Bell */}
        <div style={{ position: 'relative', cursor: 'pointer' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#64748b',
          }}>
            <Bell size={18} />
          </div>
          <span style={{
            position: 'absolute',
            top: '2px',
            right: '2px',
            width: '8px',
            height: '8px',
            backgroundColor: '#ef4444',
            borderRadius: '50%',
            border: '2px solid #ffffff',
          }} />
        </div>

        {/* User Profile Pill with Interactive Dropdown Menu */}
        <div ref={menuRef} style={{ position: 'relative' }}>
          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
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
                {user?.name || 'Alex Morgan'}
              </span>
              <span style={{ fontSize: '0.725rem', color: '#64748b', lineHeight: 1.1 }}>
                {user?.email || 'demo@brightmind.com'}
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
                  {user?.name || 'Alex Morgan'}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>
                  {user?.email || 'demo@brightmind.com'}
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

        {/* Direct 1-Click Logout Quick Button */}
        <button
          type="button"
          onClick={handleLogout}
          title="Sign out of TaskFlow"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '7px 12px',
            borderRadius: '8px',
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            color: '#64748b',
            fontSize: '0.8rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#fef2f2';
            e.currentTarget.style.borderColor = '#fecaca';
            e.currentTarget.style.color = '#ef4444';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#ffffff';
            e.currentTarget.style.borderColor = '#e2e8f0';
            e.currentTarget.style.color = '#64748b';
          }}
        >
          <LogOut size={14} />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
}
