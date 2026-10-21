import React from 'react';
import { ChevronUp, ChevronsUp, Minus, ChevronDown } from 'lucide-react';

export default function PriorityBadge({ priority }) {
  const getStyle = () => {
    switch (priority) {
      case 'High':
        return { bg: '#fff1f2', text: '#e11d48', icon: <ChevronUp size={14} /> };
      case 'Medium':
        return { bg: '#fffbeb', text: '#d97706', icon: <Minus size={14} /> };
      case 'Low':
      default:
        return { bg: '#f0fdf4', text: '#16a34a', icon: <ChevronDown size={14} /> };
    }
  };

  const style = getStyle();

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
      padding: '4px 8px',
      borderRadius: '6px',
      fontSize: '0.75rem',
      fontWeight: '600',
      backgroundColor: style.bg,
      color: style.text,
    }}>
      {style.icon}
      <span>{priority || 'Medium'}</span>
    </span>
  );
}
