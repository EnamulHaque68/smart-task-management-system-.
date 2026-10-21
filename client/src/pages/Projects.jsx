import React, { useState, useEffect } from 'react';
import {
  getProjectsApi,
  createProjectApi,
  updateProjectApi,
  deleteProjectApi,
} from '../api/projects.js';
import Navbar from '../components/Navbar.jsx';
import Modal from '../components/Modal.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import PriorityBadge from '../components/PriorityBadge.jsx';
import ProgressBar from '../components/ProgressBar.jsx';
import ValidationAlert from '../components/ValidationAlert.jsx';
import {
  Plus,
  Filter,
  MoreVertical,
  Search,
  Calendar,
  AlertCircle,
  Edit2,
  Trash2,
  FolderKanban,
  CheckCircle2,
} from 'lucide-react';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'In Progress',
    priority: 'Medium',
    due_date: '',
  });
  const [formErrors, setFormErrors] = useState([]);
  const [formErrorMessage, setFormErrorMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Menu action state for card dropdowns
  const [activeMenuId, setActiveMenuId] = useState(null);

  const fetchProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const filters = {};
      if (statusFilter) filters.status = statusFilter;
      if (priorityFilter) filters.priority = priorityFilter;
      if (searchTerm) filters.search = searchTerm;

      const res = await getProjectsApi(filters);
      setProjects(res.data.projects);
    } catch (err) {
      setError(err.message || 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [statusFilter, priorityFilter, searchTerm]);

  // Open Create Modal
  const handleOpenCreate = () => {
    setEditingProject(null);
    setFormData({
      title: '',
      description: '',
      status: 'In Progress',
      priority: 'Medium',
      due_date: '',
    });
    setFormErrors([]);
    setFormErrorMessage('');
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (project) => {
    setEditingProject(project);
    setFormData({
      title: project.title || '',
      description: project.description || '',
      status: project.status || 'In Progress',
      priority: project.priority || 'Medium',
      due_date: project.due_date ? project.due_date.split('T')[0] : '',
    });
    setFormErrors([]);
    setFormErrorMessage('');
    setActiveMenuId(null);
    setIsModalOpen(true);
  };

  // Submit Create or Edit
  const handleSubmitForm = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFormErrors([]);
    setFormErrorMessage('');

    try {
      if (editingProject) {
        await updateProjectApi(editingProject.id, formData);
      } else {
        await createProjectApi(formData);
      }
      setIsModalOpen(false);
      fetchProjects();
    } catch (err) {
      setFormErrorMessage(err.message || 'Validation failed');
      setFormErrors(err.errors || []);
    } finally {
      setSubmitting(false);
    }
  };

  // Delete Project
  const handleDeleteProject = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete project "${title}"? All associated tasks will be removed.`)) {
      return;
    }
    try {
      await deleteProjectApi(id);
      setActiveMenuId(null);
      fetchProjects();
    } catch (err) {
      alert(err.message || 'Failed to delete project');
    }
  };

  // Top summary numbers
  const totalProjectsCount = projects.length;
  const inProgressCount = projects.filter((p) => p.status === 'In Progress').length;
  const completedCount = projects.filter((p) => p.status === 'Completed').length;
  const atRiskCount = projects.filter((p) => p.status === 'At Risk').length;

  const getFieldError = (field) => formErrors.find((e) => e.field === field)?.message;

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <Navbar
        title="Projects"
        subtitle="Manage and monitor all active projects"
        searchValue={searchTerm}
        onSearch={setSearchTerm}
      />

      <div style={{ padding: '2rem', flex: 1, overflowY: 'auto' }}>
        {/* 4 Summary Stat Cards (Matches Image 4) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2rem',
        }}>
          <div style={{ backgroundColor: '#f8fafc', borderRadius: '16px', padding: '1.5rem', border: '1px solid #e2e8f0', textAlign: 'center' }}>
            <div style={{ fontSize: '2.25rem', fontWeight: '800', color: '#0f172a' }}>{totalProjectsCount}</div>
            <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#64748b', marginTop: '6px' }}>Active Projects</div>
          </div>
          <div style={{ backgroundColor: '#f5f3ff', borderRadius: '16px', padding: '1.5rem', border: '1px solid #ede9fe', textAlign: 'center' }}>
            <div style={{ fontSize: '2.25rem', fontWeight: '800', color: '#7c3aed' }}>{inProgressCount}</div>
            <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#6d28d9', marginTop: '6px' }}>In Progress</div>
          </div>
          <div style={{ backgroundColor: '#ecfdf5', borderRadius: '16px', padding: '1.5rem', border: '1px solid #d1fae5', textAlign: 'center' }}>
            <div style={{ fontSize: '2.25rem', fontWeight: '800', color: '#059669' }}>{completedCount}</div>
            <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#047857', marginTop: '6px' }}>Completed</div>
          </div>
          <div style={{ backgroundColor: '#fff1f2', borderRadius: '16px', padding: '1.5rem', border: '1px solid #ffe4e6', textAlign: 'center' }}>
            <div style={{ fontSize: '2.25rem', fontWeight: '800', color: '#e11d48' }}>{atRiskCount}</div>
            <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#be123c', marginTop: '6px' }}>At Risk Projects</div>
          </div>
        </div>

        {/* Section Header with Controls (Matches Image 4) */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1.5rem',
        }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a' }}>
            All Projects
          </h2>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* Filter Toggle */}
            <div style={{ position: 'relative' }}>
              <button
                type="button"
                onClick={() => setShowFilterMenu(!showFilterMenu)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '9px 16px',
                  backgroundColor: statusFilter || priorityFilter ? '#eff6ff' : '#ffffff',
                  border: `1px solid ${statusFilter || priorityFilter ? '#2563eb' : '#cbd5e1'}`,
                  borderRadius: '10px',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: statusFilter || priorityFilter ? '#2563eb' : '#475569',
                }}
              >
                <Filter size={16} />
                <span>Filter</span>
                {(statusFilter || priorityFilter) && (
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#2563eb' }} />
                )}
              </button>

              {/* Filter Popover */}
              {showFilterMenu && (
                <div style={{
                  position: 'absolute',
                  top: 'calc(100% + 6px)',
                  right: 0,
                  backgroundColor: '#ffffff',
                  borderRadius: '12px',
                  padding: '1.25rem',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.15)',
                  border: '1px solid #e2e8f0',
                  width: '240px',
                  zIndex: 200,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#64748b', marginBottom: '4px' }}>
                      Status
                    </label>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      style={{ width: '100%', padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                    >
                      <option value="">All Statuses</option>
                      <option value="Not Started">Not Started</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                      <option value="At Risk">At Risk</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#64748b', marginBottom: '4px' }}>
                      Priority
                    </label>
                    <select
                      value={priorityFilter}
                      onChange={(e) => setPriorityFilter(e.target.value)}
                      style={{ width: '100%', padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                    >
                      <option value="">All Priorities</option>
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>

                  <button
                    type="button"
                    onClick={() => { setStatusFilter(''); setPriorityFilter(''); setShowFilterMenu(false); }}
                    style={{ fontSize: '0.75rem', color: '#ef4444', fontWeight: '600', textAlign: 'center', marginTop: '4px' }}
                  >
                    Reset Filters
                  </button>
                </div>
              )}
            </div>

            {/* + New Projects Primary Button (Matches Image 4) */}
            <button
              onClick={handleOpenCreate}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '9px 18px',
                background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                color: '#ffffff',
                borderRadius: '10px',
                fontSize: '0.875rem',
                fontWeight: '700',
                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.35)',
              }}
            >
              <Plus size={18} />
              <span>+ New Projects</span>
            </button>
          </div>
        </div>

        {/* Projects Cards Grid (Matches Image 4) */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: '#64748b' }}>
            Loading projects...
          </div>
        ) : error ? (
          <div style={{ padding: '2rem', backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '16px', textAlign: 'center', color: '#b91c1c' }}>
            <AlertCircle size={32} style={{ margin: '0 auto 8px' }} />
            <p>{error}</p>
          </div>
        ) : projects.length === 0 ? (
          <div style={{
            padding: '3rem',
            textAlign: 'center',
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
          }}>
            <FolderKanban size={48} color="#94a3b8" style={{ margin: '0 auto 12px' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#0f172a' }}>No projects found</h3>
            <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '4px' }}>
              Create a new project or adjust your filters.
            </p>
            <button
              onClick={handleOpenCreate}
              style={{
                marginTop: '1rem',
                padding: '8px 16px',
                backgroundColor: '#2563eb',
                color: '#ffffff',
                borderRadius: '8px',
                fontWeight: '600',
                fontSize: '0.85rem',
              }}
            >
              + Create First Project
            </button>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '1.25rem',
          }}>
            {projects.map((project) => (
              <div
                key={project.id}
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '16px',
                  padding: '1.5rem',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.03)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  position: 'relative',
                }}
              >
                {/* Card Top: Title and Menu */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a', lineHeight: 1.3 }}>
                      {project.title}
                    </h3>

                    {/* Action Menu (3 Dots) */}
                    <div style={{ position: 'relative' }}>
                      <button
                        type="button"
                        onClick={() => setActiveMenuId(activeMenuId === project.id ? null : project.id)}
                        style={{
                          padding: '4px',
                          borderRadius: '6px',
                          color: '#94a3b8',
                        }}
                      >
                        <MoreVertical size={18} />
                      </button>

                      {activeMenuId === project.id && (
                        <div style={{
                          position: 'absolute',
                          top: '100%',
                          right: 0,
                          backgroundColor: '#ffffff',
                          borderRadius: '10px',
                          boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)',
                          border: '1px solid #e2e8f0',
                          padding: '4px',
                          minWidth: '120px',
                          zIndex: 50,
                        }}>
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(project)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              width: '100%',
                              padding: '8px 10px',
                              borderRadius: '6px',
                              fontSize: '0.8rem',
                              color: '#334155',
                              fontWeight: '600',
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                          >
                            <Edit2 size={14} />
                            <span>Edit</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteProject(project.id, project.title)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              width: '100%',
                              padding: '8px 10px',
                              borderRadius: '6px',
                              fontSize: '0.8rem',
                              color: '#ef4444',
                              fontWeight: '600',
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fef2f2'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                          >
                            <Trash2 size={14} />
                            <span>Delete</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Status & Priority Badges */}
                  <div style={{ display: 'flex', gap: '8px', marginTop: '10px', marginBottom: '1.25rem' }}>
                    <StatusBadge status={project.status} />
                    <PriorityBadge priority={project.priority} />
                  </div>

                  {project.description && (
                    <p style={{
                      fontSize: '0.85rem',
                      color: '#64748b',
                      marginBottom: '1.25rem',
                      lineHeight: 1.45,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}>
                      {project.description}
                    </p>
                  )}
                </div>

                {/* Card Bottom: Progress Bar, Team, Due Date */}
                <div>
                  <ProgressBar
                    completed={project.completed_tasks}
                    total={project.total_tasks}
                    percentage={project.progress_percentage}
                  />

                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: '1.25rem',
                    paddingTop: '10px',
                    borderTop: '1px solid #f8fafc',
                  }}>
                    {/* Avatars stacked preview */}
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <div style={{
                        width: '26px',
                        height: '26px',
                        borderRadius: '50%',
                        backgroundColor: '#2563eb',
                        color: '#fff',
                        fontSize: '0.7rem',
                        fontWeight: '700',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '2px solid #fff',
                      }}>
                        AM
                      </div>
                      <div style={{
                        width: '26px',
                        height: '26px',
                        borderRadius: '50%',
                        backgroundColor: '#f59e0b',
                        color: '#fff',
                        fontSize: '0.7rem',
                        fontWeight: '700',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginLeft: '-6px',
                        border: '2px solid #fff',
                      }}>
                        SW
                      </div>
                      <div style={{
                        width: '26px',
                        height: '26px',
                        borderRadius: '50%',
                        backgroundColor: '#f1f5f9',
                        color: '#475569',
                        fontSize: '0.65rem',
                        fontWeight: '700',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginLeft: '-6px',
                        border: '2px solid #fff',
                      }}>
                        +2
                      </div>
                    </div>

                    {project.due_date && (
                      <span style={{ fontSize: '0.75rem', fontWeight: '600', color: '#64748b' }}>
                        Due: {new Date(project.due_date).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal for Create/Edit Project (Matches Image 1 Form with Validation Alert) */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProject ? 'Edit Project' : 'Add Project'}
        footer={(
          <>
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              style={{
                padding: '9px 18px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                backgroundColor: '#ffffff',
                color: '#475569',
                fontWeight: '600',
                fontSize: '0.875rem',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              form="project-form"
              disabled={submitting}
              style={{
                padding: '9px 22px',
                borderRadius: '8px',
                backgroundColor: '#16a34a',
                color: '#ffffff',
                fontWeight: '700',
                fontSize: '0.875rem',
                boxShadow: '0 4px 10px rgba(22, 163, 74, 0.3)',
              }}
            >
              {submitting ? 'Saving...' : 'Submit'}
            </button>
          </>
        )}
      >
        <form id="project-form" onSubmit={handleSubmitForm} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Top Error Banner (Matches Image 1) */}
          <ValidationAlert errors={formErrors} message={formErrorMessage} />

          {/* Project Title */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
              Project Title *
            </label>
            <input
              type="text"
              name="title"
              placeholder="e.g. Website Redesign"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '8px',
                border: `1px solid ${getFieldError('title') ? '#ef4444' : '#cbd5e1'}`,
                outline: 'none',
                fontSize: '0.9rem',
              }}
            />
            {getFieldError('title') && (
              <p style={{ color: '#ef4444', fontSize: '0.775rem', marginTop: '4px' }}>
                {getFieldError('title')}
              </p>
            )}
          </div>

          {/* Status & Priority Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
              >
                <option value="Not Started">Not Started</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="At Risk">At Risk</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>

          {/* Due Date */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
              Due Date
            </label>
            <input
              type="date"
              value={formData.due_date}
              onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
            />
          </div>

          {/* Description */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
              Description
            </label>
            <textarea
              rows={3}
              placeholder="Describe goals, milestones, and scope..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', resize: 'vertical' }}
            />
          </div>
        </form>
      </Modal>
    </div>
  );
}
