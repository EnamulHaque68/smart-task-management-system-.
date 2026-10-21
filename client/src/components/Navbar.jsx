import React from 'react';
import { Search, Bell, ChevronDown } from 'lucide-react';
import { useAuth } from '../hooks/useAuth.jsx';

export default function Navbar({ title, subtitle, onSearch, searchValue = '' }) {
  const { user } = useAuth();

  const getInitials = (name) => {
    if (!name) return 'BM';
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
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

      {/* Right Controls: Search, Bell, User Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        {/* Global / Section Search Input */}
        <div style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          backgroundColor: '#f8fafc',
          borderRadius: '9999px',
          border: '1px solid #e2e8f0',
          padding: '6px 14px',
          width: '260px',
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

        {/* Notification Bell (Matches Image 4) */}
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

        {/* User Profile Pill (Matches Image 4) */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '4px 8px 4px 4px',
          borderRadius: '9999px',
          backgroundColor: '#f8fafc',
          border: '1px solid #e2e8f0',
          cursor: 'pointer',
        }}>
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
          }}>
            {getInitials(user?.name)}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#0f172a', lineHeight: 1.2 }}>
              {user?.name || 'User'}
            </span>
            <span style={{ fontSize: '0.725rem', color: '#64748b', lineHeight: 1.1 }}>
              {user?.email || 'user@brightmind.com'}
            </span>
          </div>
          <ChevronDown size={14} color="#94a3b8" />
        </div>
      </div>
    </header>
  );
}
