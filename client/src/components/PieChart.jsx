import React, { useState } from 'react';
import { PieChart as PieIcon, CheckCircle2, AlertCircle } from 'lucide-react';

export default function PieChart({ data, title = 'Task Distribution' }) {
  const [activeSegment, setActiveSegment] = useState(null);
  const [viewMode, setViewMode] = useState('status'); // 'status' or 'priority'

  // Extract raw slices from data
  let rawSlices = [];
  if (viewMode === 'status') {
    const s = data?.tasksSummary?.byStatus || {};
    rawSlices = [
      { id: 'completed', label: 'Completed', value: Number(s.completed || 0), color: '#10b981', lightColor: '#ecfdf5' },
      { id: 'in_progress', label: 'In Progress', value: Number(s.inProgress || 0), color: '#f59e0b', lightColor: '#fffbeb' },
      { id: 'todo', label: 'To Do', value: Number(s.toDo || 0), color: '#2563eb', lightColor: '#eff6ff' },
    ];
  } else {
    const p = data?.tasksSummary?.byPriority || {};
    rawSlices = [
      { id: 'high', label: 'High Priority', value: Number(p.high || 0), color: '#ef4444', lightColor: '#fef2f2' },
      { id: 'medium', label: 'Medium Priority', value: Number(p.medium || 0), color: '#f59e0b', lightColor: '#fffbeb' },
      { id: 'low', label: 'Low Priority', value: Number(p.low || 0), color: '#10b981', lightColor: '#ecfdf5' },
    ];
  }

  const realTotal = rawSlices.reduce((acc, curr) => acc + curr.value, 0);

  // If realTotal === 0, use safe default seed preview so chart is ALWAYS visual and never an empty void
  const hasRealData = realTotal > 0;
  const slices = hasRealData
    ? rawSlices
    : (viewMode === 'status'
        ? [
            { id: 'completed', label: 'Completed', value: 2, color: '#10b981', lightColor: '#ecfdf5' },
            { id: 'in_progress', label: 'In Progress', value: 4, color: '#f59e0b', lightColor: '#fffbeb' },
            { id: 'todo', label: 'To Do', value: 1, color: '#2563eb', lightColor: '#eff6ff' },
          ]
        : [
            { id: 'high', label: 'High Priority', value: 3, color: '#ef4444', lightColor: '#fef2f2' },
            { id: 'medium', label: 'Medium Priority', value: 3, color: '#f59e0b', lightColor: '#fffbeb' },
            { id: 'low', label: 'Low Priority', value: 1, color: '#10b981', lightColor: '#ecfdf5' },
          ]);

  const totalValue = slices.reduce((acc, curr) => acc + curr.value, 0) || 1;

  // Geometry for Donut Pie Chart
  const size = 260;
  const cx = size / 2;
  const cy = size / 2;
  const outerRadius = 98;
  const innerRadius = 60;

  // Compute SVG Paths for each slice
  let currentAngle = -Math.PI / 2; // Start at 12 o'clock

  const arcs = slices.map((slice) => {
    const percentage = slice.value / totalValue;
    const sweepAngle = percentage * 2 * Math.PI;
    const startAngle = currentAngle;
    const endAngle = currentAngle + sweepAngle;
    currentAngle += sweepAngle;

    // Handle 0% slice
    if (slice.value === 0 || percentage === 0) {
      return {
        ...slice,
        percentage: '0%',
        pathData: '',
        sweepAngle: 0,
      };
    }

    // Handle 100% full circle donut
    if (percentage >= 0.999) {
      const fullPath = [
        `M ${cx} ${cy - outerRadius}`,
        `A ${outerRadius} ${outerRadius} 0 1 1 ${cx} ${cy + outerRadius}`,
        `A ${outerRadius} ${outerRadius} 0 1 1 ${cx} ${cy - outerRadius}`,
        `M ${cx} ${cy - innerRadius}`,
        `A ${innerRadius} ${innerRadius} 0 1 0 ${cx} ${cy + innerRadius}`,
        `A ${innerRadius} ${innerRadius} 0 1 0 ${cx} ${cy - innerRadius}`,
        'Z',
      ].join(' ');

      return {
        ...slice,
        percentage: '100%',
        pathData: fullPath,
        sweepAngle,
      };
    }

    const x1 = cx + outerRadius * Math.cos(startAngle);
    const y1 = cy + outerRadius * Math.sin(startAngle);
    const x2 = cx + outerRadius * Math.cos(endAngle);
    const y2 = cy + outerRadius * Math.sin(endAngle);

    const x3 = cx + innerRadius * Math.cos(endAngle);
    const y3 = cy + innerRadius * Math.sin(endAngle);
    const x4 = cx + innerRadius * Math.cos(startAngle);
    const y4 = cy + innerRadius * Math.sin(startAngle);

    const largeArcFlag = sweepAngle > Math.PI ? 1 : 0;

    const pathData = [
      `M ${x1} ${y1}`,
      `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
      `L ${x3} ${y3}`,
      `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x4} ${y4}`,
      'Z',
    ].join(' ');

    const pctStr = `${Math.round(percentage * 100)}%`;

    return {
      ...slice,
      percentage: pctStr,
      pathData,
      sweepAngle,
    };
  });

  const activeSlice = activeSegment
    ? arcs.find((a) => a.id === activeSegment)
    : null;

  return (
    <div style={{
      backgroundColor: '#ffffff',
      borderRadius: '16px',
      padding: '1.5rem',
      border: '1px solid #e2e8f0',
      boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
    }}>
      {/* Header with Title and Mode Switcher */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1rem',
        flexWrap: 'wrap',
        gap: '8px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            backgroundColor: '#eff6ff',
            color: '#2563eb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <PieIcon size={18} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                Pie Chart
              </h3>
              {!hasRealData && (
                <span style={{
                  fontSize: '0.65rem',
                  fontWeight: '700',
                  color: '#2563eb',
                  backgroundColor: '#eff6ff',
                  padding: '1px 6px',
                  borderRadius: '9999px',
                }}>
                  Workspace Preview
                </span>
              )}
            </div>
            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
              Category proportions & breakdown
            </span>
          </div>
        </div>

        {/* Mode Selector Tabs */}
        <div style={{
          display: 'flex',
          backgroundColor: '#f1f5f9',
          borderRadius: '8px',
          padding: '2px',
          gap: '2px',
        }}>
          <button
            type="button"
            onClick={() => {
              setViewMode('status');
              setActiveSegment(null);
            }}
            style={{
              padding: '4px 10px',
              fontSize: '0.75rem',
              fontWeight: '700',
              borderRadius: '6px',
              backgroundColor: viewMode === 'status' ? '#ffffff' : 'transparent',
              color: viewMode === 'status' ? '#2563eb' : '#64748b',
              boxShadow: viewMode === 'status' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            By Status
          </button>
          <button
            type="button"
            onClick={() => {
              setViewMode('priority');
              setActiveSegment(null);
            }}
            style={{
              padding: '4px 10px',
              fontSize: '0.75rem',
              fontWeight: '700',
              borderRadius: '6px',
              backgroundColor: viewMode === 'priority' ? '#ffffff' : 'transparent',
              color: viewMode === 'priority' ? '#2563eb' : '#64748b',
              boxShadow: viewMode === 'priority' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            By Priority
          </button>
        </div>
      </div>

      {/* Main Chart Body: SVG Donut + Legends */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        flexWrap: 'wrap',
        gap: '1.5rem',
        flex: 1,
      }}>
        {/* SVG Container */}
        <div style={{ position: 'relative', width: size, height: size }}>
          <svg
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            style={{ overflow: 'visible' }}
          >
            <defs>
              <filter id="pieShadow" x="-10%" y="-10%" width="120%" height="120%">
                <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.12" />
              </filter>
            </defs>

            {/* Base guide circle */}
            <circle
              cx={cx}
              cy={cy}
              r={(outerRadius + innerRadius) / 2}
              fill="none"
              stroke="#f1f5f9"
              strokeWidth={outerRadius - innerRadius}
            />

            {/* Arcs */}
            {arcs.map((arc) => {
              if (!arc.pathData) return null;
              const isHovered = activeSegment === arc.id;

              return (
                <path
                  key={arc.id}
                  d={arc.pathData}
                  fill={arc.color}
                  stroke="#ffffff"
                  strokeWidth="2.5"
                  style={{
                    cursor: 'pointer',
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    transformOrigin: `${cx}px ${cy}px`,
                    transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                    filter: isHovered ? 'drop-shadow(0 6px 12px rgba(0,0,0,0.2))' : 'none',
                    opacity: activeSegment && !isHovered ? 0.65 : 1,
                  }}
                  onMouseEnter={() => setActiveSegment(arc.id)}
                  onMouseLeave={() => setActiveSegment(null)}
                />
              );
            })}
          </svg>

          {/* Centered Donut Label */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
          }}>
            {activeSlice ? (
              <>
                <span style={{ fontSize: '0.75rem', fontWeight: '700', color: activeSlice.color }}>
                  {activeSlice.label}
                </span>
                <span style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0f172a', lineHeight: 1.1 }}>
                  {activeSlice.value}
                </span>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  {activeSlice.percentage}
                </span>
              </>
            ) : (
              <>
                <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '600' }}>
                  Total
                </span>
                <span style={{ fontSize: '1.65rem', fontWeight: '800', color: '#0f172a', lineHeight: 1.1 }}>
                  {totalValue}
                </span>
                <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                  Tasks
                </span>
              </>
            )}
          </div>
        </div>

        {/* Legend Cards */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          minWidth: '160px',
        }}>
          {arcs.map((arc) => {
            const isHovered = activeSegment === arc.id;
            return (
              <div
                key={arc.id}
                onMouseEnter={() => setActiveSegment(arc.id)}
                onMouseLeave={() => setActiveSegment(null)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '6px 10px',
                  borderRadius: '8px',
                  backgroundColor: isHovered ? '#f8fafc' : 'transparent',
                  border: isHovered ? '1px solid #e2e8f0' : '1px solid transparent',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    backgroundColor: arc.color,
                    display: 'inline-block',
                  }} />
                  <span style={{ fontSize: '0.82rem', fontWeight: isHovered ? '700' : '600', color: '#334155' }}>
                    {arc.label}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: '800', color: '#0f172a' }}>
                    {arc.value}
                  </span>
                  <span style={{ fontSize: '0.72rem', color: '#94a3b8', minWidth: '32px', textAlign: 'right' }}>
                    ({arc.percentage})
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
