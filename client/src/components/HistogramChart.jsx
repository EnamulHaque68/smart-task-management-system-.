import React, { useState } from 'react';
import { BarChart3, TrendingUp, Info } from 'lucide-react';

export default function HistogramChart({ data, title = 'Task Frequency Histogram' }) {
  const [activeBin, setActiveBin] = useState(null);
  const [metricMode, setMetricMode] = useState('duration'); // 'duration' or 'velocity'

  // Histogram Bin datasets
  const durationBins = [
    { bin: '1-3 Days', range: 'Fast Turnaround', count: 3, percentage: '43%', color: '#2563eb' },
    { bin: '4-7 Days', range: 'Standard Sprint', count: 2, percentage: '29%', color: '#3b82f6' },
    { bin: '8-14 Days', range: 'Multi-Week', count: 1, percentage: '14%', color: '#60a5fa' },
    { bin: '15-21 Days', range: 'Extended Effort', count: 1, percentage: '14%', color: '#93c5fd' },
    { bin: '22+ Days', range: 'Backlog / Epic', count: 0, percentage: '0%', color: '#cbd5e1' },
  ];

  const velocityBins = [
    { bin: 'Sprint 1', range: 'Discovery Phase', count: 4, percentage: '25%', color: '#10b981' },
    { bin: 'Sprint 2', range: 'Core Build', count: 6, percentage: '38%', color: '#059669' },
    { bin: 'Sprint 3', range: 'Integration', count: 3, percentage: '19%', color: '#34d399' },
    { bin: 'Sprint 4', range: 'QA & Review', count: 2, percentage: '12%', color: '#6ee7b7' },
    { bin: 'Sprint 5', range: 'Final Polish', count: 1, percentage: '6%', color: '#a7f3d0' },
  ];

  const currentBins = metricMode === 'duration' ? durationBins : velocityBins;
  const maxCount = Math.max(...currentBins.map((b) => b.count), 6);
  const totalItems = currentBins.reduce((sum, b) => sum + b.count, 0);
  const averageValue = (totalItems / currentBins.length).toFixed(1);

  // SVG Chart Dimensions
  const svgWidth = 440;
  const svgHeight = 220;
  const paddingLeft = 40;
  const paddingRight = 20;
  const paddingTop = 30;
  const paddingBottom = 40;

  const chartWidth = svgWidth - paddingLeft - paddingRight;
  const chartHeight = svgHeight - paddingTop - paddingBottom;
  const barWidth = (chartWidth / currentBins.length) * 0.72;
  const barSpacing = chartWidth / currentBins.length;

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
            <BarChart3 size={18} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
              Histogram
            </h3>
            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
              Frequency distribution across intervals
            </span>
          </div>
        </div>

        {/* Tab Controls */}
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
              setMetricMode('duration');
              setActiveBin(null);
            }}
            style={{
              padding: '4px 10px',
              fontSize: '0.75rem',
              fontWeight: '700',
              borderRadius: '6px',
              backgroundColor: metricMode === 'duration' ? '#ffffff' : 'transparent',
              color: metricMode === 'duration' ? '#2563eb' : '#64748b',
              boxShadow: metricMode === 'duration' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            Duration Bins
          </button>
          <button
            type="button"
            onClick={() => {
              setMetricMode('velocity');
              setActiveBin(null);
            }}
            style={{
              padding: '4px 10px',
              fontSize: '0.75rem',
              fontWeight: '700',
              borderRadius: '6px',
              backgroundColor: metricMode === 'velocity' ? '#ffffff' : 'transparent',
              color: metricMode === 'velocity' ? '#2563eb' : '#64748b',
              boxShadow: metricMode === 'velocity' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            Sprint Velocity
          </button>
        </div>
      </div>

      {/* SVG Histogram Graphic */}
      <div style={{ position: 'relative', width: '100%', overflowX: 'auto' }}>
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          style={{ width: '100%', height: 'auto', display: 'block' }}
        >
          <defs>
            <linearGradient id="histBarGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2563eb" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.4" />
            </linearGradient>
            <linearGradient id="histBarHover" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1d4ed8" stopOpacity="1" />
              <stop offset="100%" stopColor="#2563eb" stopOpacity="0.75" />
            </linearGradient>
          </defs>

          {/* Horizontal Grid lines and Y-axis labels */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
            const y = paddingTop + chartHeight * (1 - ratio);
            const val = Math.round(maxCount * ratio);
            return (
              <g key={ratio}>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={svgWidth - paddingRight}
                  y2={y}
                  stroke="#f1f5f9"
                  strokeWidth="1"
                />
                <text
                  x={paddingLeft - 8}
                  y={y + 3}
                  textAnchor="end"
                  fontSize="10"
                  fill="#94a3b8"
                  fontWeight="600"
                >
                  {val}
                </text>
              </g>
            );
          })}

          {/* Average / Mean dashed reference line */}
          {(() => {
            const meanY = paddingTop + chartHeight * (1 - averageValue / maxCount);
            return (
              <g>
                <line
                  x1={paddingLeft}
                  y1={meanY}
                  x2={svgWidth - paddingRight}
                  y2={meanY}
                  stroke="#ef4444"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                />
                <text
                  x={svgWidth - paddingRight}
                  y={meanY - 5}
                  textAnchor="end"
                  fontSize="9.5"
                  fill="#ef4444"
                  fontWeight="700"
                >
                  Mean: {averageValue}
                </text>
              </g>
            );
          })()}

          {/* Histogram Bins / Columns */}
          {currentBins.map((binItem, idx) => {
            const barHeight = (binItem.count / maxCount) * chartHeight;
            const x = paddingLeft + idx * barSpacing + (barSpacing - barWidth) / 2;
            const y = paddingTop + (chartHeight - barHeight);
            const isHovered = activeBin === idx;

            return (
              <g
                key={binItem.bin}
                style={{ cursor: 'pointer' }}
                onMouseEnter={() => setActiveBin(idx)}
                onMouseLeave={() => setActiveBin(null)}
              >
                {/* Background hover bar column */}
                <rect
                  x={paddingLeft + idx * barSpacing}
                  y={paddingTop}
                  width={barSpacing}
                  height={chartHeight}
                  fill={isHovered ? 'rgba(37, 99, 235, 0.04)' : 'transparent'}
                  rx="4"
                />

                {/* Vertical Histogram Column */}
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={Math.max(barHeight, 2)}
                  rx="6"
                  fill={isHovered ? 'url(#histBarHover)' : binItem.color}
                  stroke={isHovered ? '#1d4ed8' : 'none'}
                  strokeWidth={isHovered ? 2 : 0}
                  style={{
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    filter: isHovered ? 'drop-shadow(0 4px 6px rgba(37, 99, 235, 0.3))' : 'none',
                  }}
                />

                {/* Exact Frequency Count on top of bar */}
                {binItem.count > 0 && (
                  <text
                    x={x + barWidth / 2}
                    y={y - 6}
                    textAnchor="middle"
                    fontSize="11"
                    fontWeight="800"
                    fill={isHovered ? '#1d4ed8' : '#0f172a'}
                  >
                    {binItem.count}
                  </text>
                )}

                {/* X-axis Bin Labels */}
                <text
                  x={x + barWidth / 2}
                  y={svgHeight - 15}
                  textAnchor="middle"
                  fontSize="10"
                  fontWeight={isHovered ? '800' : '600'}
                  fill={isHovered ? '#2563eb' : '#64748b'}
                >
                  {binItem.bin}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Footer Metrics */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: '0.75rem',
        padding: '8px 12px',
        backgroundColor: '#f8fafc',
        borderRadius: '10px',
        border: '1px solid #f1f5f9',
        fontSize: '0.75rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b' }}>
          <span style={{ fontWeight: '700', color: '#0f172a' }}>Total Sample:</span>
          <span>{totalItems} tasks</span>
        </div>

        {activeBin !== null ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#2563eb', fontWeight: '700' }}>
            <span>{currentBins[activeBin].bin}:</span>
            <span>{currentBins[activeBin].count} tasks ({currentBins[activeBin].percentage})</span>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b' }}>
            <span style={{ fontWeight: '700', color: '#0f172a' }}>Mean Velocity:</span>
            <span>{averageValue} tasks/bin</span>
          </div>
        )}
      </div>
    </div>
  );
}
