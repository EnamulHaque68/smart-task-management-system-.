import React, { useState, useEffect } from 'react';
import { getProjectsApi } from '../api/projects.js';
import { getTasksApi } from '../api/tasks.js';
import Navbar from '../components/Navbar.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import ProgressBar from '../components/ProgressBar.jsx';
import { FileText, Printer, Download, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function Reports() {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pRes, tRes] = await Promise.all([getProjectsApi(), getTasksApi()]);
        setProjects(pRes.data.projects || []);
        setTasks(tRes.data.tasks || []);
      } catch (err) {
        console.error('Failed to load reports', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <Navbar
        title="Executive Reports"
        subtitle="Audit, compliance, and milestone reports for Bright Mind stakeholders"
      />

      <div style={{ padding: '2rem', flex: 1, overflowY: 'auto' }}>
        {/* Actions bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
          gap: '1rem',
        }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a' }}>
              Project Milestone Audit
            </h3>
            <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
              Generated on {new Date().toLocaleDateString()}
            </span>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={handlePrint}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '9px 16px',
                backgroundColor: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#334155',
                cursor: 'pointer',
              }}
            >
              <Printer size={16} />
              <span>Print Report</span>
            </button>
          </div>
        </div>

        {/* Report Table */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          overflow: 'hidden',
          boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b' }}>
                <th style={{ padding: '12px 16px', fontWeight: '700' }}>Project Title</th>
                <th style={{ padding: '12px 16px', fontWeight: '700' }}>Status</th>
                <th style={{ padding: '12px 16px', fontWeight: '700' }}>Priority</th>
                <th style={{ padding: '12px 16px', fontWeight: '700' }}>Total Tasks</th>
                <th style={{ padding: '12px 16px', fontWeight: '700' }}>Completed</th>
                <th style={{ padding: '12px 16px', fontWeight: '700' }}>Progress</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p) => (
                <tr key={p.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '14px 16px', fontWeight: '700', color: '#0f172a' }}>{p.title}</td>
                  <td style={{ padding: '14px 16px' }}><StatusBadge status={p.status} /></td>
                  <td style={{ padding: '14px 16px', fontWeight: '600', color: p.priority === 'High' ? '#e11d48' : '#d97706' }}>{p.priority}</td>
                  <td style={{ padding: '14px 16px' }}>{p.total_tasks || 0}</td>
                  <td style={{ padding: '14px 16px', color: '#10b981', fontWeight: '700' }}>{p.completed_tasks || 0}</td>
                  <td style={{ padding: '14px 16px', minWidth: '160px' }}>
                    <ProgressBar progress={p.progress_percentage || 0} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
