import React, { useState, useEffect } from 'react';
import { getDashboardApi } from '../api/dashboard.js';
import Navbar from '../components/Navbar.jsx';
import ProgressBar from '../components/ProgressBar.jsx';
import PieChart from '../components/PieChart.jsx';
import HistogramChart from '../components/HistogramChart.jsx';
import OgiveCurveChart from '../components/OgiveCurveChart.jsx';
import {
  BarChart2,
  TrendingUp,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FolderKanban,
  Target,
  Zap,
} from 'lucide-react';

export default function Analytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await getDashboardApi();
        setData(res.data);
      } catch (err) {
        setError(err.message || 'Failed to load analytics');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <Navbar
        title="Analytics & Reports"
        subtitle="Visual analytics on project delivery velocity, task completion, and team performance"
      />

      <div style={{ padding: '2rem', flex: 1, overflowY: 'auto' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: '#64748b' }}>
            <div style={{ fontSize: '1.25rem', fontWeight: '700' }}>Loading analytics...</div>
            <p style={{ fontSize: '0.875rem', marginTop: '6px' }}>Crunching database metrics</p>
          </div>
        ) : error || !data ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#dc2626', backgroundColor: '#fef2f2', borderRadius: '16px' }}>
            {error || 'No analytics data available'}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Top KPIs */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '1.25rem',
            }}>
              <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '1.5rem', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#64748b' }}>Overall Completion</span>
                  <Target size={18} color="#2563eb" />
                </div>
                <div style={{ fontSize: '2.25rem', fontWeight: '800', color: '#0f172a', marginTop: '8px' }}>
                  {data.summary.overallProgress}%
                </div>
                <div style={{ marginTop: '8px' }}>
                  <ProgressBar progress={data.summary.overallProgress} />
                </div>
              </div>

              <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '1.5rem', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#64748b' }}>Completed Tasks</span>
                  <CheckCircle2 size={18} color="#10b981" />
                </div>
                <div style={{ fontSize: '2.25rem', fontWeight: '800', color: '#10b981', marginTop: '8px' }}>
                  {data.summary.completedTasks}
                </div>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Out of {data.summary.totalTasks} total tasks</span>
              </div>

              <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '1.5rem', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#64748b' }}>Overdue Tasks</span>
                  <AlertTriangle size={18} color="#ef4444" />
                </div>
                <div style={{ fontSize: '2.25rem', fontWeight: '800', color: '#ef4444', marginTop: '8px' }}>
                  {data.summary.overdueTasks}
                </div>
                <span style={{ fontSize: '0.8rem', color: '#ef4444', fontWeight: '600' }}>Requires attention</span>
              </div>

              <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '1.5rem', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#64748b' }}>Active Projects</span>
                  <FolderKanban size={18} color="#8b5cf6" />
                </div>
                <div style={{ fontSize: '2.25rem', fontWeight: '800', color: '#8b5cf6', marginTop: '8px' }}>
                  {data.projectsSummary.active}
                </div>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Total {data.projectsSummary.total} projects</span>
              </div>
            </div>

            {/* Visual Charts Grid: Pie Chart & Histogram */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
              gap: '1.5rem',
            }}>
              {/* Interactive Pie Chart */}
              <PieChart data={data} />

              {/* Interactive Histogram */}
              <HistogramChart data={data} />
            </div>

            {/* Ogive Curve (Cumulative Frequency / S-Curve) */}
            <OgiveCurveChart data={data} />

            {/* Linear Progress Breakdown Visuals */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
              gap: '1.5rem',
            }}>
              {/* Status Breakdown Card */}
              <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '1.75rem', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a', marginBottom: '1.25rem' }}>
                  Task Status Distribution Bars
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                      <span style={{ fontWeight: '600', color: '#2563eb' }}>To Do</span>
                      <span style={{ fontWeight: '700' }}>{data.tasksSummary.byStatus.toDo} tasks</span>
                    </div>
                    <div style={{ height: '8px', borderRadius: '4px', backgroundColor: '#eff6ff', overflow: 'hidden' }}>
                      <div style={{ width: `${data.summary.totalTasks ? (data.tasksSummary.byStatus.toDo / data.summary.totalTasks) * 100 : 0}%`, height: '100%', backgroundColor: '#2563eb' }} />
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                      <span style={{ fontWeight: '600', color: '#d97706' }}>In Progress</span>
                      <span style={{ fontWeight: '700' }}>{data.tasksSummary.byStatus.inProgress} tasks</span>
                    </div>
                    <div style={{ height: '8px', borderRadius: '4px', backgroundColor: '#fffbeb', overflow: 'hidden' }}>
                      <div style={{ width: `${data.summary.totalTasks ? (data.tasksSummary.byStatus.inProgress / data.summary.totalTasks) * 100 : 0}%`, height: '100%', backgroundColor: '#f59e0b' }} />
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                      <span style={{ fontWeight: '600', color: '#059669' }}>Completed</span>
                      <span style={{ fontWeight: '700' }}>{data.tasksSummary.byStatus.completed} tasks</span>
                    </div>
                    <div style={{ height: '8px', borderRadius: '4px', backgroundColor: '#ecfdf5', overflow: 'hidden' }}>
                      <div style={{ width: `${data.summary.totalTasks ? (data.tasksSummary.byStatus.completed / data.summary.totalTasks) * 100 : 0}%`, height: '100%', backgroundColor: '#10b981' }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Priority Breakdown Card */}
              <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '1.75rem', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a', marginBottom: '1.25rem' }}>
                  Task Priority Breakdown Bars
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                      <span style={{ fontWeight: '600', color: '#e11d48' }}>High Priority</span>
                      <span style={{ fontWeight: '700' }}>{data.tasksSummary.byPriority.high} tasks</span>
                    </div>
                    <div style={{ height: '8px', borderRadius: '4px', backgroundColor: '#fff1f2', overflow: 'hidden' }}>
                      <div style={{ width: `${data.summary.totalTasks ? (data.tasksSummary.byPriority.high / data.summary.totalTasks) * 100 : 0}%`, height: '100%', backgroundColor: '#e11d48' }} />
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                      <span style={{ fontWeight: '600', color: '#d97706' }}>Medium Priority</span>
                      <span style={{ fontWeight: '700' }}>{data.tasksSummary.byPriority.medium} tasks</span>
                    </div>
                    <div style={{ height: '8px', borderRadius: '4px', backgroundColor: '#fffbeb', overflow: 'hidden' }}>
                      <div style={{ width: `${data.summary.totalTasks ? (data.tasksSummary.byPriority.medium / data.summary.totalTasks) * 100 : 0}%`, height: '100%', backgroundColor: '#f59e0b' }} />
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                      <span style={{ fontWeight: '600', color: '#16a34a' }}>Low Priority</span>
                      <span style={{ fontWeight: '700' }}>{data.tasksSummary.byPriority.low} tasks</span>
                    </div>
                    <div style={{ height: '8px', borderRadius: '4px', backgroundColor: '#f0fdf4', overflow: 'hidden' }}>
                      <div style={{ width: `${data.summary.totalTasks ? (data.tasksSummary.byPriority.low / data.summary.totalTasks) * 100 : 0}%`, height: '100%', backgroundColor: '#16a34a' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
