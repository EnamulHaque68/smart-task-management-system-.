import React, { useState, useEffect } from 'react';
import { getUsersApi } from '../api/auth.js';
import { getTasksApi } from '../api/tasks.js';
import Navbar from '../components/Navbar.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import PriorityBadge from '../components/PriorityBadge.jsx';
import {
  Users,
  Mail,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Briefcase,
  AlertCircle,
  Search,
} from 'lucide-react';

export default function TeamMembers() {
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [usersRes, tasksRes] = await Promise.all([
        getUsersApi(),
        getTasksApi(),
      ]);
      setUsers(usersRes.data.users || []);
      setTasks(tasksRes.data.tasks || []);
    } catch (err) {
      setError(err.message || 'Failed to load team data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <Navbar
        title="Team Members"
        subtitle="Manage team members, view workloads, and track task allocations"
        searchValue={searchTerm}
        onSearch={setSearchTerm}
      />

      <div style={{ padding: '2rem', flex: 1, overflowY: 'auto' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: '#64748b' }}>
            <div style={{ fontSize: '1.25rem', fontWeight: '700' }}>Loading team members...</div>
            <p style={{ fontSize: '0.875rem', marginTop: '6px' }}>Fetching active users and task assignments</p>
          </div>
        ) : error ? (
          <div style={{
            padding: '2rem',
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '16px',
            textAlign: 'center',
            color: '#dc2626',
          }}>
            <AlertCircle size={32} style={{ margin: '0 auto 12px' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Failed to Load Team</h3>
            <p style={{ fontSize: '0.9rem', marginTop: '6px' }}>{error}</p>
          </div>
        ) : (
          <div>
            {/* Team Stats Summary */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '1.25rem',
              marginBottom: '2rem',
            }}>
              <div style={{
                backgroundColor: '#ffffff',
                padding: '1.25rem',
                borderRadius: '14px',
                border: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
              }}>
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  backgroundColor: '#eff6ff',
                  color: '#2563eb',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Users size={22} />
                </div>
                <div>
                  <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0f172a' }}>{users.length}</div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600' }}>Total Members</div>
                </div>
              </div>

              <div style={{
                backgroundColor: '#ffffff',
                padding: '1.25rem',
                borderRadius: '14px',
                border: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
              }}>
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  backgroundColor: '#ecfdf5',
                  color: '#10b981',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Briefcase size={22} />
                </div>
                <div>
                  <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0f172a' }}>{tasks.length}</div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600' }}>Active Tasks</div>
                </div>
              </div>
            </div>

            {/* Member Cards Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '1.5rem',
            }}>
              {filteredUsers.map((member) => {
                const memberTasks = tasks.filter((t) => t.assigned_to === member.id);
                const completedCount = memberTasks.filter((t) => t.status === 'Completed').length;
                const inProgressCount = memberTasks.filter((t) => t.status === 'In Progress').length;

                return (
                  <div
                    key={member.id}
                    style={{
                      backgroundColor: '#ffffff',
                      borderRadius: '16px',
                      border: '1px solid #e2e8f0',
                      padding: '1.5rem',
                      boxShadow: '0 2px 6px rgba(0, 0, 0, 0.03)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '1rem',
                      transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.06)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 2px 6px rgba(0, 0, 0, 0.03)';
                    }}
                  >
                    {/* Member Header */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div style={{
                        width: '50px',
                        height: '50px',
                        borderRadius: '50%',
                        backgroundColor: member.avatar_color || '#2563eb',
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.1rem',
                        fontWeight: '800',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                      }}>
                        {getInitials(member.name)}
                      </div>
                      <div>
                        <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0f172a' }}>
                          {member.name}
                        </h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '0.8rem', marginTop: '2px' }}>
                          <Mail size={13} />
                          <span>{member.email}</span>
                        </div>
                      </div>
                    </div>

                    {/* Workload Stats */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(3, 1fr)',
                      gap: '8px',
                      backgroundColor: '#f8fafc',
                      borderRadius: '10px',
                      padding: '10px',
                      textAlign: 'center',
                    }}>
                      <div>
                        <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a' }}>{memberTasks.length}</div>
                        <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: '600' }}>Assigned</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#f59e0b' }}>{inProgressCount}</div>
                        <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: '600' }}>In Progress</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#10b981' }}>{completedCount}</div>
                        <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: '600' }}>Completed</div>
                      </div>
                    </div>

                    {/* Member Active Tasks Preview */}
                    <div>
                      <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '6px' }}>
                        Active Tasks ({memberTasks.length})
                      </div>
                      {memberTasks.length === 0 ? (
                        <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontStyle: 'italic' }}>
                          No tasks assigned currently.
                        </div>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          {memberTasks.slice(0, 3).map((t) => (
                            <div
                              key={t.id}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                fontSize: '0.8rem',
                                padding: '6px 8px',
                                backgroundColor: '#f8fafc',
                                borderRadius: '6px',
                                border: '1px solid #f1f5f9',
                              }}
                            >
                              <span style={{ fontWeight: '600', color: '#0f172a', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '180px' }}>
                                {t.title}
                              </span>
                              <StatusBadge status={t.status} />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
