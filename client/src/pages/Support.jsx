import React from 'react';
import Navbar from '../components/Navbar.jsx';
import { HelpCircle, BookOpen, MessageCircle, ExternalLink, ShieldCheck } from 'lucide-react';

export default function Support() {
  const faqs = [
    { q: 'How do I create a new project?', a: 'Go to the Projects page from the sidebar and click "+ New Project". Enter the project title, target due date, priority, and click Create Project.' },
    { q: 'How does the Kanban Board work?', a: 'On the Tasks page, tasks are separated into TODO, IN PROGRESS, and COMPLETE columns. Click "Start" or "Done" on any card to automatically move the task between columns.' },
    { q: 'How do I assign team members to a task?', a: 'When creating or editing a task, open the "Assignee" dropdown. You can search by name or email and select any team member.' },
    { q: 'What determines an overdue task?', a: 'A task is counted as overdue if its due date is prior to today and its status is not yet marked as Completed.' },
  ];

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <Navbar
        title="Help & Support"
        subtitle="Frequently asked questions and guides for Bright Mind TaskFlow"
      />

      <div style={{ padding: '2rem', flex: 1, overflowY: 'auto', maxWidth: '800px' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a', marginBottom: '1.25rem' }}>
          Frequently Asked Questions
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
          {faqs.map((f, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                padding: '1.25rem',
              }}
            >
              <div style={{ fontWeight: '700', fontSize: '0.95rem', color: '#0f172a', marginBottom: '6px' }}>
                {f.q}
              </div>
              <p style={{ fontSize: '0.875rem', color: '#64748b', lineHeight: 1.5 }}>
                {f.a}
              </p>
            </div>
          ))}
        </div>

        {/* Contact Banner */}
        <div style={{
          backgroundColor: '#eff6ff',
          borderRadius: '16px',
          border: '1px solid #bfdbfe',
          padding: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div>
            <h4 style={{ fontWeight: '800', color: '#1e40af', fontSize: '1rem' }}>Need additional assistance?</h4>
            <p style={{ color: '#3b82f6', fontSize: '0.85rem', marginTop: '2px' }}>
              Reach out to our internal IT support desk at support@brightmind.com
            </p>
          </div>
          <button
            onClick={() => alert('Support ticket simulated for Bright Mind TaskFlow')}
            style={{
              padding: '9px 16px',
              backgroundColor: '#2563eb',
              color: '#ffffff',
              borderRadius: '8px',
              fontSize: '0.85rem',
              fontWeight: '700',
              cursor: 'pointer',
            }}
          >
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
}
