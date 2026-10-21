import React, { useState, useEffect } from 'react';
import { getTasksApi } from '../api/tasks.js';
import Navbar from '../components/Navbar.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import PriorityBadge from '../components/PriorityBadge.jsx';
import { Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight, CheckSquare } from 'lucide-react';

export default function CalendarView() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await getTasksApi();
        setTasks(res.data.tasks || []);
      } catch (err) {
        console.error('Failed to load tasks', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <Navbar
        title="Schedule & Calendar"
        subtitle="Timeline and deadline roadmap for active tasks and deliverables"
      />

      <div style={{ padding: '2rem', flex: 1, overflowY: 'auto' }}>
        {/* Header month banner */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          padding: '1.25rem 1.5rem',
          border: '1px solid #e2e8f0',
          marginBottom: '1.5rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <CalendarIcon size={22} color="#2563eb" />
            <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a' }}>
              Sprint Schedule Overview
            </h2>
          </div>
          <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '600' }}>
            Total {tasks.length} Scheduled Deliverables
          </span>
        </div>

        {/* Task Timeline Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.25rem',
        }}>
          {tasks.map((task) => (
            <div
              key={task.id}
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '14px',
                border: '1px solid #e2e8f0',
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#2563eb', backgroundColor: '#eff6ff', padding: '2px 8px', borderRadius: '4px' }}>
                  {task.project_title}
                </span>
                <PriorityBadge priority={task.priority} />
              </div>

              <h4 style={{ fontSize: '1rem', fontWeight: '700', color: '#0f172a' }}>
                {task.title}
              </h4>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '6px', paddingTop: '8px', borderTop: '1px solid #f1f5f9' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#64748b' }}>
                  <Clock size={14} />
                  <span>{task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No date'}</span>
                </div>
                <StatusBadge status={task.status} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
