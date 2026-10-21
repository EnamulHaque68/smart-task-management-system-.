import React, { useState, useRef, useEffect } from 'react';
import { Search, UserCheck, ChevronDown } from 'lucide-react';

export default function AssigneeDropdown({ users = [], selectedUserId, onSelect, disabled = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedUser = users.find((u) => u.id === selectedUserId);

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((part) => part[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div ref={dropdownRef} style={{ position: 'relative', width: '100%' }}>
      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 12px',
          backgroundColor: '#ffffff',
          border: '1px solid #cbd5e1',
          borderRadius: '8px',
          fontSize: '0.875rem',
          color: '#0f172a',
          cursor: disabled ? 'not-allowed' : 'pointer',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {selectedUser ? (
            <>
              <div style={{
                width: '26px',
                height: '26px',
                borderRadius: '50%',
                backgroundColor: selectedUser.avatar_color || '#2563eb',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
                fontWeight: '700',
              }}>
                {getInitials(selectedUser.name)}
              </div>
              <span style={{ fontWeight: '500' }}>{selectedUser.name}</span>
            </>
          ) : (
            <>
              <div style={{
                width: '26px',
                height: '26px',
                borderRadius: '50%',
                backgroundColor: '#f1f5f9',
                color: '#64748b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
              }}>
                <UserCheck size={14} />
              </div>
              <span style={{ color: '#64748b' }}>Unassigned</span>
            </>
          )}
        </div>
        <ChevronDown size={16} color="#94a3b8" />
      </button>

      {/* Dropdown Menu (Matches Image 3) */}
      {isOpen && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 4px)',
          left: 0,
          right: 0,
          zIndex: 1100,
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e2e8f0',
          overflow: 'hidden',
          animation: 'fadeIn 0.15s ease-out',
        }}>
          {/* Search Header */}
          <div style={{
            padding: '8px 12px',
            borderBottom: '1px solid #f1f5f9',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <Search size={16} color="#94a3b8" />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
              style={{
                border: 'none',
                outline: 'none',
                width: '100%',
                fontSize: '0.85rem',
                color: '#0f172a',
              }}
            />
          </div>

          {/* List of Options */}
          <div style={{ maxHeight: '200px', overflowY: 'auto', padding: '4px' }}>
            {/* Unassigned Option */}
            <div
              onClick={() => { onSelect(null); setIsOpen(false); }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '8px 12px',
                borderRadius: '8px',
                cursor: 'pointer',
                backgroundColor: !selectedUserId ? '#f8fafc' : 'transparent',
                fontSize: '0.875rem',
                color: '#475569',
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = !selectedUserId ? '#f8fafc' : 'transparent'}
            >
              <div style={{
                width: '26px',
                height: '26px',
                borderRadius: '50%',
                backgroundColor: '#f1f5f9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#64748b',
              }}>
                <UserCheck size={14} />
              </div>
              <span>Unassigned</span>
            </div>

            {/* Users List */}
            {filteredUsers.map((u) => (
              <div
                key={u.id}
                onClick={() => { onSelect(u.id); setIsOpen(false); }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  backgroundColor: selectedUserId === u.id ? '#eff6ff' : 'transparent',
                  fontSize: '0.875rem',
                  color: '#0f172a',
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = selectedUserId === u.id ? '#eff6ff' : 'transparent'}
              >
                <div style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  backgroundColor: u.avatar_color || '#2563eb',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: '700',
                }}>
                  {getInitials(u.name)}
                </div>
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <div style={{ fontWeight: '500', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                    {u.name}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                    {u.email}
                  </div>
                </div>
              </div>
            ))}

            {filteredUsers.length === 0 && (
              <div style={{ padding: '12px', textAlign: 'center', fontSize: '0.8rem', color: '#94a3b8' }}>
                No members found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
