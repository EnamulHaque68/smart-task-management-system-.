import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export default function Modal({ isOpen, onClose, title, children, footer, maxWidth = '560px' }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(15, 23, 42, 0.5)',
      backdropFilter: 'blur(4px)',
      padding: '1rem',
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        width: '100%',
        maxWidth,
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        border: '1px solid #e2e8f0',
        animation: 'fadeIn 0.2s ease-out',
      }}>
        {/* Modal Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid #f1f5f9',
        }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1e3a8a' }}>
            {title}
          </h2>
          <button
            onClick={onClose}
            style={{
              color: '#94a3b8',
              padding: '6px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#0f172a'; e.currentTarget.style.backgroundColor = '#f1f5f9'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.backgroundColor = 'transparent'; }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{
          padding: '1.5rem',
          overflowY: 'auto',
          flex: 1,
        }}>
          {children}
        </div>

        {/* Modal Footer */}
        {footer && (
          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '12px',
            padding: '1rem 1.5rem',
            borderTop: '1px solid #f1f5f9',
            backgroundColor: '#fafbfc',
            borderBottomLeftRadius: '16px',
            borderBottomRightRadius: '16px',
          }}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
