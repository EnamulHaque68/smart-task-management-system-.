import React from 'react';
import { AlertCircle } from 'lucide-react';

export default function ValidationAlert({ errors = [], message }) {
  if (!message && (!errors || errors.length === 0)) return null;

  return (
    <div style={{
      backgroundColor: '#fef2f2',
      border: '1px solid #fecaca',
      borderRadius: '10px',
      padding: '1rem 1.25rem',
      marginBottom: '1.25rem',
      color: '#991b1b',
      fontSize: '0.875rem',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '700', fontSize: '0.95rem' }}>
        <AlertCircle size={18} color="#dc2626" />
        <span>Form Error</span>
      </div>
      <p style={{ marginTop: '4px', color: '#b91c1c', fontSize: '0.85rem' }}>
        {message || 'Errors exist for one or more form fields'}
      </p>
      {errors && errors.length > 0 && (
        <ul style={{ marginTop: '8px', paddingLeft: '1.25rem', fontSize: '0.825rem' }}>
          {errors.map((err, idx) => (
            <li key={idx} style={{ marginTop: '2px' }}>
              {err.message || err}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
