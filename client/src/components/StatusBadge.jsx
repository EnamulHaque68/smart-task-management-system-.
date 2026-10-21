import React from 'react';

export default function StatusBadge({ status }) {
  const getStyle = () => {
    switch (status) {
      case 'Completed':
      case 'Done':
        return { bg: '#ecfdf5', text: '#059669', dot: '#10b981' };
      case 'In Progress':
        return { bg: '#eff6ff', text: '#2563eb', dot: '#3b82f6' };
      case 'At Risk':
        return { bg: '#fef2f2', text: '#dc2626', dot: '#ef4444' };
      case 'To Do':
      case 'Not Started':
      default:
        return { bg: '#f1f5f9', text: '#475569', dot: '#94a3b8' };
    }
  };

  const style = getStyle();

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      padding: '4px 10px',
      borderRadius: '9999px',
      fontSize: '0.75rem',
      fontWeight: '600',
      backgroundColor: style.bg,
      color: style.text,
      letterSpacing: '0.01em',
    }}>
      <span style={{
        width: '6px',
        height: '6px',
        borderRadius: '50%',
        backgroundColor: style.dot,
      }} />
      {status || 'To Do'}
    </span>
  );
}
