import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getDashboardApi } from '../api/dashboard.js';
import Navbar from '../components/Navbar.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import PriorityBadge from '../components/PriorityBadge.jsx';
import ProgressBar from '../components/ProgressBar.jsx';
import {
  FolderKanban,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Layers,
  Sparkles,
} from 'lucide-react';

export default function Dashboard() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getDashboardApi();
      setMetrics(res.data);
    } catch (err) {
      setError(err.message || 'Failed to load dashboard metrics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <Navbar
        title="Dashboard"
        subtitle="Manage and monitor all active projects and metrics"
      />

      <div style={{ padding: '2rem', flex: 1, overflowY: 'auto' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: '#64748b' }}>
            <div style={{ fontSize: '1.25rem', fontWeight: '700' }}>Loading analytics...</div>
            <p style={{ fontSize: '0.875rem', marginTop: '6px' }}>Fetching live database metrics</p>
          </div>
        ) : error ? (
          <div style={{
            padding: '2rem',
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '16px',
            textAlign: 'center',
            color: '#b91c1c',
          }}>
            <AlertTriangle size={36} color="#ef4444" style={{ margin: '0 auto 10px' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Failed to Load Dashboard</h3>
            <p style={{ fontSize: '0.85rem', marginTop: '4px' }}>{error}</p>
            <button
              onClick={fetchDashboard}
              style={{
                marginTop: '1rem',
                padding: '8px 18px',
                backgroundColor: '#dc2626',
                color: '#ffffff',
                borderRadius: '8px',
                fontWeight: '600',
                fontSize: '0.85rem',
              }}
            >
              Retry
            </button>
          </div>
        ) : (
          <>
            {/* 4 Stat Metric Cards (Matches Image 4) */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '1.25rem',
              marginBottom: '2rem',
            }}>
              {/* Card 1: Active Projects */}
              <div style={{
                backgroundColor: '#f8fafc',
                borderRadius: '16px',
                padding: '1.5rem',
                border: '1px solid #e2e8f0',
                textAlign: 'center',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.02)',
              }}>
                <div style={{ fontSize: '2.5rem', fontWeight: '800', color: '#0f172a', lineHeight: 1 }}>
                  {metrics.projectsSummary.active || metrics.summary.totalProjects}
                </div>
                <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#64748b', marginTop: '8px' }}>
                  Active Projects
                </div>
              </div>

              {/* Card 2: In Progress Tasks */}
              <div style={{
                backgroundColor: '#f5f3ff',
                borderRadius: '16px',
                padding: '1.5rem',
                border: '1px solid #ede9fe',
                textAlign: 'center',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.02)',
              }}>
                <div style={{ fontSize: '2.5rem', fontWeight: '800', color: '#7c3aed', lineHeight: 1 }}>
                  {metrics.tasksSummary.byStatus.inProgress}
                </div>
                <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#6d28d9', marginTop: '8px' }}>
                  In Progress Tasks
                </div>
              </div>

              {/* Card 3: Completed Tasks */}
              <div style={{
                backgroundColor: '#ecfdf5',
                borderRadius: '16px',
                padding: '1.5rem',
                border: '1px solid #d1fae5',
                textAlign: 'center',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.02)',
              }}>
                <div style={{ fontSize: '2.5rem', fontWeight: '800', color: '#059669', lineHeight: 1 }}>
                  {metrics.summary.completedTasks}
                </div>
                <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#047857', marginTop: '8px' }}>
                  Completed Tasks
                </div>
              </div>

              {/* Card 4: Overdue / At Risk */}
              <div style={{
                backgroundColor: '#fff1f2',
                borderRadius: '16px',
                padding: '1.5rem',
                border: '1px solid #ffe4e6',
                textAlign: 'center',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.02)',
              }}>
                <div style={{ fontSize: '2.5rem', fontWeight: '800', color: '#e11d48', lineHeight: 1 }}>
                  {metrics.summary.overdueTasks}
                </div>
                <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#be123c', marginTop: '8px' }}>
                  Overdue Tasks
                </div>
              </div>
            </div>

            {/* Split Analytics Section */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '1.5rem',
              marginBottom: '2rem',
            }}>
              {/* Task Breakdown by Status */}
              <div style={{
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                padding: '1.5rem',
                border: '1px solid #e2e8f0',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.03)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#0f172a' }}>
                    Task Status Breakdown
                  </h3>
                  <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#2563eb' }}>
                    Overall Progress: {metrics.summary.overallProgress}%
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px', fontWeight: '600' }}>
                      <span style={{ color: '#475569' }}>To Do</span>
                      <span>{metrics.tasksSummary.byStatus.toDo} tasks</span>
                    </div>
                    <div style={{ width: '100%', height: '8px', backgroundColor: '#f1f5f9', borderRadius: '9999px', overflow: 'hidden' }}>
                      <div style={{
                        width: `${metrics.summary.totalTasks > 0 ? (metrics.tasksSummary.byStatus.toDo / metrics.summary.totalTasks) * 100 : 0}%`,
                        height: '100%',
                        backgroundColor: '#94a3b8',
                      }} />
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px', fontWeight: '600' }}>
                      <span style={{ color: '#2563eb' }}>In Progress</span>
                      <span>{metrics.tasksSummary.byStatus.inProgress} tasks</span>
                    </div>
                    <div style={{ width: '100%', height: '8px', backgroundColor: '#f1f5f9', borderRadius: '9999px', overflow: 'hidden' }}>
                      <div style={{
                        width: `${metrics.summary.totalTasks > 0 ? (metrics.tasksSummary.byStatus.inProgress / metrics.summary.totalTasks) * 100 : 0}%`,
                        height: '100%',
                        backgroundColor: '#3b82f6',
                      }} />
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px', fontWeight: '600' }}>
                      <span style={{ color: '#059669' }}>Completed</span>
                      <span>{metrics.tasksSummary.completed} tasks</span>
                    </div>
                    <div style={{ width: '100%', height: '8px', backgroundColor: '#f1f5f9', borderRadius: '9999px', overflow: 'hidden' }}>
                      <div style={{
                        width: `${metrics.summary.totalTasks > 0 ? (metrics.tasksSummary.completed / metrics.summary.totalTasks) * 100 : 0}%`,
                        height: '100%',
                        backgroundColor: '#10b981',
                      }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Task Breakdown by Priority */}
              <div style={{
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                padding: '1.5rem',
                border: '1px solid #e2e8f0',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.03)',
              }}>
                <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#0f172a', marginBottom: '1.25rem' }}>
                  Tasks by Priority
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', textAlign: 'center' }}>
                  <div style={{ backgroundColor: '#fff1f2', padding: '1.25rem 0.75rem', borderRadius: '12px', border: '1px solid #ffe4e6' }}>
                    <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#e11d48' }}>
                      {metrics.tasksSummary.byPriority.high}
                    </div>
                    <div style={{ fontSize: '0.8rem', fontWeight: '600', color: '#be123c', marginTop: '4px' }}>
                      High Priority
                    </div>
                  </div>

                  <div style={{ backgroundColor: '#fffbeb', padding: '1.25rem 0.75rem', borderRadius: '12px', border: '1px solid #fef3c7' }}>
                    <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#d97706' }}>
                      {metrics.tasksSummary.byPriority.medium}
                    </div>
                    <div style={{ fontSize: '0.8rem', fontWeight: '600', color: '#b45309', marginTop: '4px' }}>
                      Medium Priority
                    </div>
                  </div>

                  <div style={{ backgroundColor: '#f0fdf4', padding: '1.25rem 0.75rem', borderRadius: '12px', border: '1px solid #dcfce7' }}>
                    <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#16a34a' }}>
                      {metrics.tasksSummary.byPriority.low}
                    </div>
                    <div style={{ fontSize: '0.8rem', fontWeight: '600', color: '#15803d', marginTop: '4px' }}>
                      Low Priority
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Projects Section (Matches Image 4 Grid) */}
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              padding: '1.5rem',
              border: '1px solid #e2e8f0',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.03)',
              marginBottom: '2rem',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a' }}>
                  Active Projects Overview
                </h3>
                <Link
                  to="/projects"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: '700', color: '#2563eb' }}
                >
                  <span>View All Projects</span>
                  <ArrowRight size={16} />
                </Link>
              </div>

              {metrics.recentProjects.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                  No projects created yet. <Link to="/projects" style={{ color: '#2563eb', fontWeight: '600' }}>Create your first project!</Link>
                </div>
              ) : (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                  gap: '1.25rem',
                }}>
                  {metrics.recentProjects.map((proj) => (
                    <div
                      key={proj.id}
                      style={{
                        padding: '1.25rem',
                        borderRadius: '12px',
                        border: '1px solid #e2e8f0',
                        backgroundColor: '#ffffff',
                        transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.05)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                        <h4 style={{ fontSize: '1rem', fontWeight: '700', color: '#0f172a' }}>
                          {proj.title}
                        </h4>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <StatusBadge status={proj.status} />
                          <PriorityBadge priority={proj.priority} />
                        </div>
                      </div>

                      <div style={{ margin: '1rem 0' }}>
                        <ProgressBar
                          completed={proj.completed_tasks}
                          total={proj.total_tasks}
                          percentage={proj.progress_percentage}
                        />
                      </div>

                      {proj.due_date && (
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                          Due: {new Date(proj.due_date).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Urgent / Overdue Tasks List */}
            {metrics.urgentTasks && metrics.urgentTasks.length > 0 && (
              <div style={{
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                padding: '1.5rem',
                border: '1px solid #e2e8f0',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.03)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a' }}>
                    Urgent & Overdue Tasks
                  </h3>
                  <Link
                    to="/tasks"
                    style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: '700', color: '#2563eb' }}
                  >
                    <span>Go to Kanban Board</span>
                    <ArrowRight size={16} />
                  </Link>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {metrics.urgentTasks.map((task) => (
                    <div
                      key={task.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 14px',
                        borderRadius: '10px',
                        backgroundColor: task.is_overdue ? '#fff1f2' : '#f8fafc',
                        border: `1px solid ${task.is_overdue ? '#fecdd3' : '#e2e8f0'}`,
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          backgroundColor: task.is_overdue ? '#e11d48' : '#3b82f6',
                        }} />
                        <div>
                          <div style={{ fontSize: '0.9rem', fontWeight: '600', color: '#0f172a' }}>
                            {task.title}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                            Project: {task.project_title} • Assigned to: {task.assignee_name}
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {task.is_overdue && (
                          <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#e11d48', backgroundColor: '#ffe4e6', padding: '2px 8px', borderRadius: '4px' }}>
                            Overdue
                          </span>
                        )}
                        <StatusBadge status={task.status} />
                        <PriorityBadge priority={task.priority} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
