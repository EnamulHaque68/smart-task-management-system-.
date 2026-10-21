import React, { useState } from 'react';
import { TrendingUp, Target, Award, CheckCircle2, Info } from 'lucide-react';

export default function OgiveCurveChart({ data, title = 'Ogive Curve (Cumulative Frequency / S-Curve)' }) {
  const [activePoint, setActivePoint] = useState(null);

  // Cumulative Milestones Data (Ogive data points)
  // Each point represents the cumulative frequency/percentage at that milestone
  const ogivePoints = [
    { milestone: 'Day 0', plannedCumPct: 0, actualCumPct: 0, actualTasks: 0, totalTasks: 7, label: 'Kickoff' },
    { milestone: 'Week 1', plannedCumPct: 15, actualCumPct: 14, actualTasks: 1, totalTasks: 7, label: 'Architecture & DB' },
    { milestone: 'Week 2', plannedCumPct: 35, actualCumPct: 29, actualTasks: 2, totalTasks: 7, label: 'CRUD APIs & Auth' },
    { milestone: 'Week 3', plannedCumPct: 60, actualCumPct: 57, actualTasks: 4, totalTasks: 7, label: 'Task Board & Chat' },
    { milestone: 'Week 4', plannedCumPct: 80, actualCumPct: 71, actualTasks: 5, totalTasks: 7, label: 'Analytics & Sync' },
    { milestone: 'Week 5', plannedCumPct: 95, actualCumPct: null, actualTasks: null, totalTasks: 7, label: 'Integration Test' },
    { milestone: 'Final', plannedCumPct: 100, actualCumPct: null, actualTasks: null, totalTasks: 7, label: 'Release 1.0' },
  ];

  // SVG Coordinates
  const svgWidth = 760;
  const svgHeight = 260;
  const paddingLeft = 45;
  const paddingRight = 30;
  const paddingTop = 30;
  const paddingBottom = 45;

  const chartWidth = svgWidth - paddingLeft - paddingRight;
  const chartHeight = svgHeight - paddingTop - paddingBottom;

  // Calculate coordinates for planned curve
  const plannedCoords = ogivePoints.map((pt, i) => {
    const x = paddingLeft + (i / (ogivePoints.length - 1)) * chartWidth;
    const y = paddingTop + (1 - pt.plannedCumPct / 100) * chartHeight;
    return { ...pt, x, y };
  });

  // Calculate coordinates for actual curve (only non-null)
  const actualPointsData = ogivePoints.filter((pt) => pt.actualCumPct !== null);
  const actualCoords = actualPointsData.map((pt, i) => {
    const x = paddingLeft + (i / (ogivePoints.length - 1)) * chartWidth;
    const y = paddingTop + (1 - pt.actualCumPct / 100) * chartHeight;
    return { ...pt, x, y, index: i };
  });

  // Generate smooth cubic Bézier curve SVG path
  const createSmoothPath = (points) => {
    if (points.length < 2) return '';
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i === 0 ? 0 : i - 1];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = points[i + 2] || p2;

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }
    return d;
  };

  const plannedPath = createSmoothPath(plannedCoords);
  const actualPath = createSmoothPath(actualCoords);

  // Gradient area fill for actual curve
  const areaPath = actualCoords.length > 0
    ? `${actualPath} L ${actualCoords[actualCoords.length - 1].x} ${paddingTop + chartHeight} L ${actualCoords[0].x} ${paddingTop + chartHeight} Z`
    : '';

  // 50% Median Line (Ogive P50 median frequency)
  const medianY = paddingTop + (1 - 0.5) * chartHeight;

  return (
    <div style={{
      backgroundColor: '#ffffff',
      borderRadius: '16px',
      padding: '1.5rem',
      border: '1px solid #e2e8f0',
      boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1.25rem',
        flexWrap: 'wrap',
        gap: '12px',
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
            <TrendingUp size={18} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
              Ogive Curve (Cumulative Frequency / S-Curve)
            </h3>
            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
              Tracks cumulative milestone delivery percentage and project trajectory over time
            </span>
          </div>
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '0.8rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{
              width: '18px',
              height: '3px',
              backgroundColor: '#2563eb',
              borderRadius: '2px',
              display: 'inline-block',
            }} />
            <span style={{ fontWeight: '700', color: '#0f172a' }}>Actual Ogive</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{
              width: '18px',
              height: '2px',
              borderTop: '2px dashed #94a3b8',
              display: 'inline-block',
            }} />
            <span style={{ color: '#64748b', fontWeight: '600' }}>Planned S-Curve</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{
              width: '18px',
              height: '1.5px',
              borderTop: '1.5px dashed #ef4444',
              display: 'inline-block',
            }} />
            <span style={{ color: '#ef4444', fontWeight: '600' }}>P50 Median</span>
          </div>
        </div>
      </div>

      {/* Main SVG Ogive Graph */}
      <div style={{ position: 'relative', width: '100%', overflowX: 'auto' }}>
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          style={{ width: '100%', height: 'auto', display: 'block' }}
        >
          <defs>
            {/* Shaded Area Gradient */}
            <linearGradient id="ogiveAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2563eb" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.01" />
            </linearGradient>

            {/* Glowing line filter */}
            <filter id="ogiveGlow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#2563eb" floodOpacity="0.3" />
            </filter>
          </defs>

          {/* Y-axis grid lines and percentage labels (0% to 100%) */}
          {[0, 25, 50, 75, 100].map((pct) => {
            const y = paddingTop + (1 - pct / 100) * chartHeight;
            return (
              <g key={pct}>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={svgWidth - paddingRight}
                  y2={y}
                  stroke={pct === 50 ? '#fee2e2' : '#f1f5f9'}
                  strokeWidth={pct === 50 ? '1.5' : '1'}
                  strokeDasharray={pct === 50 ? '4 3' : 'none'}
                />
                <text
                  x={paddingLeft - 8}
                  y={y + 3.5}
                  textAnchor="end"
                  fontSize="10"
                  fill={pct === 50 ? '#ef4444' : '#94a3b8'}
                  fontWeight={pct === 50 ? '800' : '600'}
                >
                  {pct}%
                </text>
              </g>
            );
          })}

          {/* Median P50 Line Annotation */}
          <text
            x={svgWidth - paddingRight}
            y={medianY - 5}
            textAnchor="end"
            fontSize="9"
            fill="#ef4444"
            fontWeight="700"
          >
            50% Median Milestone
          </text>

          {/* Area Fill for Actual Cumulative Progress */}
          {areaPath && (
            <path
              d={areaPath}
              fill="url(#ogiveAreaGrad)"
            />
          )}

          {/* Planned Baseline Ogive Curve (Dashed Gray) */}
          <path
            d={plannedPath}
            fill="none"
            stroke="#94a3b8"
            strokeWidth="2"
            strokeDasharray="5 5"
          />

          {/* Actual Cumulative Ogive Curve (Solid Blue Vibrant) */}
          <path
            d={actualPath}
            fill="none"
            stroke="#2563eb"
            strokeWidth="3.5"
            strokeLinecap="round"
            filter="url(#ogiveGlow)"
          />

          {/* Data Points on Actual Ogive Curve */}
          {actualCoords.map((pt) => {
            const isHovered = activePoint?.milestone === pt.milestone;

            return (
              <g
                key={pt.milestone}
                style={{ cursor: 'pointer' }}
                onMouseEnter={() => setActivePoint(pt)}
                onMouseLeave={() => setActivePoint(null)}
              >
                {/* Outer highlight pulse when hovered */}
                {isHovered && (
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r="9"
                    fill="rgba(37, 99, 235, 0.2)"
                  />
                )}

                {/* Main Point Circle */}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isHovered ? 6 : 4.5}
                  fill="#ffffff"
                  stroke="#2563eb"
                  strokeWidth="2.5"
                  style={{
                    transition: 'all 0.15s ease',
                    filter: isHovered ? 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' : 'none',
                  }}
                />

                {/* Percentage label above current point */}
                <text
                  x={pt.x}
                  y={pt.y - 10}
                  textAnchor="middle"
                  fontSize="10"
                  fontWeight="800"
                  fill="#2563eb"
                >
                  {pt.actualCumPct}%
                </text>
              </g>
            );
          })}

          {/* X-axis milestone labels */}
          {plannedCoords.map((pt) => {
            const isHovered = activePoint?.milestone === pt.milestone;
            return (
              <g key={pt.milestone}>
                <line
                  x1={pt.x}
                  y1={paddingTop + chartHeight}
                  x2={pt.x}
                  y2={paddingTop + chartHeight + 5}
                  stroke="#cbd5e1"
                  strokeWidth="1.5"
                />
                <text
                  x={pt.x}
                  y={svgHeight - 16}
                  textAnchor="middle"
                  fontSize="10"
                  fontWeight={isHovered ? '800' : '600'}
                  fill={isHovered ? '#2563eb' : '#64748b'}
                >
                  {pt.milestone}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Tooltip & Summary Banner */}
      <div style={{
        marginTop: '0.75rem',
        padding: '10px 14px',
        backgroundColor: '#f8fafc',
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '8px',
      }}>
        {activePoint ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem' }}>
            <span style={{ fontWeight: '800', color: '#0f172a' }}>
              📍 {activePoint.milestone} ({activePoint.label}):
            </span>
            <span style={{ color: '#2563eb', fontWeight: '700' }}>
              {activePoint.actualCumPct}% Cumulative
            </span>
            <span style={{ color: '#64748b' }}>
              ({activePoint.actualTasks} of {activePoint.totalTasks} tasks delivered)
            </span>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: '#64748b' }}>
            <Award size={16} color="#2563eb" />
            <span>
              Hover over any data point to inspect cumulative milestone progress & delivery velocity.
            </span>
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.78rem' }}>
          <div>
            <span style={{ color: '#64748b' }}>Current Cumulative: </span>
            <span style={{ fontWeight: '800', color: '#10b981' }}>
              {actualCoords[actualCoords.length - 1]?.actualCumPct || 57}% Completed
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
