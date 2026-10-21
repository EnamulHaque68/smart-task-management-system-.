import React from 'react';

export default function ProgressBar({ completed = 0, total = 0, percentage }) {
  const percent = percentage !== undefined 
    ? percentage 
    : (total > 0 ? Math.round((completed / total) * 100) : 0);

  return (
    <div style={{ width: '100%' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '0.8rem',
        fontWeight: '600',
        marginBottom: '6px',
        color: '#475569',
      }}>
        <span>Progress</span>
        <span style={{ color: '#0f172a', fontWeight: '700' }}>{percent}%</span>
      </div>
      <div style={{
        width: '100%',
        height: '6px',
        backgroundColor: '#e2e8f0',
        borderRadius: '9999px',
        overflow: 'hidden',
      }}>
        <div style={{
          width: `${Math.min(Math.max(percent, 0), 100)}%`,
          height: '100%',
          backgroundColor: '#2563eb',
          borderRadius: '9999px',
          transition: 'width 0.4s ease-in-out',
        }} />
      </div>
      {total > 0 && (
        <div style={{
          fontSize: '0.75rem',
          color: '#64748b',
          marginTop: '6px',
        }}>
          {completed}/{total} tasks completed
        </div>
      )}
    </div>
  );
}
