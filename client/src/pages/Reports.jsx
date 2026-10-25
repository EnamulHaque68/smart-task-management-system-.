import React, { useState, useEffect } from 'react';
import {
  Layers,
  Calendar,
  FolderKanban,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Printer,
  PieChart,
  BarChart2,
  Check,
  Target,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth.jsx';
import { getProjectsApi } from '../api/projects.js';
import { getTasksApi } from '../api/tasks.js';

export default function Reports() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  // Default executive milestone dataset matching Image 2 perfectly
  const defaultAuditProjects = [
    {
      id: 1,
      num: 1,
      title: 'Website Redesign',
      status: 'In Progress',
      priority: 'High',
      total_tasks: 7,
      completed_tasks: 2,
      progress_percentage: 29,
      last_updated: '20 Oct 2026',
    },
    {
      id: 2,
      num: 2,
      title: 'Mobile App Development',
      status: 'In Progress',
      priority: 'High',
      total_tasks: 12,
      completed_tasks: 5,
      progress_percentage: 42,
      last_updated: '21 Oct 2026',
    },
    {
      id: 3,
      num: 3,
      title: 'API Integration',
      status: 'In Progress',
      priority: 'Medium',
      total_tasks: 8,
      completed_tasks: 3,
      progress_percentage: 38,
      last_updated: '19 Oct 2026',
    },
    {
      id: 4,
      num: 4,
      title: 'Database Migration',
      status: 'Completed',
      priority: 'High',
      total_tasks: 6,
      completed_tasks: 6,
      progress_percentage: 100,
      last_updated: '18 Oct 2026',
    },
    {
      id: 5,
      num: 5,
      title: 'Security Audit',
      status: 'In Progress',
      priority: 'Low',
      total_tasks: 4,
      completed_tasks: 1,
      progress_percentage: 25,
      last_updated: '17 Oct 2026',
    },
  ];

  const [auditProjects, setAuditProjects] = useState(defaultAuditProjects);

  // Summary Metrics as shown in Image 2
  const stats = {
    totalProjects: 12,
    completed: 5,
    inProgress: 6,
    onHold: 1,
    notStarted: 0,
  };

  const handlePrint = () => {
    window.print();
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High':
        return '#ef4444';
      case 'Medium':
        return '#f59e0b';
      case 'Low':
      default:
        return '#64748b';
    }
  };

  const getStatusBadge = (status) => {
    const isCompleted = status === 'Completed';
    return (
      <span
        style={{
          display: 'inline-block',
          padding: '3px 10px',
          borderRadius: '9999px',
          fontSize: '0.74rem',
          fontWeight: '700',
          backgroundColor: isCompleted ? '#ecfdf5' : '#eff6ff',
          color: isCompleted ? '#059669' : '#2563eb',
          border: isCompleted ? '1px solid #a7f3d0' : '1px solid #bfdbfe',
        }}
      >
        {status}
      </span>
    );
  };

  return (
    <div className="executive-report-wrapper">
      <div className="executive-report-sheet">
        {/* Top Executive Header: Brand on Left, Timestamp and Alex Morgan Profile on Right */}
        <header
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingBottom: '1.1rem',
            borderBottom: '1px solid #f1f5f9',
            marginBottom: '1.15rem',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          {/* Brand Left */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                backgroundColor: '#2563eb',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 10px rgba(37, 99, 235, 0.25)',
                flexShrink: 0,
              }}
            >
              <Layers size={22} />
            </div>
            <div>
              <h2
                style={{
                  fontSize: '1.15rem',
                  fontWeight: '800',
                  color: '#0f172a',
                  margin: 0,
                  lineHeight: 1.2,
                  letterSpacing: '-0.02em',
                }}
              >
                Bright Mind Ltd
              </h2>
              <span
                style={{
                  fontSize: '0.78rem',
                  color: '#64748b',
                  fontWeight: '500',
                  lineHeight: 1.2,
                }}
              >
                Smart Task &amp; Project Management System
              </span>
            </div>
          </div>

          {/* Right: Date, Report Type & Profile */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
            <div style={{ textAlign: 'right' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  gap: '5px',
                  fontSize: '0.75rem',
                  color: '#475569',
                  fontWeight: '600',
                }}
              >
                <Calendar size={13} color="#64748b" />
                <span>October 22, 2026, 07:29 PM</span>
              </div>
              <span
                style={{
                  fontSize: '0.75rem',
                  color: '#64748b',
                  fontWeight: '700',
                  textTransform: 'none',
                }}
              >
                Executive Report
              </span>
            </div>

            {/* Profile Avatar & Details */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                paddingLeft: '14px',
                borderLeft: '1px solid #e2e8f0',
              }}
            >
              <img
                src="/avatars/alex_morgan.jpg"
                alt="Tanvir Ahmed"
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '2px solid #e2e8f0',
                }}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: '800', color: '#0f172a', lineHeight: 1.2 }}>
                  Tanvir Ahmed
                </span>
                <span style={{ fontSize: '0.72rem', color: '#64748b', lineHeight: 1.2 }}>
                  demo@brightmind.com
                </span>
                <span style={{ fontSize: '0.7rem', color: '#94a3b8', lineHeight: 1.2 }}>
                  Lead Product Manager
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Section Heading */}
        <div style={{ marginBottom: '1.15rem' }}>
          <h1
            style={{
              fontSize: '1.45rem',
              fontWeight: '800',
              color: '#0f172a',
              letterSpacing: '-0.02em',
              margin: 0,
            }}
          >
            Executive Reports
          </h1>
          <p
            style={{
              fontSize: '0.825rem',
              color: '#64748b',
              marginTop: '3px',
              margin: 0,
            }}
          >
            Audit, compliance, and milestone reports for Bright Mind stakeholders
          </p>
        </div>

        {/* 4 KPI Summary Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '12px',
            marginBottom: '1.25rem',
          }}
        >
          {/* Card 1: Total Projects */}
          <div
            style={{
              backgroundColor: '#f0f7ff',
              border: '1px solid #dbeafe',
              borderRadius: '12px',
              padding: '11px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                backgroundColor: '#ffffff',
                border: '1px solid #bfdbfe',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#2563eb',
                flexShrink: 0,
              }}
            >
              <FolderKanban size={18} />
            </div>
            <div>
              <div style={{ fontSize: '1.35rem', fontWeight: '800', color: '#1e3a8a', lineHeight: 1.1 }}>
                {stats.totalProjects}
              </div>
              <div style={{ fontSize: '0.72rem', fontWeight: '600', color: '#64748b' }}>
                Total Projects
              </div>
            </div>
          </div>

          {/* Card 2: Completed */}
          <div
            style={{
              backgroundColor: '#f0fdf4',
              border: '1px solid #dcfce7',
              borderRadius: '12px',
              padding: '11px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: '#10b981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                flexShrink: 0,
              }}
            >
              <Check size={18} strokeWidth={3} />
            </div>
            <div>
              <div style={{ fontSize: '1.35rem', fontWeight: '800', color: '#065f46', lineHeight: 1.1 }}>
                {stats.completed}
              </div>
              <div style={{ fontSize: '0.72rem', fontWeight: '600', color: '#64748b' }}>
                Completed
              </div>
            </div>
          </div>

          {/* Card 3: In Progress */}
          <div
            style={{
              backgroundColor: '#fffbeb',
              border: '1px solid #fef3c7',
              borderRadius: '12px',
              padding: '11px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: '#f59e0b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                flexShrink: 0,
              }}
            >
              <Clock size={18} strokeWidth={2.5} />
            </div>
            <div>
              <div style={{ fontSize: '1.35rem', fontWeight: '800', color: '#92400e', lineHeight: 1.1 }}>
                {stats.inProgress}
              </div>
              <div style={{ fontSize: '0.72rem', fontWeight: '600', color: '#64748b' }}>
                In Progress
              </div>
            </div>
          </div>

          {/* Card 4: On Hold */}
          <div
            style={{
              backgroundColor: '#fef2f2',
              border: '1px solid #fee2e2',
              borderRadius: '12px',
              padding: '11px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: '#ef4444',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                flexShrink: 0,
              }}
            >
              <AlertTriangle size={18} strokeWidth={2.5} />
            </div>
            <div>
              <div style={{ fontSize: '1.35rem', fontWeight: '800', color: '#991b1b', lineHeight: 1.1 }}>
                {stats.onHold}
              </div>
              <div style={{ fontSize: '0.72rem', fontWeight: '600', color: '#64748b' }}>
                On Hold
              </div>
            </div>
          </div>
        </div>

        {/* Milestone Audit Action Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '0.75rem',
            flexWrap: 'wrap',
            gap: '8px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '26px',
                height: '26px',
                borderRadius: '50%',
                backgroundColor: '#eff6ff',
                color: '#2563eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Target size={15} />
            </div>
            <div>
              <h3
                style={{
                  fontSize: '0.98rem',
                  fontWeight: '800',
                  color: '#0f172a',
                  margin: 0,
                  lineHeight: 1.2,
                }}
              >
                Project Milestone Audit
              </h3>
              <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                Generated on 22/10/2026
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handlePrint}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 14px',
              backgroundColor: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: '8px',
              fontSize: '0.78rem',
              fontWeight: '600',
              color: '#334155',
              cursor: 'pointer',
              boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
              transition: 'all 0.15s ease',
            }}
          >
            <Printer size={14} />
            <span>Print Report</span>
          </button>
        </div>

        {/* Milestone Audit Table with Dark Navy Header */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '10px',
            border: '1px solid #e2e8f0',
            overflow: 'hidden',
            marginBottom: '1.25rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
          }}
        >
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              textAlign: 'left',
              fontSize: '0.78rem',
            }}
          >
            <thead>
              <tr
                style={{
                  backgroundColor: '#1e293b',
                  color: '#ffffff',
                  borderBottom: '1px solid #0f172a',
                }}
              >
                <th style={{ padding: '9px 12px', fontWeight: '700', width: '32px', textAlign: 'center' }}>#</th>
                <th style={{ padding: '9px 14px', fontWeight: '700' }}>Project Title</th>
                <th style={{ padding: '9px 14px', fontWeight: '700' }}>Status</th>
                <th style={{ padding: '9px 14px', fontWeight: '700' }}>Priority</th>
                <th style={{ padding: '9px 14px', fontWeight: '700', textAlign: 'center' }}>Total Tasks</th>
                <th style={{ padding: '9px 14px', fontWeight: '700', textAlign: 'center' }}>Completed</th>
                <th style={{ padding: '9px 14px', fontWeight: '700' }}>Progress</th>
                <th style={{ padding: '9px 14px', fontWeight: '700' }}>Last Updated</th>
              </tr>
            </thead>
            <tbody>
              {auditProjects.map((p, idx) => (
                <tr
                  key={p.id}
                  style={{
                    borderBottom: idx === auditProjects.length - 1 ? 'none' : '1px solid #f1f5f9',
                    backgroundColor: idx % 2 === 1 ? '#fafcff' : '#ffffff',
                  }}
                >
                  <td
                    style={{
                      padding: '9px 12px',
                      color: '#64748b',
                      fontWeight: '700',
                      textAlign: 'center',
                    }}
                  >
                    {p.num}
                  </td>
                  <td
                    style={{
                      padding: '9px 14px',
                      fontWeight: '700',
                      color: '#0f172a',
                    }}
                  >
                    {p.title}
                  </td>
                  <td style={{ padding: '9px 14px' }}>
                    {getStatusBadge(p.status)}
                  </td>
                  <td
                    style={{
                      padding: '9px 14px',
                      fontWeight: '700',
                      color: getPriorityColor(p.priority),
                    }}
                  >
                    {p.priority}
                  </td>
                  <td
                    style={{
                      padding: '9px 14px',
                      textAlign: 'center',
                      color: '#0f172a',
                      fontWeight: '600',
                    }}
                  >
                    {p.total_tasks}
                  </td>
                  <td
                    style={{
                      padding: '9px 14px',
                      textAlign: 'center',
                      color: '#0f172a',
                      fontWeight: '600',
                    }}
                  >
                    {p.completed_tasks}
                  </td>
                  <td style={{ padding: '9px 14px', minWidth: '130px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div
                        style={{
                          flex: 1,
                          height: '6px',
                          backgroundColor: '#e2e8f0',
                          borderRadius: '4px',
                          overflow: 'hidden',
                          maxWidth: '70px',
                        }}
                      >
                        <div
                          style={{
                            width: `${p.progress_percentage}%`,
                            height: '100%',
                            backgroundColor: p.progress_percentage === 100 ? '#10b981' : '#2563eb',
                            borderRadius: '4px',
                          }}
                        />
                      </div>
                      <span
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: '700',
                          color: '#334155',
                          minWidth: '32px',
                        }}
                      >
                        {p.progress_percentage}%
                      </span>
                    </div>
                  </td>
                  <td
                    style={{
                      padding: '9px 14px',
                      color: '#64748b',
                      fontWeight: '500',
                      fontSize: '0.74rem',
                    }}
                  >
                    {p.last_updated}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Bottom Analytics: Project Status Overview (Donut) & Task Completion Rate (Bar Chart) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1.3fr',
            gap: '12px',
          }}
        >
          {/* Card Left: Project Status Overview */}
          <div
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '12px 16px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            {/* Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '8px',
              }}
            >
              <PieChart size={16} color="#2563eb" />
              <span
                style={{
                  fontSize: '0.84rem',
                  fontWeight: '800',
                  color: '#0f172a',
                }}
              >
                Project Status Overview
              </span>
            </div>

            {/* Donut Chart with Legend */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-around',
                gap: '12px',
                padding: '4px 0',
              }}
            >
              {/* SVG Donut Chart */}
              <div style={{ position: 'relative', width: '130px', height: '130px' }}>
                <svg width="130" height="130" viewBox="0 0 130 130">
                  {/* Background track circle */}
                  <circle
                    cx="65"
                    cy="65"
                    r="46"
                    fill="none"
                    stroke="#f1f5f9"
                    strokeWidth="15"
                  />
                  {/* Segment 1: Completed - 5/12 = 41.67% -> Dash: 120.47 on C = 289.03 */}
                  <circle
                    cx="65"
                    cy="65"
                    r="46"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="15"
                    strokeDasharray="120.43 289.03"
                    strokeDashoffset="0"
                    transform="rotate(-90 65 65)"
                  />
                  {/* Segment 2: In Progress - 6/12 = 50% -> Dash: 144.51 */}
                  <circle
                    cx="65"
                    cy="65"
                    r="46"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="15"
                    strokeDasharray="144.51 289.03"
                    strokeDashoffset="-120.43"
                    transform="rotate(-90 65 65)"
                  />
                  {/* Segment 3: On Hold - 1/12 = 8.33% -> Dash: 24.09 */}
                  <circle
                    cx="65"
                    cy="65"
                    r="46"
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="15"
                    strokeDasharray="24.09 289.03"
                    strokeDashoffset="-264.94"
                    transform="rotate(-90 65 65)"
                  />
                  {/* Center Text: 12 Projects */}
                  <text
                    x="65"
                    y="62"
                    textAnchor="middle"
                    fontSize="18"
                    fontWeight="800"
                    fill="#0f172a"
                  >
                    12
                  </text>
                  <text
                    x="65"
                    y="76"
                    textAnchor="middle"
                    fontSize="9"
                    fontWeight="600"
                    fill="#64748b"
                  >
                    Projects
                  </text>
                </svg>
              </div>

              {/* Legend List */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '7px',
                  fontSize: '0.74rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span
                    style={{
                      width: '9px',
                      height: '9px',
                      borderRadius: '50%',
                      backgroundColor: '#10b981',
                      display: 'inline-block',
                      flexShrink: 0,
                    }}
                  />
                  <span style={{ color: '#475569', minWidth: '75px' }}>Completed</span>
                  <span style={{ fontWeight: '700', color: '#0f172a' }}>5 (42%)</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span
                    style={{
                      width: '9px',
                      height: '9px',
                      borderRadius: '50%',
                      backgroundColor: '#3b82f6',
                      display: 'inline-block',
                      flexShrink: 0,
                    }}
                  />
                  <span style={{ color: '#475569', minWidth: '75px' }}>In Progress</span>
                  <span style={{ fontWeight: '700', color: '#0f172a' }}>6 (50%)</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span
                    style={{
                      width: '9px',
                      height: '9px',
                      borderRadius: '50%',
                      backgroundColor: '#ef4444',
                      display: 'inline-block',
                      flexShrink: 0,
                    }}
                  />
                  <span style={{ color: '#475569', minWidth: '75px' }}>On Hold</span>
                  <span style={{ fontWeight: '700', color: '#0f172a' }}>1 (8%)</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span
                    style={{
                      width: '9px',
                      height: '9px',
                      borderRadius: '50%',
                      backgroundColor: '#cbd5e1',
                      display: 'inline-block',
                      flexShrink: 0,
                    }}
                  />
                  <span style={{ color: '#475569', minWidth: '75px' }}>Not Started</span>
                  <span style={{ fontWeight: '700', color: '#0f172a' }}>0 (0%)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card Right: Task Completion Rate */}
          <div
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '12px 16px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            {/* Header with Top Legend */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '4px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <BarChart2 size={16} color="#2563eb" />
                <span
                  style={{
                    fontSize: '0.84rem',
                    fontWeight: '800',
                    color: '#0f172a',
                  }}
                >
                  Task Completion Rate
                </span>
              </div>

              {/* Legend */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '0.72rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <span
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: '#3b82f6',
                      display: 'inline-block',
                    }}
                  />
                  <span style={{ color: '#64748b', fontWeight: '600' }}>Total Tasks</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <span
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: '#10b981',
                      display: 'inline-block',
                    }}
                  />
                  <span style={{ color: '#64748b', fontWeight: '600' }}>Completed Tasks</span>
                </div>
              </div>
            </div>

            {/* SVG Grouped Bar Chart */}
            <div style={{ width: '100%', height: '142px' }}>
              <svg width="100%" height="100%" viewBox="0 0 460 142" preserveAspectRatio="none">
                {/* Horizontal Gridlines and Y-axis scale */}
                {/* 15 */}
                <line x1="26" y1="18" x2="450" y2="18" stroke="#f1f5f9" strokeDasharray="3 3" />
                <text x="14" y="22" fontSize="9" fontWeight="600" fill="#94a3b8" textAnchor="middle">15</text>

                {/* 10 */}
                <line x1="26" y1="48" x2="450" y2="48" stroke="#f1f5f9" strokeDasharray="3 3" />
                <text x="14" y="52" fontSize="9" fontWeight="600" fill="#94a3b8" textAnchor="middle">10</text>

                {/* 5 */}
                <line x1="26" y1="78" x2="450" y2="78" stroke="#f1f5f9" strokeDasharray="3 3" />
                <text x="14" y="82" fontSize="9" fontWeight="600" fill="#94a3b8" textAnchor="middle">5</text>

                {/* 0 Baseline */}
                <line x1="26" y1="108" x2="450" y2="108" stroke="#e2e8f0" strokeWidth="1" />
                <text x="14" y="111" fontSize="9" fontWeight="600" fill="#94a3b8" textAnchor="middle">0</text>

                {/* Project 1: Website Redesign (Total: 7, Completed: 2) Center = 70 */}
                {/* Total: 7 -> height = 42 -> y = 66 */}
                <rect x="58" y="66" width="13" height="42" fill="#3b82f6" rx="3" />
                <text x="64.5" y="61" fontSize="9" fontWeight="800" fill="#0f172a" textAnchor="middle">7</text>
                {/* Completed: 2 -> height = 12 -> y = 96 */}
                <rect x="73" y="96" width="13" height="12" fill="#10b981" rx="3" />
                <text x="79.5" y="91" fontSize="9" fontWeight="800" fill="#0f172a" textAnchor="middle">2</text>
                <text x="72" y="123" fontSize="8.5" fontWeight="600" fill="#475569" textAnchor="middle">Website</text>
                <text x="72" y="133" fontSize="8.5" fontWeight="600" fill="#475569" textAnchor="middle">Redesign</text>

                {/* Project 2: Mobile App Development (Total: 12, Completed: 5) Center = 155 */}
                {/* Total: 12 -> height = 72 -> y = 36 */}
                <rect x="143" y="36" width="13" height="72" fill="#3b82f6" rx="3" />
                <text x="149.5" y="31" fontSize="9" fontWeight="800" fill="#0f172a" textAnchor="middle">12</text>
                {/* Completed: 5 -> height = 30 -> y = 78 */}
                <rect x="158" y="78" width="13" height="30" fill="#10b981" rx="3" />
                <text x="164.5" y="73" fontSize="9" fontWeight="800" fill="#0f172a" textAnchor="middle">5</text>
                <text x="157" y="123" fontSize="8.5" fontWeight="600" fill="#475569" textAnchor="middle">Mobile App</text>
                <text x="157" y="133" fontSize="8.5" fontWeight="600" fill="#475569" textAnchor="middle">Development</text>

                {/* Project 3: API Integration (Total: 8, Completed: 3) Center = 240 */}
                {/* Total: 8 -> height = 48 -> y = 60 */}
                <rect x="228" y="60" width="13" height="48" fill="#3b82f6" rx="3" />
                <text x="234.5" y="55" fontSize="9" fontWeight="800" fill="#0f172a" textAnchor="middle">8</text>
                {/* Completed: 3 -> height = 18 -> y = 90 */}
                <rect x="243" y="90" width="13" height="18" fill="#10b981" rx="3" />
                <text x="249.5" y="85" fontSize="9" fontWeight="800" fill="#0f172a" textAnchor="middle">3</text>
                <text x="242" y="123" fontSize="8.5" fontWeight="600" fill="#475569" textAnchor="middle">API</text>
                <text x="242" y="133" fontSize="8.5" fontWeight="600" fill="#475569" textAnchor="middle">Integration</text>

                {/* Project 4: Database Migration (Total: 6, Completed: 6) Center = 325 */}
                {/* Total: 6 -> height = 36 -> y = 72 */}
                <rect x="313" y="72" width="13" height="36" fill="#3b82f6" rx="3" />
                <text x="319.5" y="67" fontSize="9" fontWeight="800" fill="#0f172a" textAnchor="middle">6</text>
                {/* Completed: 6 -> height = 36 -> y = 72 */}
                <rect x="328" y="72" width="13" height="36" fill="#10b981" rx="3" />
                <text x="334.5" y="67" fontSize="9" fontWeight="800" fill="#0f172a" textAnchor="middle">6</text>
                <text x="327" y="123" fontSize="8.5" fontWeight="600" fill="#475569" textAnchor="middle">Database</text>
                <text x="327" y="133" fontSize="8.5" fontWeight="600" fill="#475569" textAnchor="middle">Migration</text>

                {/* Project 5: Security Audit (Total: 4, Completed: 1) Center = 410 */}
                {/* Total: 4 -> height = 24 -> y = 84 */}
                <rect x="398" y="84" width="13" height="24" fill="#3b82f6" rx="3" />
                <text x="404.5" y="79" fontSize="9" fontWeight="800" fill="#0f172a" textAnchor="middle">4</text>
                {/* Completed: 1 -> height = 6 -> y = 102 */}
                <rect x="413" y="102" width="13" height="6" fill="#10b981" rx="3" />
                <text x="419.5" y="97" fontSize="9" fontWeight="800" fill="#0f172a" textAnchor="middle">1</text>
                <text x="412" y="123" fontSize="8.5" fontWeight="600" fill="#475569" textAnchor="middle">Security</text>
                <text x="412" y="133" fontSize="8.5" fontWeight="600" fill="#475569" textAnchor="middle">Audit</text>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
