import React, { useState, useEffect } from 'react';
import {
  getTasksApi,
  createTaskApi,
  updateTaskApi,
  deleteTaskApi,
} from '../api/tasks.js';
import { getProjectsApi } from '../api/projects.js';
import { getUsersApi } from '../api/auth.js';
import Navbar from '../components/Navbar.jsx';
import Modal from '../components/Modal.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import PriorityBadge from '../components/PriorityBadge.jsx';
import AssigneeDropdown from '../components/AssigneeDropdown.jsx';
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
  CheckSquare,
  Kanban,
  List,
  Clock,
  Link as LinkIcon,
  CheckCircle2,
  Circle,
  X,
  ArrowRight,
  MoveRight,
} from 'lucide-react';

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // View Mode: 'kanban' or 'list'
  const [viewMode, setViewMode] = useState('kanban');

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [projectFilter, setProjectFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [assigneeFilter, setAssigneeFilter] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    projectId: '',
    priority: 'Medium',
    status: 'To Do',
    assigneeId: null,
    dueDate: '',
    dependsOnTaskId: '',
    checklist: [],
  });
  const [newChecklistText, setNewChecklistText] = useState('');
  const [formErrors, setFormErrors] = useState([]);
  const [formErrorMessage, setFormErrorMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Card dropdown menu active id
  const [activeMenuId, setActiveMenuId] = useState(null);

  // Notification banner
  const [notification, setNotification] = useState(null);

  const showNotification = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // Fetch initial dropdown data: projects and team users
  const fetchMetadata = async () => {
    try {
      const [projRes, usersRes] = await Promise.all([
        getProjectsApi(),
        getUsersApi(),
      ]);
      setProjects(projRes.data.projects || []);
      setUsers(usersRes.data.users || []);
    } catch (err) {
      console.error('Failed to load projects or users list', err);
    }
  };

  // Fetch Tasks with filters
  const fetchTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const filters = {};
      if (projectFilter) filters.projectId = projectFilter;
      if (statusFilter) filters.status = statusFilter;
      if (priorityFilter) filters.priority = priorityFilter;
      if (assigneeFilter) filters.assigneeId = assigneeFilter;
      if (searchTerm) filters.search = searchTerm;

      const res = await getTasksApi(filters);
      setTasks(res.data.tasks || []);
    } catch (err) {
      setError(err.message || 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetadata();
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [projectFilter, statusFilter, priorityFilter, assigneeFilter, searchTerm]);

  // Open Create Modal
  const handleOpenCreate = (defaultStatus = 'To Do') => {
    setEditingTask(null);
    setFormData({
      title: '',
      description: '',
      projectId: projects.length > 0 ? projects[0].id : '',
      priority: 'Medium',
      status: defaultStatus,
      assigneeId: null,
      dueDate: '',
      dependsOnTaskId: '',
      checklist: [],
    });
    setNewChecklistText('');
    setFormErrors([]);
    setFormErrorMessage('');
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (task) => {
    setEditingTask(task);
    setFormData({
      title: task.title || '',
      description: task.description || '',
      projectId: task.project_id || '',
      priority: task.priority || 'Medium',
      status: task.status || 'To Do',
      assigneeId: task.assigned_to || null,
      dueDate: task.due_date ? task.due_date.split('T')[0] : '',
      dependsOnTaskId: task.depends_on_task_id || '',
      checklist: Array.isArray(task.checklist) ? task.checklist : [],
    });
    setNewChecklistText('');
    setFormErrors([]);
    setFormErrorMessage('');
    setIsModalOpen(true);
  };

  // Checklist Helpers
  const handleAddChecklistItem = () => {
    if (!newChecklistText.trim()) return;
    setFormData((prev) => ({
      ...prev,
      checklist: [...prev.checklist, { id: Date.now(), text: newChecklistText.trim(), done: false }],
    }));
    setNewChecklistText('');
  };

  const handleToggleChecklistInForm = (idx) => {
    setFormData((prev) => {
      const updated = [...prev.checklist];
      updated[idx] = { ...updated[idx], done: !updated[idx].done };
      return { ...prev, checklist: updated };
    });
  };

  const handleRemoveChecklistItem = (idx) => {
    setFormData((prev) => ({
      ...prev,
      checklist: prev.checklist.filter((_, i) => i !== idx),
    }));
  };

  // Submit Create or Edit Form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormErrors([]);
    setFormErrorMessage('');

    // Client-side validation
    const errors = [];
    if (!formData.title || formData.title.trim().length < 3) {
      errors.push('Task title is required and must be at least 3 characters long.');
    }
    if (!formData.projectId) {
      errors.push('Please select a project for this task.');
    }

    if (errors.length > 0) {
      setFormErrors(errors);
      setFormErrorMessage('Please fix the errors below before submitting:');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim() || null,
        projectId: parseInt(formData.projectId, 10),
        priority: formData.priority,
        status: formData.status,
        assigneeId: formData.assigneeId ? parseInt(formData.assigneeId, 10) : null,
        due_date: formData.dueDate || null,
        depends_on_task_id: formData.dependsOnTaskId ? parseInt(formData.dependsOnTaskId, 10) : null,
        checklist: formData.checklist,
      };

      if (editingTask) {
        await updateTaskApi(editingTask.id, payload);
        showNotification(`Task "${formData.title}" updated successfully!`);
      } else {
        await createTaskApi(payload);
        showNotification(`Task "${formData.title}" created successfully!`);
      }

      setIsModalOpen(false);
      fetchTasks();
    } catch (err) {
      setFormErrorMessage(err.message || 'Operation failed');
      if (err.errors) setFormErrors(err.errors);
    } finally {
      setSubmitting(false);
    }
  };

  // Quick Status Change (e.g. from Kanban column click or card actions)
  const handleQuickStatusChange = async (task, newStatus) => {
    if (task.status === newStatus) return;
    try {
      await updateTaskApi(task.id, { status: newStatus });
      setTasks((prev) =>
        prev.map((t) => (t.id === task.id ? { ...t, status: newStatus } : t))
      );
      showNotification(`Moved to "${newStatus}"`);
    } catch (err) {
      showNotification(err.message || 'Failed to update status', 'error');
    }
  };

  // Delete Task
  const handleDeleteTask = async (task) => {
    if (!window.confirm(`Are you sure you want to delete task "${task.title}"?`)) {
      return;
    }

    try {
      await deleteTaskApi(task.id);
      showNotification(`Task "${task.title}" deleted.`);
      fetchTasks();
    } catch (err) {
      showNotification(err.message || 'Failed to delete task', 'error');
    }
  };

  // Helper to check if task is overdue
  const isOverdue = (task) => {
    if (!task.due_date || task.status === 'Completed') return false;
    const due = new Date(task.due_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return due < today;
  };

  // User initials helper
  const getInitials = (name) => {
    if (!name || name === 'Unassigned') return '?';
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  // Kanban Columns configuration (Matches Image 5 design)
  const columns = [
    {
      id: 'To Do',
      title: 'TODO',
      color: '#2563eb',
      bgColor: '#eff6ff',
      borderColor: '#93c5fd',
    },
    {
      id: 'In Progress',
      title: 'IN PROGRESS',
      color: '#d97706',
      bgColor: '#fffbeb',
      borderColor: '#fcd34d',
    },
    {
      id: 'Completed',
      title: 'COMPLETE',
      color: '#10b981',
      bgColor: '#ecfdf5',
      borderColor: '#86efac',
    },
  ];

  // Eligible tasks for "Depends On" in modal
  const eligibleDependencyTasks = tasks.filter((t) => {
    if (editingTask && t.id === editingTask.id) return false;
    if (formData.projectId && t.project_id !== parseInt(formData.projectId, 10)) return false;
    return true;
  });

  const hasActiveFilters =
    projectFilter !== '' ||
    priorityFilter !== '' ||
    statusFilter !== '' ||
    assigneeFilter !== '' ||
    searchTerm !== '';

  const clearAllFilters = () => {
    setProjectFilter('');
    setPriorityFilter('');
    setStatusFilter('');
    setAssigneeFilter('');
    setSearchTerm('');
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <Navbar
        title="Tasks"
        subtitle="Manage and track your sprint backlog, tasks, and dependencies"
        searchValue={searchTerm}
        onSearch={setSearchTerm}
      />

      {/* Main Content Area */}
      <div style={{ padding: '2rem', flex: 1, overflowY: 'auto' }}>
        {/* Floating Notification */}
        {notification && (
          <div style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: 1100,
            padding: '12px 20px',
            borderRadius: '10px',
            backgroundColor: notification.type === 'error' ? '#ef4444' : '#10b981',
            color: '#ffffff',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontWeight: '600',
            fontSize: '0.9rem',
          }}>
            {notification.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
            <span>{notification.msg}</span>
          </div>
        )}

        {/* Toolbar Header (Matches Image 5) */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1.75rem',
        }}>
          {/* Left: View toggle + Filter counts */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              display: 'flex',
              backgroundColor: '#ffffff',
              borderRadius: '10px',
              padding: '4px',
              border: '1px solid #e2e8f0',
            }}>
              <button
                onClick={() => setViewMode('kanban')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  color: viewMode === 'kanban' ? '#2563eb' : '#64748b',
                  backgroundColor: viewMode === 'kanban' ? '#eff6ff' : 'transparent',
                  transition: 'all 0.15s ease',
                }}
              >
                <Kanban size={16} />
                <span>Kanban Board</span>
              </button>
              <button
                onClick={() => setViewMode('list')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  color: viewMode === 'list' ? '#2563eb' : '#64748b',
                  backgroundColor: viewMode === 'list' ? '#eff6ff' : 'transparent',
                  transition: 'all 0.15s ease',
                }}
              >
                <List size={16} />
                <span>List View</span>
              </button>
            </div>

            <span style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: '500' }}>
              Showing <strong style={{ color: '#0f172a' }}>{tasks.length}</strong> tasks
            </span>
          </div>

          {/* Right: + New Task Button */}
          <button
            onClick={() => handleOpenCreate('To Do')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 18px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
              color: '#ffffff',
              fontSize: '0.9rem',
              fontWeight: '600',
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)',
              transition: 'transform 0.15s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-1px)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
          >
            <Plus size={18} />
            <span>New Task</span>
          </button>
        </div>

        {/* Filter Controls Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          flexWrap: 'wrap',
          padding: '1rem 1.25rem',
          backgroundColor: '#ffffff',
          borderRadius: '14px',
          border: '1px solid #e2e8f0',
          marginBottom: '2rem',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '0.85rem', fontWeight: '600' }}>
            <Filter size={16} />
            <span>Filters:</span>
          </div>

          {/* Filter by Project */}
          <select
            value={projectFilter}
            onChange={(e) => setProjectFilter(e.target.value)}
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              backgroundColor: '#f8fafc',
              fontSize: '0.85rem',
              color: '#0f172a',
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            <option value="">All Projects</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title}
              </option>
            ))}
          </select>

          {/* Filter by Priority */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              backgroundColor: '#f8fafc',
              fontSize: '0.85rem',
              color: '#0f172a',
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            <option value="">All Priorities</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          {/* Filter by Status (active in list view or general) */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              backgroundColor: '#f8fafc',
              fontSize: '0.85rem',
              color: '#0f172a',
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            <option value="">All Statuses</option>
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>

          {/* Filter by Assignee */}
          <select
            value={assigneeFilter}
            onChange={(e) => setAssigneeFilter(e.target.value)}
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              backgroundColor: '#f8fafc',
              fontSize: '0.85rem',
              color: '#0f172a',
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            <option value="">All Assignees</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '6px 10px',
                borderRadius: '8px',
                backgroundColor: '#fee2e2',
                color: '#dc2626',
                fontSize: '0.8rem',
                fontWeight: '600',
              }}
            >
              <X size={14} />
              <span>Clear</span>
            </button>
          )}
        </div>

        {/* Loading State */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '5rem 0', color: '#64748b' }}>
            <div style={{ fontSize: '1.25rem', fontWeight: '700' }}>Loading tasks...</div>
            <p style={{ fontSize: '0.875rem', marginTop: '6px' }}>Fetching tasks and backlog items</p>
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
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Failed to Load Tasks</h3>
            <p style={{ fontSize: '0.9rem', marginTop: '6px' }}>{error}</p>
            <button
              onClick={fetchTasks}
              style={{
                marginTop: '16px',
                padding: '8px 16px',
                borderRadius: '8px',
                backgroundColor: '#dc2626',
                color: '#ffffff',
                fontWeight: '600',
                fontSize: '0.85rem',
              }}
            >
              Retry
            </button>
          </div>
        ) : tasks.length === 0 && !hasActiveFilters ? (
          /* Empty State when no tasks exist */
          <div style={{
            padding: '5rem 2rem',
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            border: '2px dashed #cbd5e1',
            textAlign: 'center',
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: '#eff6ff',
              color: '#2563eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem',
            }}>
              <CheckSquare size={32} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a' }}>
              No Tasks Created Yet
            </h3>
            <p style={{ color: '#64748b', fontSize: '0.9rem', maxWidth: '420px', margin: '8px auto 1.5rem' }}>
              Keep your team focused and organized by creating your first task in one of your projects.
            </p>
            <button
              onClick={() => handleOpenCreate('To Do')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                color: '#ffffff',
                fontWeight: '600',
                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)',
              }}
            >
              <Plus size={18} />
              <span>Create First Task</span>
            </button>
          </div>
        ) : viewMode === 'kanban' ? (
          /* Kanban Board View (Matches Image 5) */
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '1.5rem',
            alignItems: 'flex-start',
          }}>
            {columns.map((col) => {
              const colTasks = tasks.filter((t) => t.status === col.id);

              return (
                <div
                  key={col.id}
                  style={{
                    backgroundColor: '#f8fafc',
                    borderRadius: '16px',
                    border: '1px solid #e2e8f0',
                    borderTop: `4px solid ${col.color}`,
                    display: 'flex',
                    flexDirection: 'column',
                    minHeight: '500px',
                  }}
                >
                  {/* Column Header */}
                  <div style={{
                    padding: '1.25rem 1.25rem 0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '0.9rem', fontWeight: '800', color: '#0f172a', letterSpacing: '0.02em' }}>
                        {col.title}
                      </span>
                      <span style={{
                        padding: '2px 8px',
                        borderRadius: '9999px',
                        backgroundColor: col.bgColor,
                        color: col.color,
                        fontWeight: '800',
                        fontSize: '0.75rem',
                        border: `1px solid ${col.borderColor}`,
                      }}>
                        {colTasks.length}
                      </span>
                    </div>

                    <button
                      onClick={() => handleOpenCreate(col.id)}
                      style={{
                        padding: '4px',
                        borderRadius: '6px',
                        color: '#64748b',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                      title={`Add task to ${col.id}`}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#e2e8f0'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                    >
                      <Plus size={18} />
                    </button>
                  </div>

                  {/* Task Cards Column Body */}
                  <div style={{
                    padding: '0.75rem 1.25rem 1.25rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                    flex: 1,
                  }}>
                    {colTasks.length === 0 ? (
                      <div style={{
                        padding: '2rem 1rem',
                        textAlign: 'center',
                        color: '#94a3b8',
                        fontSize: '0.85rem',
                        border: '1px dashed #cbd5e1',
                        borderRadius: '12px',
                        backgroundColor: '#ffffff',
                      }}>
                        No tasks in {col.title}
                      </div>
                    ) : (
                      colTasks.map((task) => {
                        const overdue = isOverdue(task);
                        const checklistItems = Array.isArray(task.checklist) ? task.checklist : [];
                        const completedChecklistCount = checklistItems.filter((i) => i.done).length;

                        return (
                          <div
                            key={task.id}
                            style={{
                              backgroundColor: '#ffffff',
                              borderRadius: '12px',
                              border: overdue ? '1px solid #fca5a5' : '1px solid #e2e8f0',
                              padding: '1.25rem',
                              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.04)',
                              position: 'relative',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '10px',
                              transition: 'box-shadow 0.15s ease, transform 0.15s ease',
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.08)';
                              e.currentTarget.style.transform = 'translateY(-2px)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.04)';
                              e.currentTarget.style.transform = 'translateY(0)';
                            }}
                          >
                            {/* Card Top: Project Name & Priority */}
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                              <span style={{
                                fontSize: '0.75rem',
                                fontWeight: '700',
                                color: '#2563eb',
                                backgroundColor: '#eff6ff',
                                padding: '2px 8px',
                                borderRadius: '4px',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                maxWidth: '170px',
                              }}>
                                {task.project_title}
                              </span>

                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <PriorityBadge priority={task.priority} />
                                {/* 3-dot dropdown menu trigger */}
                                <div style={{ position: 'relative' }}>
                                  <button
                                    onClick={() => setActiveMenuId(activeMenuId === task.id ? null : task.id)}
                                    style={{
                                      padding: '4px',
                                      borderRadius: '4px',
                                      color: '#94a3b8',
                                    }}
                                  >
                                    <MoreVertical size={16} />
                                  </button>

                                  {activeMenuId === task.id && (
                                    <div style={{
                                      position: 'absolute',
                                      top: '24px',
                                      right: 0,
                                      width: '160px',
                                      backgroundColor: '#ffffff',
                                      borderRadius: '10px',
                                      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.15)',
                                      border: '1px solid #e2e8f0',
                                      padding: '4px',
                                      zIndex: 50,
                                    }}>
                                      <button
                                        onClick={() => {
                                          setActiveMenuId(null);
                                          handleOpenEdit(task);
                                        }}
                                        style={{
                                          width: '100%',
                                          display: 'flex',
                                          alignItems: 'center',
                                          gap: '8px',
                                          padding: '8px 10px',
                                          fontSize: '0.85rem',
                                          color: '#0f172a',
                                          borderRadius: '6px',
                                          textAlign: 'left',
                                        }}
                                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f1f5f9')}
                                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                                      >
                                        <Edit2 size={14} color="#64748b" />
                                        <span>Edit Task</span>
                                      </button>
                                      <button
                                        onClick={() => {
                                          setActiveMenuId(null);
                                          handleDeleteTask(task);
                                        }}
                                        style={{
                                          width: '100%',
                                          display: 'flex',
                                          alignItems: 'center',
                                          gap: '8px',
                                          padding: '8px 10px',
                                          fontSize: '0.85rem',
                                          color: '#ef4444',
                                          borderRadius: '6px',
                                          textAlign: 'left',
                                        }}
                                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#fef2f2')}
                                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                                      >
                                        <Trash2 size={14} color="#ef4444" />
                                        <span>Delete Task</span>
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Task Title */}
                            <h4 style={{
                              fontSize: '0.95rem',
                              fontWeight: '700',
                              color: task.status === 'Completed' ? '#64748b' : '#0f172a',
                              lineHeight: 1.35,
                              textDecoration: task.status === 'Completed' ? 'line-through' : 'none',
                            }}>
                              {task.title}
                            </h4>

                            {/* Task Description (if any) */}
                            {task.description && (
                              <p style={{
                                fontSize: '0.825rem',
                                color: '#64748b',
                                lineHeight: 1.4,
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                              }}>
                                {task.description}
                              </p>
                            )}

                            {/* Dependencies Tag (Matches Image 5) */}
                            {task.depends_on_task_title && (
                              <div style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '3px 8px',
                                borderRadius: '6px',
                                backgroundColor: '#f1f5f9',
                                color: '#475569',
                                fontSize: '0.75rem',
                                fontWeight: '600',
                              }}>
                                <LinkIcon size={12} color="#64748b" />
                                <span>Depends on: {task.depends_on_task_title}</span>
                              </div>
                            )}

                            {/* Checklist Indicator */}
                            {checklistItems.length > 0 && (
                              <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                fontSize: '0.75rem',
                                color: completedChecklistCount === checklistItems.length ? '#10b981' : '#64748b',
                                fontWeight: '600',
                              }}>
                                <CheckSquare size={14} />
                                <span>
                                  {completedChecklistCount}/{checklistItems.length} checklist items
                                </span>
                              </div>
                            )}

                            {/* Card Footer: Due Date, Assignee Avatar, and Quick Status Mover */}
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              marginTop: '4px',
                              paddingTop: '10px',
                              borderTop: '1px solid #f1f5f9',
                            }}>
                              {/* Due Date Indicator */}
                              <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                fontSize: '0.75rem',
                                fontWeight: '600',
                                color: overdue ? '#ef4444' : '#64748b',
                              }}>
                                <Clock size={14} color={overdue ? '#ef4444' : '#94a3b8'} />
                                <span>
                                  {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No date'}
                                </span>
                                {overdue && <span style={{ color: '#ef4444', fontWeight: '700' }}>(Overdue)</span>}
                              </div>

                              {/* Right: Assignee Avatar + Quick status advance */}
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                {/* Assignee Avatar */}
                                <div
                                  title={`Assigned to: ${task.assignee_name}`}
                                  style={{
                                    width: '28px',
                                    height: '28px',
                                    borderRadius: '50%',
                                    backgroundColor: task.assignee_avatar || '#64748b',
                                    color: '#ffffff',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '0.75rem',
                                    fontWeight: '700',
                                    border: '1.5px solid #ffffff',
                                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                                  }}
                                >
                                  {getInitials(task.assignee_name)}
                                </div>

                                {/* Quick Advance Arrow Button */}
                                {task.status === 'To Do' && (
                                  <button
                                    onClick={() => handleQuickStatusChange(task, 'In Progress')}
                                    title="Move to In Progress"
                                    style={{
                                      padding: '4px 6px',
                                      borderRadius: '6px',
                                      backgroundColor: '#fffbeb',
                                      color: '#d97706',
                                      fontSize: '0.7rem',
                                      fontWeight: '700',
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '2px',
                                      border: '1px solid #fcd34d',
                                    }}
                                  >
                                    <span>Start</span>
                                    <MoveRight size={12} />
                                  </button>
                                )}

                                {task.status === 'In Progress' && (
                                  <button
                                    onClick={() => handleQuickStatusChange(task, 'Completed')}
                                    title="Mark Completed"
                                    style={{
                                      padding: '4px 6px',
                                      borderRadius: '6px',
                                      backgroundColor: '#ecfdf5',
                                      color: '#059669',
                                      fontSize: '0.7rem',
                                      fontWeight: '700',
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '2px',
                                      border: '1px solid #86efac',
                                    }}
                                  >
                                    <CheckCircle2 size={12} />
                                    <span>Done</span>
                                  </button>
                                )}

                                {task.status === 'Completed' && (
                                  <button
                                    onClick={() => handleQuickStatusChange(task, 'In Progress')}
                                    title="Reopen Task"
                                    style={{
                                      padding: '4px 6px',
                                      borderRadius: '6px',
                                      backgroundColor: '#f1f5f9',
                                      color: '#475569',
                                      fontSize: '0.7rem',
                                      fontWeight: '600',
                                    }}
                                  >
                                    <span>Reopen</span>
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Table / List View */
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            overflow: 'hidden',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
          }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b' }}>
                    <th style={{ padding: '12px 16px', fontWeight: '700' }}>Task</th>
                    <th style={{ padding: '12px 16px', fontWeight: '700' }}>Project</th>
                    <th style={{ padding: '12px 16px', fontWeight: '700' }}>Status</th>
                    <th style={{ padding: '12px 16px', fontWeight: '700' }}>Priority</th>
                    <th style={{ padding: '12px 16px', fontWeight: '700' }}>Assignee</th>
                    <th style={{ padding: '12px 16px', fontWeight: '700' }}>Due Date</th>
                    <th style={{ padding: '12px 16px', fontWeight: '700', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.map((task) => (
                    <tr
                      key={task.id}
                      style={{
                        borderBottom: '1px solid #f1f5f9',
                        transition: 'background-color 0.1s ease',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f8fafc')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ fontWeight: '700', color: '#0f172a' }}>{task.title}</div>
                        {task.depends_on_task_title && (
                          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>
                            🔗 Depends on: {task.depends_on_task_title}
                          </div>
                        )}
                      </td>
                      <td style={{ padding: '12px 16px', color: '#2563eb', fontWeight: '600' }}>
                        {task.project_title}
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <StatusBadge status={task.status} />
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <PriorityBadge priority={task.priority} />
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div
                            style={{
                              width: '26px',
                              height: '26px',
                              borderRadius: '50%',
                              backgroundColor: task.assignee_avatar || '#64748b',
                              color: '#ffffff',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '0.7rem',
                              fontWeight: '700',
                            }}
                          >
                            {getInitials(task.assignee_name)}
                          </div>
                          <span style={{ color: '#0f172a', fontWeight: '500' }}>{task.assignee_name}</span>
                        </div>
                      </td>
                      <td style={{ padding: '12px 16px', color: isOverdue(task) ? '#ef4444' : '#64748b' }}>
                        {task.due_date ? new Date(task.due_date).toLocaleDateString() : '—'}
                      </td>
                      <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                          <button
                            onClick={() => handleOpenEdit(task)}
                            style={{ padding: '6px', borderRadius: '6px', color: '#64748b' }}
                            title="Edit Task"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteTask(task)}
                            style={{ padding: '6px', borderRadius: '6px', color: '#ef4444' }}
                            title="Delete Task"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Task Create / Edit Modal (Matches Image 1 & Image 3) */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingTask ? 'Edit Task' : 'Create New Task'}
        maxWidth="620px"
        footer={
          <>
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              style={{
                padding: '10px 18px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                backgroundColor: '#ffffff',
                color: '#475569',
                fontSize: '0.875rem',
                fontWeight: '600',
              }}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              style={{
                padding: '10px 20px',
                borderRadius: '8px',
                backgroundColor: '#2563eb',
                color: '#ffffff',
                fontSize: '0.875rem',
                fontWeight: '600',
                opacity: submitting ? 0.7 : 1,
                cursor: submitting ? 'not-allowed' : 'pointer',
              }}
            >
              {submitting ? 'Saving...' : editingTask ? 'Update Task' : 'Create Task'}
            </button>
          </>
        }
      >
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Validation Alert (Matches Image 1 style) */}
          <ValidationAlert errors={formErrors} message={formErrorMessage} />

          {/* Project Selection (Required) */}
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '700', color: '#0f172a', marginBottom: '6px' }}>
              Project <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <select
              value={formData.projectId}
              onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
              required
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontSize: '0.9rem',
                color: '#0f172a',
                outline: 'none',
              }}
            >
              <option value="">Select a Project</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </select>
          </div>

          {/* Task Title (Required) */}
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '700', color: '#0f172a', marginBottom: '6px' }}>
              Task Title <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Design responsive navigation header"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontSize: '0.9rem',
                color: '#0f172a',
                outline: 'none',
              }}
            />
          </div>

          {/* Description */}
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '700', color: '#0f172a', marginBottom: '6px' }}>
              Description
            </label>
            <textarea
              placeholder="Describe what needs to be done, requirements, or links..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontSize: '0.9rem',
                color: '#0f172a',
                outline: 'none',
                resize: 'vertical',
              }}
            />
          </div>

          {/* Status & Priority Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '700', color: '#0f172a', marginBottom: '6px' }}>
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.9rem',
                  color: '#0f172a',
                }}
              >
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '700', color: '#0f172a', marginBottom: '6px' }}>
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.9rem',
                  color: '#0f172a',
                }}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>

          {/* Assignee & Due Date Row (Matches Image 3) */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '700', color: '#0f172a', marginBottom: '6px' }}>
                Assignee
              </label>
              <AssigneeDropdown
                users={users}
                selectedUserId={formData.assigneeId}
                onSelect={(uid) => setFormData({ ...formData, assigneeId: uid })}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '700', color: '#0f172a', marginBottom: '6px' }}>
                Due Date
              </label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.9rem',
                  color: '#0f172a',
                }}
              />
            </div>
          </div>

          {/* Task Dependency (Depends on Task ID) */}
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '700', color: '#0f172a', marginBottom: '6px' }}>
              Dependency (Depends on Task)
            </label>
            <select
              value={formData.dependsOnTaskId}
              onChange={(e) => setFormData({ ...formData, dependsOnTaskId: e.target.value })}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontSize: '0.9rem',
                color: '#0f172a',
              }}
            >
              <option value="">None (Independent task)</option>
              {eligibleDependencyTasks.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.title} ({t.status})
                </option>
              ))}
            </select>
          </div>

          {/* Checklist Items (Matches Image 5 task cards) */}
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '700', color: '#0f172a', marginBottom: '6px' }}>
              Checklist Items
            </label>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
              <input
                type="text"
                placeholder="Add sub-task or checklist item..."
                value={newChecklistText}
                onChange={(e) => setNewChecklistText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddChecklistItem();
                  }
                }}
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.85rem',
                }}
              />
              <button
                type="button"
                onClick={handleAddChecklistItem}
                style={{
                  padding: '8px 14px',
                  borderRadius: '8px',
                  backgroundColor: '#f1f5f9',
                  color: '#2563eb',
                  fontWeight: '700',
                  fontSize: '0.85rem',
                  border: '1px solid #cbd5e1',
                }}
              >
                Add
              </button>
            </div>

            {formData.checklist && formData.checklist.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '140px', overflowY: 'auto' }}>
                {formData.checklist.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '6px 10px',
                      backgroundColor: '#f8fafc',
                      borderRadius: '6px',
                      border: '1px solid #e2e8f0',
                      fontSize: '0.85rem',
                    }}
                  >
                    <div
                      onClick={() => handleToggleChecklistInForm(idx)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        cursor: 'pointer',
                        color: item.done ? '#94a3b8' : '#0f172a',
                        textDecoration: item.done ? 'line-through' : 'none',
                      }}
                    >
                      {item.done ? <CheckCircle2 size={16} color="#10b981" /> : <Circle size={16} color="#94a3b8" />}
                      <span>{item.text}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveChecklistItem(idx)}
                      style={{ color: '#ef4444', padding: '2px' }}
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </form>
      </Modal>
    </div>
  );
}
