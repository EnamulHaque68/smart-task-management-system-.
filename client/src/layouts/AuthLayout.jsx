import React from 'react';
import { Outlet } from 'react-router-dom';
import {
  Layers,
  Check,
  Users,
  BarChart2,
  ShieldCheck,
  Quote,
} from 'lucide-react';

export default function AuthLayout() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#eef2f6',
        padding: '2rem 1rem',
        fontFamily: 'var(--font-primary, sans-serif)',
      }}
    >
      <div
        style={{
          maxWidth: '1160px',
          width: '100%',
          backgroundColor: '#ffffff',
          borderRadius: '24px',
          boxShadow: '0 25px 60px -15px rgba(15, 23, 42, 0.18)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          overflow: 'hidden',
          border: '1px solid #e2e8f0',
        }}
      >
        {/* Left Visual Banner Matching Image 2 */}
        <div
          style={{
            background: 'linear-gradient(140deg, #071630 0%, #0d2557 35%, #1e3a8a 70%, #2563eb 100%)',
            padding: '2.5rem 2.25rem',
            color: '#ffffff',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative',
            overflow: 'hidden',
            minHeight: '680px',
          }}
        >
          {/* Subtle Ambient Decorative Circles */}
          <div
            style={{
              position: 'absolute',
              top: '-60px',
              right: '-60px',
              width: '260px',
              height: '260px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(56, 189, 248, 0.15) 0%, rgba(37, 99, 235, 0) 70%)',
              pointerEvents: 'none',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '-80px',
              left: '-80px',
              width: '320px',
              height: '320px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(37, 99, 235, 0.25) 0%, rgba(15, 23, 42, 0) 70%)',
              pointerEvents: 'none',
            }}
          />

          {/* Top Brand: TaskFlow & BRIGHT MIND LTD */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', zIndex: 2 }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                backgroundColor: '#2563eb',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 6px 16px rgba(37, 99, 235, 0.35)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                flexShrink: 0,
              }}
            >
              <Layers size={22} />
            </div>
            <div>
              <div
                style={{
                  fontSize: '1.25rem',
                  fontWeight: '800',
                  letterSpacing: '-0.02em',
                  color: '#ffffff',
                  lineHeight: 1.15,
                }}
              >
                TaskFlow
              </div>
              <div
                style={{
                  fontSize: '0.68rem',
                  fontWeight: '700',
                  color: '#93c5fd',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  lineHeight: 1.15,
                }}
              >
                Bright Mind Ltd
              </div>
            </div>
          </div>

          {/* Headline & Subtitle */}
          <div style={{ marginTop: '2rem', marginBottom: '1.25rem', zIndex: 2 }}>
            <h1
              style={{
                fontSize: '2.1rem',
                fontWeight: '800',
                lineHeight: 1.2,
                letterSpacing: '-0.025em',
                color: '#ffffff',
                margin: 0,
              }}
            >
              Manage Projects
              <br />
              <span style={{ color: '#38bdf8' }}>Smarter</span>, Together
            </h1>
            <p
              style={{
                marginTop: '0.75rem',
                fontSize: '0.85rem',
                color: '#cbd5e1',
                lineHeight: 1.55,
                maxWidth: '430px',
                margin: '0.75rem 0 0',
              }}
            >
              A simple and powerful platform to manage projects, tasks, teams, and track progress — all in one place.
            </p>

            {/* 4 Feature Highlights */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                marginTop: '1.5rem',
                maxWidth: '380px',
              }}
            >
              {/* Feature 1 */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: '#4338ca',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    flexShrink: 0,
                    boxShadow: '0 2px 6px rgba(67, 56, 202, 0.4)',
                  }}
                >
                  <Check size={16} strokeWidth={3} />
                </div>
                <div>
                  <div style={{ fontSize: '0.86rem', fontWeight: '700', color: '#ffffff', lineHeight: 1.2 }}>
                    Task Management
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8', lineHeight: 1.2 }}>
                    Create, assign and track tasks easily
                  </div>
                </div>
              </div>

              {/* Feature 2 */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: '#10b981',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    flexShrink: 0,
                    boxShadow: '0 2px 6px rgba(16, 185, 129, 0.4)',
                  }}
                >
                  <Users size={16} />
                </div>
                <div>
                  <div style={{ fontSize: '0.86rem', fontWeight: '700', color: '#ffffff', lineHeight: 1.2 }}>
                    Team Collaboration
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8', lineHeight: 1.2 }}>
                    Work together, achieve more
                  </div>
                </div>
              </div>

              {/* Feature 3 */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: '#f59e0b',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    flexShrink: 0,
                    boxShadow: '0 2px 6px rgba(245, 158, 11, 0.4)',
                  }}
                >
                  <BarChart2 size={16} />
                </div>
                <div>
                  <div style={{ fontSize: '0.86rem', fontWeight: '700', color: '#ffffff', lineHeight: 1.2 }}>
                    Powerful Analytics
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8', lineHeight: 1.2 }}>
                    Get insights and make better decisions
                  </div>
                </div>
              </div>

              {/* Feature 4 */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: '#ef4444',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    flexShrink: 0,
                    boxShadow: '0 2px 6px rgba(239, 68, 68, 0.4)',
                  }}
                >
                  <ShieldCheck size={16} />
                </div>
                <div>
                  <div style={{ fontSize: '0.86rem', fontWeight: '700', color: '#ffffff', lineHeight: 1.2 }}>
                    Secure &amp; Reliable
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8', lineHeight: 1.2 }}>
                    Your data is always protected
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Floating UI Mockup Window in Background */}
          <div
            style={{
              position: 'absolute',
              right: '-18px',
              top: '230px',
              width: '310px',
              backgroundColor: '#0f172a',
              borderRadius: '16px',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              boxShadow: '0 25px 50px -10px rgba(0, 0, 0, 0.55), 0 0 0 1px rgba(255, 255, 255, 0.1)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              opacity: 0.94,
              zIndex: 1,
            }}
          >
            {/* Window Titlebar */}
            <div
              style={{
                height: '24px',
                backgroundColor: '#1e293b',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                alignItems: 'center',
                padding: '0 10px',
                gap: '5px',
              }}
            >
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#ef4444' }} />
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#f59e0b' }} />
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#10b981' }} />
            </div>

            {/* Window Body: Mini Sidebar + Mini Content */}
            <div style={{ display: 'flex', minHeight: '220px' }}>
              {/* Mini Sidebar */}
              <div
                style={{
                  width: '88px',
                  backgroundColor: '#09111e',
                  borderRight: '1px solid rgba(255, 255, 255, 0.08)',
                  padding: '8px 6px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '6px' }}>
                  <div
                    style={{
                      width: '14px',
                      height: '14px',
                      borderRadius: '4px',
                      backgroundColor: '#2563eb',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Layers size={9} color="#ffffff" />
                  </div>
                  <span style={{ fontSize: '9px', fontWeight: '800', color: '#ffffff' }}>TaskFlow</span>
                </div>

                <div
                  style={{
                    padding: '3px 6px',
                    borderRadius: '4px',
                    backgroundColor: '#2563eb',
                    color: '#ffffff',
                    fontSize: '8px',
                    fontWeight: '700',
                  }}
                >
                  Dashboard
                </div>

                {['Projects', 'Tasks', 'Calendar', 'Team', 'Reports'].map((item) => (
                  <div
                    key={item}
                    style={{
                      padding: '3px 6px',
                      color: '#94a3b8',
                      fontSize: '8px',
                      fontWeight: '500',
                    }}
                  >
                    {item}
                  </div>
                ))}
              </div>

              {/* Mini Dashboard Content */}
              <div
                style={{
                  flex: 1,
                  backgroundColor: '#ffffff',
                  padding: '8px 10px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}
              >
                {/* Project Overview Card */}
                <div
                  style={{
                    backgroundColor: '#f8fafc',
                    borderRadius: '8px',
                    padding: '6px 8px',
                    border: '1px solid #e2e8f0',
                  }}
                >
                  <div style={{ fontSize: '8.5px', fontWeight: '800', color: '#0f172a', marginBottom: '4px' }}>
                    Project Overview
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ position: 'relative', width: '36px', height: '36px' }}>
                      <svg width="36" height="36" viewBox="0 0 36 36">
                        <path
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="#e2e8f0"
                          strokeWidth="3.6"
                        />
                        <path
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="#10b981"
                          strokeWidth="3.6"
                          strokeDasharray="78, 100"
                        />
                        <text x="18" y="21" textAnchor="middle" fontSize="8.5" fontWeight="800" fill="#0f172a">
                          78%
                        </text>
                      </svg>
                    </div>
                    <div>
                      <div style={{ fontSize: '8px', fontWeight: '700', color: '#0f172a' }}>Tasks Completed</div>
                      <div style={{ fontSize: '7.5px', color: '#64748b' }}>78 of 100</div>
                    </div>
                  </div>
                </div>

                {/* Recent Tasks */}
                <div
                  style={{
                    backgroundColor: '#f8fafc',
                    borderRadius: '8px',
                    padding: '6px 8px',
                    border: '1px solid #e2e8f0',
                  }}
                >
                  <div style={{ fontSize: '8.5px', fontWeight: '800', color: '#0f172a', marginBottom: '4px' }}>
                    Recent Tasks
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {[
                      { name: 'UI Design', status: 'In Progress', color: '#8b5cf6' },
                      { name: 'API Integration', status: 'In Review', color: '#f59e0b' },
                      { name: 'Testing & QA', status: 'Completed', color: '#10b981' },
                      { name: 'Deployment', status: 'Pending', color: '#eab308' },
                    ].map((task) => (
                      <div
                        key={task.name}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          fontSize: '7.5px',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <span style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: task.color }} />
                          <span style={{ fontWeight: '600', color: '#334155' }}>{task.name}</span>
                        </div>
                        <span style={{ color: '#64748b', fontSize: '7px' }}>{task.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Floating Testimonial Quote Card in Foreground Bottom-Left */}
          <div
            style={{
              position: 'relative',
              zIndex: 10,
              marginTop: 'auto',
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              padding: '12px 16px',
              maxWidth: '310px',
              boxShadow: '0 16px 32px -4px rgba(0, 0, 0, 0.35)',
              border: '1px solid rgba(255, 255, 255, 0.4)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', marginBottom: '8px' }}>
              <span
                style={{
                  fontSize: '1.3rem',
                  fontWeight: '900',
                  color: '#2563eb',
                  lineHeight: 1,
                  fontFamily: 'serif',
                }}
              >
                “
              </span>
              <p
                style={{
                  margin: 0,
                  fontSize: '0.78rem',
                  fontWeight: '600',
                  color: '#334155',
                  lineHeight: 1.35,
                }}
              >
                “TaskFlow has made our team more productive and organized.”
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <img
                src="/avatars/alex_morgan.jpg"
                alt="Tanvir Ahmed"
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '2px solid #e2e8f0',
                }}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: '800', color: '#0f172a', lineHeight: 1.15 }}>
                  Tanvir Ahmed
                </span>
                <span style={{ fontSize: '0.7rem', color: '#64748b', lineHeight: 1.15 }}>
                  Lead Product Manager
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Form Container */}
        <div
          style={{
            padding: '2.5rem 2.25rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            backgroundColor: '#ffffff',
            position: 'relative',
          }}
        >
          <Outlet />
        </div>
      </div>
    </div>
  );
}
