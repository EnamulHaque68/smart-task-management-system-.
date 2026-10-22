import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import {
  HelpCircle,
  BookOpen,
  MessageCircle,
  ExternalLink,
  ShieldCheck,
  Search,
  CheckCircle2,
  Send,
  X,
  Mail,
  LifeBuoy
} from 'lucide-react';

export default function Support() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [ticketModalOpen, setTicketModalOpen] = useState(false);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMessage, setTicketMessage] = useState('');
  const [submittedTicket, setSubmittedTicket] = useState(false);

  const faqs = [
    {
      q: 'How do I create a new project?',
      a: 'Go to the Projects page from the sidebar and click "+ New Project". Enter the project title, target due date, priority level, and click Create Project.',
      tag: 'Projects'
    },
    {
      q: 'How does the Kanban Board work?',
      a: 'On the Tasks page, tasks are separated into TODO, IN PROGRESS, and COMPLETE columns. You can use the Quick Start or Done buttons to move tasks through your sprint workflow.',
      tag: 'Tasks'
    },
    {
      q: 'How do I assign team members to a task?',
      a: 'When creating or editing a task, open the "Assignee" dropdown. You can select any team member in your organization to assign responsibilities.',
      tag: 'Team'
    },
    {
      q: 'What determines an overdue task?',
      a: 'A task is counted as overdue if its due date is prior to today and its status is not marked as Completed. Overdue alerts appear live in the top notification bell.',
      tag: 'Tasks'
    },
    {
      q: 'How do I change my profile avatar color or job title?',
      a: 'Navigate to General Settings from the sidebar or top profile menu, select the "Personal Profile" tab, choose your brand accent color, and click Save Changes.',
      tag: 'Settings'
    },
    {
      q: 'How can I change my account password?',
      a: 'In General Settings, switch to the "Security & Password" tab. Input your current password followed by your desired new password (minimum 6 characters).',
      tag: 'Security'
    }
  ];

  const filteredFaqs = faqs.filter(
    (f) =>
      f.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.a.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.tag.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleTicketSubmit = (e) => {
    e.preventDefault();
    if (!ticketSubject.trim() || !ticketMessage.trim()) return;

    setSubmittedTicket(true);
    setTicketModalOpen(false);
    setTicketSubject('');
    setTicketMessage('');
    setTimeout(() => setSubmittedTicket(false), 5000);
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <Navbar
        title="Help & Support"
        subtitle="Frequently asked questions, system guides, and helpdesk assistance"
      />

      <div style={{ padding: '2rem', flex: 1, overflowY: 'auto', maxWidth: '850px', margin: '0 auto', width: '100%' }}>
        {/* Success Alert */}
        {submittedTicket && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            backgroundColor: '#ecfdf5',
            color: '#065f46',
            padding: '14px 18px',
            borderRadius: '12px',
            marginBottom: '1.5rem',
            border: '1px solid #a7f3d0',
            fontWeight: '600',
            fontSize: '0.925rem',
            boxShadow: '0 4px 6px -1px rgba(16, 185, 129, 0.1)',
          }}>
            <CheckCircle2 size={20} color="#059669" />
            <div>
              Support inquiry submitted successfully! A ticket confirmation has been logged for Bright Mind IT Helpdesk.
            </div>
          </div>
        )}

        {/* Search Bar */}
        <div style={{
          position: 'relative',
          marginBottom: '2rem',
        }}>
          <Search
            size={18}
            color="#94a3b8"
            style={{
              position: 'absolute',
              left: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
            }}
          />
          <input
            type="text"
            placeholder="Search FAQs, features, or guides..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 16px 12px 46px',
              borderRadius: '12px',
              border: '1px solid #cbd5e1',
              fontSize: '0.95rem',
              backgroundColor: '#ffffff',
              boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
              outline: 'none',
            }}
          />
        </div>

        {/* Quick Resource Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem',
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '14px',
            padding: '1.25rem',
            border: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
          }}>
            <div style={{ padding: '10px', backgroundColor: '#eff6ff', borderRadius: '10px' }}>
              <BookOpen size={22} color="#2563eb" />
            </div>
            <div>
              <div style={{ fontWeight: '700', fontSize: '0.95rem', color: '#0f172a' }}>Documentation</div>
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>User workflow tutorials</div>
            </div>
          </div>

          <div
            onClick={() => navigate('/messages')}
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '14px',
              padding: '1.25rem',
              border: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              cursor: 'pointer',
              transition: 'border-color 0.15s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#93c5fd')}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#e2e8f0')}
          >
            <div style={{ padding: '10px', backgroundColor: '#f0fdf4', borderRadius: '10px' }}>
              <MessageCircle size={22} color="#16a34a" />
            </div>
            <div>
              <div style={{ fontWeight: '700', fontSize: '0.95rem', color: '#0f172a' }}>Team Chat Room</div>
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Ask colleagues for tips</div>
            </div>
          </div>

          <div
            onClick={() => setTicketModalOpen(true)}
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '14px',
              padding: '1.25rem',
              border: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              cursor: 'pointer',
              transition: 'border-color 0.15s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#cbd5e1')}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#e2e8f0')}
          >
            <div style={{ padding: '10px', backgroundColor: '#fef3c7', borderRadius: '10px' }}>
              <LifeBuoy size={22} color="#d97706" />
            </div>
            <div>
              <div style={{ fontWeight: '700', fontSize: '0.95rem', color: '#0f172a' }}>Submit Ticket</div>
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Direct IT assistance</div>
            </div>
          </div>
        </div>

        {/* FAQs Section */}
        <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0f172a', marginBottom: '1rem' }}>
          Frequently Asked Questions {searchTerm && `(${filteredFaqs.length} found)`}
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', marginBottom: '2.5rem' }}>
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((f, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '14px',
                  border: '1px solid #e2e8f0',
                  padding: '1.25rem 1.5rem',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <div style={{ fontWeight: '700', fontSize: '0.95rem', color: '#0f172a' }}>
                    {f.q}
                  </div>
                  <span style={{
                    fontSize: '0.72rem',
                    fontWeight: '700',
                    padding: '2px 8px',
                    borderRadius: '6px',
                    backgroundColor: '#eff6ff',
                    color: '#2563eb',
                  }}>
                    {f.tag}
                  </span>
                </div>
                <p style={{ fontSize: '0.875rem', color: '#64748b', lineHeight: 1.55, margin: 0 }}>
                  {f.a}
                </p>
              </div>
            ))
          ) : (
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '14px',
              padding: '2rem',
              textAlign: 'center',
              border: '1px solid #e2e8f0',
              color: '#64748b',
            }}>
              No matching questions found for "{searchTerm}".
            </div>
          )}
        </div>

        {/* Contact Banner */}
        <div style={{
          backgroundColor: '#eff6ff',
          borderRadius: '16px',
          border: '1px solid #bfdbfe',
          padding: '1.5rem 1.75rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
        }}>
          <div>
            <h4 style={{ fontWeight: '800', color: '#1e40af', fontSize: '1.05rem', margin: 0 }}>
              Need personal technical assistance?
            </h4>
            <p style={{ color: '#3b82f6', fontSize: '0.85rem', marginTop: '4px', margin: 0 }}>
              Reach out to our internal IT support desk at <strong style={{ color: '#1e3a8a' }}>support@brightmind.com</strong>
            </p>
          </div>
          <button
            type="button"
            onClick={() => setTicketModalOpen(true)}
            style={{
              padding: '10px 20px',
              backgroundColor: '#2563eb',
              color: '#ffffff',
              borderRadius: '10px',
              fontSize: '0.875rem',
              fontWeight: '700',
              cursor: 'pointer',
              border: 'none',
              boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.25)',
            }}
          >
            Create Support Ticket
          </button>
        </div>
      </div>

      {/* Ticket Modal */}
      {ticketModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.5)',
          backdropFilter: 'blur(3px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem',
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '18px',
            maxWidth: '500px',
            width: '100%',
            padding: '1.75rem',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            border: '1px solid #e2e8f0',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ padding: '8px', backgroundColor: '#eff6ff', borderRadius: '8px' }}>
                  <Mail size={18} color="#2563eb" />
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                  Submit Support Ticket
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setTicketModalOpen(false)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleTicketSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                  Issue Subject
                </label>
                <input
                  type="text"
                  placeholder="e.g. Question regarding sprint permissions"
                  value={ticketSubject}
                  onChange={(e) => setTicketSubject(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.9rem',
                    outline: 'none',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                  Description & Context
                </label>
                <textarea
                  rows={4}
                  placeholder="Please describe the issue or inquiry in detail..."
                  value={ticketMessage}
                  onChange={(e) => setTicketMessage(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.9rem',
                    outline: 'none',
                    fontFamily: 'inherit',
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setTicketModalOpen(false)}
                  style={{
                    padding: '9px 16px',
                    backgroundColor: '#f1f5f9',
                    color: '#475569',
                    borderRadius: '8px',
                    fontWeight: '600',
                    fontSize: '0.875rem',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '9px 18px',
                    backgroundColor: '#2563eb',
                    color: '#ffffff',
                    borderRadius: '8px',
                    fontWeight: '700',
                    fontSize: '0.875rem',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  <Send size={15} />
                  <span>Send Inquiry</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
