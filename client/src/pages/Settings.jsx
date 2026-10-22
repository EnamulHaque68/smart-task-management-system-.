import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar.jsx';
import { useAuth } from '../hooks/useAuth.jsx';
import { updateProfileApi, changePasswordApi } from '../api/auth.js';
import {
  Settings as SettingsIcon,
  User,
  Shield,
  Bell,
  CheckCircle2,
  AlertCircle,
  Building2,
  Globe,
  Clock,
  Calendar,
  Lock,
  Eye,
  EyeOff,
  Phone,
  Briefcase,
  Mail,
  MapPin,
  Link2,
  FileText,
  Camera,
  Edit3,
  Check,
  Save,
  KeyRound,
  Sliders,
  Volume2
} from 'lucide-react';

const AVATAR_COLOR_OPTIONS = [
  { name: 'Royal Blue', value: '#2563eb' },
  { name: 'Amber Gold', value: '#f59e0b' },
  { name: 'Emerald Green', value: '#10b981' },
  { name: 'Teal Cyan', value: '#0d9488' },
  { name: 'Violet Purple', value: '#8b5cf6' },
  { name: 'Rose Pink', value: '#ec4899' },
  { name: 'Ruby Red', value: '#ef4444' },
];

const TIMEZONES = [
  { label: '(GMT+06:00) Dhaka, Bangladesh Standard Time', value: 'Asia/Dhaka' },
  { label: '(GMT+00:00) UTC / London, GMT', value: 'UTC' },
  { label: '(GMT-05:00) Eastern Time (US & Canada)', value: 'America/New_York' },
  { label: '(GMT-08:00) Pacific Time (US & Canada)', value: 'America/Los_Angeles' },
  { label: '(GMT+01:00) Central European Time (Berlin, Paris)', value: 'Europe/Berlin' },
  { label: '(GMT+05:30) India Standard Time (Kolkata, Delhi)', value: 'Asia/Kolkata' },
  { label: '(GMT+08:00) Singapore, Beijing, Perth', value: 'Asia/Singapore' },
  { label: '(GMT+09:00) Tokyo, Japan Standard Time', value: 'Asia/Tokyo' },
];

const DATE_FORMATS = [
  { label: 'YYYY-MM-DD (e.g. 2026-10-22)', value: 'YYYY-MM-DD' },
  { label: 'DD/MM/YYYY (e.g. 22/10/2026)', value: 'DD/MM/YYYY' },
  { label: 'MM/DD/YYYY (e.g. 10/22/2026)', value: 'MM/DD/YYYY' },
  { label: 'MMM D, YYYY (e.g. Oct 22, 2026)', value: 'MMM D, YYYY' },
];

export default function Settings() {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const fileInputRef = useRef(null);

  // General Workspace Form State
  const [workspaceName, setWorkspaceName] = useState(
    user?.preferences?.workspace_name || 'Bright Mind Ltd'
  );
  const [timezone, setTimezone] = useState(
    user?.preferences?.timezone || 'Asia/Dhaka'
  );
  const [dateFormat, setDateFormat] = useState(
    user?.preferences?.date_format || 'YYYY-MM-DD'
  );
  const [language, setLanguage] = useState(
    user?.preferences?.language || 'en'
  );
  const [defaultView, setDefaultView] = useState(
    user?.preferences?.default_view || 'kanban'
  );

  // Profile Form State (defaulted to Alex Morgan / screenshot details)
  const [name, setName] = useState(user?.name || 'Alex Morgan');
  const [jobTitle, setJobTitle] = useState(user?.job_title || 'Lead Product Manager');
  const [phone, setPhone] = useState(user?.phone || '+1 415 555 0187');
  const [companyName, setCompanyName] = useState(
    user?.preferences?.company_name || 'Bright Mind Ltd'
  );
  const [location, setLocation] = useState(
    user?.preferences?.location || 'San Francisco, CA, USA'
  );
  const [linkedin, setLinkedin] = useState(
    user?.preferences?.linkedin || 'https://www.linkedin.com/in/alexmorgan'
  );
  const [website, setWebsite] = useState(
    user?.preferences?.website || 'https://www.brightmind.com'
  );
  const [avatarColor, setAvatarColor] = useState(user?.avatar_color || '#ec4899');
  const [avatarUrl, setAvatarUrl] = useState(
    user?.avatar_url || user?.preferences?.avatar_url || '/avatars/alex_morgan.jpg'
  );
  const [bio, setBio] = useState(
    user?.preferences?.bio ||
    'Experienced Product Manager with 8+ years of experience in building SaaS products, leading cross-functional teams, and driving user-centric solutions. Passionate about productivity tools, data-driven decision making, and continuous innovation.'
  );

  // Notification Preferences State
  const [emailNotifications, setEmailNotifications] = useState(
    user?.preferences?.email_notifications ?? true
  );
  const [taskAssignedAlert, setTaskAssignedAlert] = useState(
    user?.preferences?.task_assigned_alert ?? true
  );
  const [dueDateReminders, setDueDateReminders] = useState(
    user?.preferences?.due_date_reminders ?? true
  );
  const [soundAlerts, setSoundAlerts] = useState(
    user?.preferences?.sound_alerts ?? true
  );
  const [weeklyDigest, setWeeklyDigest] = useState(
    user?.preferences?.weekly_digest ?? false
  );

  // Security Form State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Status and Loading
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Sync state if user prop changes
  useEffect(() => {
    if (user) {
      setName(user.name || 'Alex Morgan');
      setJobTitle(user.job_title || 'Lead Product Manager');
      setPhone(user.phone || '+1 415 555 0187');
      setAvatarColor(user.avatar_color || '#ec4899');
      setAvatarUrl(user.avatar_url || user.preferences?.avatar_url || '/avatars/alex_morgan.jpg');
      if (user.preferences) {
        setWorkspaceName(user.preferences.workspace_name || 'Bright Mind Ltd');
        setTimezone(user.preferences.timezone || 'Asia/Dhaka');
        setDateFormat(user.preferences.date_format || 'YYYY-MM-DD');
        setLanguage(user.preferences.language || 'en');
        setDefaultView(user.preferences.default_view || 'kanban');
        setCompanyName(user.preferences.company_name || 'Bright Mind Ltd');
        setLocation(user.preferences.location || 'San Francisco, CA, USA');
        setLinkedin(user.preferences.linkedin || 'https://www.linkedin.com/in/alexmorgan');
        setWebsite(user.preferences.website || 'https://www.brightmind.com');
        setBio(
          user.preferences.bio ||
          'Experienced Product Manager with 8+ years of experience in building SaaS products, leading cross-functional teams, and driving user-centric solutions. Passionate about productivity tools, data-driven decision making, and continuous innovation.'
        );
        setEmailNotifications(user.preferences.email_notifications ?? true);
        setTaskAssignedAlert(user.preferences.task_assigned_alert ?? true);
        setDueDateReminders(user.preferences.due_date_reminders ?? true);
        setSoundAlerts(user.preferences.sound_alerts ?? true);
        setWeeklyDigest(user.preferences.weekly_digest ?? false);
      }
    }
  }, [user]);

  const showSuccess = (msg) => {
    setSuccessMessage(msg);
    setErrorMessage('');
    setTimeout(() => setSuccessMessage(''), 4500);
  };

  const showError = (msg) => {
    setErrorMessage(msg);
    setSuccessMessage('');
    setTimeout(() => setErrorMessage(''), 5000);
  };

  // Handle Photo File Upload with automatic compression (max 200x200 JPEG ~15KB)
  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const maxDim = 200;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxDim) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            }
          } else {
            if (height > maxDim) {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
          setAvatarUrl(compressedDataUrl);
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Save Workspace / General
  const handleSaveGeneral = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrorMessage('');

    try {
      const updatedPreferences = {
        ...(user?.preferences || {}),
        workspace_name: workspaceName.trim(),
        timezone,
        date_format: dateFormat,
        language,
        default_view: defaultView,
      };

      const res = await updateProfileApi({ preferences: updatedPreferences });
      if (res.data?.user) {
        updateUser(res.data.user);
      }
      showSuccess('General workspace settings updated successfully!');
    } catch (err) {
      showError(err.message || 'Failed to save general settings.');
    } finally {
      setSaving(false);
    }
  };

  // Handle Save Profile
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      showError('Name cannot be empty.');
      return;
    }

    setSaving(true);
    setErrorMessage('');

    try {
      const updatedPreferences = {
        ...(user?.preferences || {}),
        company_name: companyName.trim(),
        location: location.trim(),
        linkedin: linkedin.trim(),
        website: website.trim(),
        bio: bio.trim(),
        avatar_url: avatarUrl,
      };

      const res = await updateProfileApi({
        name: name.trim(),
        job_title: jobTitle.trim(),
        phone: phone.trim(),
        avatar_color: avatarColor,
        avatar_url: avatarUrl,
        preferences: updatedPreferences,
      });

      if (res.data?.user) {
        updateUser(res.data.user);
      }
      showSuccess('Personal profile updated successfully!');
    } catch (err) {
      showError(err.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  // Handle Save Notifications
  const handleSaveNotifications = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrorMessage('');

    try {
      const updatedPreferences = {
        ...(user?.preferences || {}),
        email_notifications: emailNotifications,
        task_assigned_alert: taskAssignedAlert,
        due_date_reminders: dueDateReminders,
        sound_alerts: soundAlerts,
        weekly_digest: weeklyDigest,
      };

      const res = await updateProfileApi({ preferences: updatedPreferences });
      if (res.data?.user) {
        updateUser(res.data.user);
      }
      showSuccess('Notification preferences saved successfully!');
    } catch (err) {
      showError(err.message || 'Failed to update notifications.');
    } finally {
      setSaving(false);
    }
  };

  // Handle Change Password
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!currentPassword) {
      showError('Please enter your current password.');
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      showError('New password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      showError('New password and confirmation do not match.');
      return;
    }

    setSaving(true);
    setErrorMessage('');

    try {
      await changePasswordApi({
        currentPassword,
        newPassword,
      });

      showSuccess('Security password changed successfully! Use your new password on next login.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      showError(err.message || 'Failed to change password. Check your current password.');
    } finally {
      setSaving(false);
    }
  };

  const getInitials = (n) => {
    if (!n) return 'AM';
    return n.split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase();
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <Navbar
        title="Settings"
        subtitle="Configure workspace settings, profile customization, notifications, and security"
      />

      <div style={{ padding: '2rem', flex: 1, overflowY: 'auto', maxWidth: '1060px', margin: '0 auto', width: '100%' }}>
        {/* Alerts */}
        {successMessage && (
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
            animation: 'fadeIn 0.2s ease',
          }}>
            <CheckCircle2 size={20} color="#059669" />
            <div style={{ flex: 1 }}>{successMessage}</div>
          </div>
        )}

        {errorMessage && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            backgroundColor: '#fef2f2',
            color: '#991b1b',
            padding: '14px 18px',
            borderRadius: '12px',
            marginBottom: '1.5rem',
            border: '1px solid #fecaca',
            fontWeight: '600',
            fontSize: '0.925rem',
            boxShadow: '0 4px 6px -1px rgba(239, 68, 68, 0.1)',
            animation: 'fadeIn 0.2s ease',
          }}>
            <AlertCircle size={20} color="#dc2626" />
            <div style={{ flex: 1 }}>{errorMessage}</div>
          </div>
        )}

        {/* Tab Navigation Bar */}
        <div style={{
          display: 'flex',
          gap: '8px',
          borderBottom: '1px solid #e2e8f0',
          paddingBottom: '0.5rem',
          marginBottom: '2rem',
          overflowX: 'auto',
        }}>
          {[
            { id: 'general', label: 'General', icon: Sliders },
            { id: 'profile', label: 'Personal Profile', icon: User },
            { id: 'notifications', label: 'Notifications', icon: Bell },
            { id: 'security', label: 'Security & Password', icon: KeyRound },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveTab(tab.id);
                  setErrorMessage('');
                  setSuccessMessage('');
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 18px',
                  borderRadius: '10px',
                  fontSize: '0.9rem',
                  fontWeight: isActive ? '700' : '600',
                  color: isActive ? '#2563eb' : '#64748b',
                  backgroundColor: isActive ? '#eff6ff' : 'transparent',
                  border: isActive ? '1px solid #bfdbfe' : '1px solid transparent',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  whiteSpace: 'nowrap',
                }}
              >
                <Icon size={18} color={isActive ? '#2563eb' : '#64748b'} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ============================================================== */}
        {/* TAB 1: GENERAL (Workspace Settings) */}
        {/* ============================================================== */}
        {activeTab === 'general' && (
          <form onSubmit={handleSaveGeneral} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              padding: '1.75rem',
              border: '1px solid #e2e8f0',
              boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.25rem' }}>
                <div style={{ padding: '8px', backgroundColor: '#eff6ff', borderRadius: '10px' }}>
                  <Building2 size={20} color="#2563eb" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                    Workspace Organization
                  </h3>
                  <p style={{ fontSize: '0.825rem', color: '#64748b', margin: '2px 0 0 0' }}>
                    Configure organization identity and default operational parameters
                  </p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                    Organization / Company Name
                  </label>
                  <input
                    type="text"
                    value={workspaceName}
                    onChange={(e) => setWorkspaceName(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '10px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.9rem',
                      outline: 'none',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                    Default Task Board View
                  </label>
                  <select
                    value={defaultView}
                    onChange={(e) => setDefaultView(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '10px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.9rem',
                      outline: 'none',
                      backgroundColor: '#ffffff',
                    }}
                  >
                    <option value="kanban">Kanban Board (Sprint Columns)</option>
                    <option value="list">List View (Structured rows)</option>
                    <option value="calendar">Calendar View (Schedule)</option>
                  </select>
                </div>
              </div>
            </div>

            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              padding: '1.75rem',
              border: '1px solid #e2e8f0',
              boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.25rem' }}>
                <div style={{ padding: '8px', backgroundColor: '#f0fdf4', borderRadius: '10px' }}>
                  <Globe size={20} color="#16a34a" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                    Localization & Timezone
                  </h3>
                  <p style={{ fontSize: '0.825rem', color: '#64748b', margin: '2px 0 0 0' }}>
                    Ensure accurate deadlines, task reminders, and automated scheduling
                  </p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                    <Clock size={15} color="#64748b" />
                    <span>Workspace Timezone</span>
                  </label>
                  <select
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '10px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.9rem',
                      outline: 'none',
                      backgroundColor: '#ffffff',
                    }}
                  >
                    {TIMEZONES.map((tz) => (
                      <option key={tz.value} value={tz.value}>
                        {tz.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                    <Calendar size={15} color="#64748b" />
                    <span>Date Display Format</span>
                  </label>
                  <select
                    value={dateFormat}
                    onChange={(e) => setDateFormat(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '10px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.9rem',
                      outline: 'none',
                      backgroundColor: '#ffffff',
                    }}
                  >
                    {DATE_FORMATS.map((df) => (
                      <option key={df.value} value={df.value}>
                        {df.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                    <Globe size={15} color="#64748b" />
                    <span>System Language</span>
                  </label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '10px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.9rem',
                      outline: 'none',
                      backgroundColor: '#ffffff',
                    }}
                  >
                    <option value="en">English (United States)</option>
                    <option value="bn">বাংলা (Bengali)</option>
                    <option value="es">Español (Spanish)</option>
                    <option value="fr">Français (French)</option>
                  </select>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 24px',
                backgroundColor: '#2563eb',
                color: '#ffffff',
                borderRadius: '10px',
                fontSize: '0.95rem',
                fontWeight: '700',
                cursor: saving ? 'not-allowed' : 'pointer',
                opacity: saving ? 0.7 : 1,
                alignSelf: 'flex-start',
                border: 'none',
                boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)',
                transition: 'all 0.15s ease',
              }}
            >
              <Save size={18} />
              <span>{saving ? 'Saving...' : 'Save Workspace Settings'}</span>
            </button>
          </form>
        )}

        {/* ============================================================== */}
        {/* TAB 2: PERSONAL PROFILE SETTINGS (Pixel-perfect to user mockup) */}
        {/* ============================================================== */}
        {activeTab === 'profile' && (
          <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Top Profile Header Card */}
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              padding: '1.75rem 2rem',
              border: '1px solid #e2e8f0',
              boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1.5rem',
            }}>
              {/* Left Column: Avatar & Brand Color & User Meta */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap', flex: 1, minWidth: '320px' }}>
                {/* Avatar with Camera badge */}
                <div style={{ position: 'relative', width: '108px', height: '108px', flexShrink: 0 }}>
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={name}
                      style={{
                        width: '108px',
                        height: '108px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: `3px solid ${avatarColor}`,
                        boxShadow: `0 8px 16px -4px ${avatarColor}40`,
                        display: 'block',
                      }}
                    />
                  ) : (
                    <div style={{
                      width: '108px',
                      height: '108px',
                      borderRadius: '50%',
                      backgroundColor: avatarColor,
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '2.2rem',
                      fontWeight: '800',
                      border: '3px solid #ffffff',
                      boxShadow: `0 8px 16px -4px ${avatarColor}40`,
                    }}>
                      {getInitials(name)}
                    </div>
                  )}

                  {/* Camera Icon Overlay Badge */}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    title="Change Profile Photo"
                    style={{
                      position: 'absolute',
                      bottom: '2px',
                      right: '2px',
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: '#2563eb',
                      color: '#ffffff',
                      border: '2.5px solid #ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      boxShadow: '0 2px 5px rgba(0,0,0,0.25)',
                      transition: 'transform 0.15s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.12)')}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                  >
                    <Camera size={15} />
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handlePhotoChange}
                    accept="image/*"
                    style={{ display: 'none' }}
                  />
                </div>

                {/* Center Meta & Accent Color Swatches */}
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#1e293b', marginBottom: '8px' }}>
                    Select Brand Accent Color
                  </div>

                  {/* Swatches matching mockup */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                    {AVATAR_COLOR_OPTIONS.map((c) => {
                      const isSelected = avatarColor === c.value;
                      return (
                        <button
                          key={c.value}
                          type="button"
                          onClick={() => setAvatarColor(c.value)}
                          title={c.name}
                          style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '50%',
                            backgroundColor: c.value,
                            border: isSelected ? '2px solid #0f172a' : '2px solid #ffffff',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#ffffff',
                            transition: 'transform 0.15s ease',
                            transform: isSelected ? 'scale(1.15)' : 'scale(1)',
                            padding: 0,
                          }}
                        >
                          {isSelected && <Check size={14} strokeWidth={3} />}
                        </button>
                      );
                    })}
                  </div>

                  <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a', margin: '0 0 2px 0' }}>
                    {name || 'Alex Morgan'}
                  </h3>
                  <div style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: '500', marginBottom: '4px' }}>
                    {jobTitle || 'Lead Product Manager'}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.825rem', color: '#64748b', fontWeight: '600' }}>
                    <Building2 size={15} color="#94a3b8" />
                    <span>{companyName || 'Bright Mind Ltd'}</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Profile Status & Change Photo Button */}
              <div style={{
                borderLeft: '1px solid #f1f5f9',
                paddingLeft: '2rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                minWidth: '220px',
              }}>
                <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>
                  Profile Status
                </div>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '4px 12px',
                  borderRadius: '9999px',
                  backgroundColor: '#ecfdf5',
                  color: '#059669',
                  border: '1px solid #a7f3d0',
                  fontSize: '0.8rem',
                  fontWeight: '700',
                }}>
                  <CheckCircle2 size={14} />
                  <span>Profile Complete</span>
                </div>
                <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '6px', marginBottom: '12px' }}>
                  Your profile information is up to date.
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '7px 14px',
                    borderRadius: '8px',
                    border: '1px solid #bfdbfe',
                    backgroundColor: '#ffffff',
                    color: '#2563eb',
                    fontSize: '0.825rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    boxShadow: '0 1px 2px rgba(37, 99, 235, 0.05)',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#eff6ff')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#ffffff')}
                >
                  <Edit3 size={14} />
                  <span>Change Photo</span>
                </button>
              </div>
            </div>

            {/* Bottom Card: Contact & Professional Details */}
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              padding: '1.75rem 2rem',
              border: '1px solid #e2e8f0',
              boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
            }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0f172a', marginBottom: '1.25rem' }}>
                Contact & Professional Details
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
                {/* Full Name */}
                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                    <User size={15} color="#64748b" />
                    <span>Full Name</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
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

                {/* Email Address */}
                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                    <Mail size={15} color="#64748b" />
                    <span>Email Address (Primary Login)</span>
                  </label>
                  <input
                    type="email"
                    value={user?.email || 'alex.morgan@brightmind.com'}
                    disabled
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                      backgroundColor: '#f8fafc',
                      color: '#64748b',
                      fontSize: '0.9rem',
                      cursor: 'not-allowed',
                    }}
                  />
                </div>

                {/* Role / Designation */}
                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                    <Briefcase size={15} color="#64748b" />
                    <span>Role / Designation</span>
                  </label>
                  <input
                    type="text"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="Lead Product Manager"
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

                {/* Phone Number */}
                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                    <Phone size={15} color="#64748b" />
                    <span>Phone Number</span>
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 415 555 0187"
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

                {/* Company Name */}
                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                    <Building2 size={15} color="#64748b" />
                    <span>Company Name</span>
                  </label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Bright Mind Ltd"
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

                {/* Location */}
                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                    <MapPin size={15} color="#64748b" />
                    <span>Location</span>
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="San Francisco, CA, USA"
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

                {/* LinkedIn Profile */}
                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                    <Link2 size={15} color="#64748b" />
                    <span>LinkedIn Profile</span>
                  </label>
                  <input
                    type="text"
                    value={linkedin}
                    onChange={(e) => setLinkedin(e.target.value)}
                    placeholder="https://www.linkedin.com/in/alexmorgan"
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

                {/* Website (Optional) */}
                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                    <Globe size={15} color="#64748b" />
                    <span>Website (Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://www.brightmind.com"
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
              </div>

              {/* Bio / Responsibilities Note */}
              <div style={{ marginTop: '1.25rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                  <FileText size={15} color="#64748b" />
                  <span>Bio / Responsibilities Note</span>
                </label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Experienced Product Manager with 8+ years of experience in building SaaS products, leading cross-functional teams, and driving user-centric solutions. Passionate about productivity tools, data-driven decision making, and continuous innovation."
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.9rem',
                    outline: 'none',
                    fontFamily: 'inherit',
                    lineHeight: '1.5',
                    resize: 'vertical',
                  }}
                />
              </div>

              {/* Action Button */}
              <div style={{ marginTop: '1.5rem' }}>
                <button
                  type="submit"
                  disabled={saving}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '11px 22px',
                    backgroundColor: '#2563eb',
                    color: '#ffffff',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    fontWeight: '700',
                    cursor: saving ? 'not-allowed' : 'pointer',
                    opacity: saving ? 0.7 : 1,
                    border: 'none',
                    boxShadow: '0 2px 4px rgba(37, 99, 235, 0.25)',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <Save size={17} />
                  <span>{saving ? 'Updating...' : 'Save Profile Changes'}</span>
                </button>
              </div>
            </div>
          </form>
        )}

        {/* ============================================================== */}
        {/* TAB 3: NOTIFICATION SETTINGS */}
        {/* ============================================================== */}
        {activeTab === 'notifications' && (
          <form onSubmit={handleSaveNotifications} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              padding: '1.75rem',
              border: '1px solid #e2e8f0',
              boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
            }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.25rem' }}>
                Communication & In-App Alerts
              </h3>
              <p style={{ fontSize: '0.825rem', color: '#64748b', marginBottom: '1.5rem' }}>
                Control how and when you receive automated project alerts and reminders
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #f1f5f9' }}>
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '0.95rem', color: '#0f172a' }}>
                      Email Notifications
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px' }}>
                      Receive critical email notifications for high-priority sprint events
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={emailNotifications}
                    onChange={(e) => setEmailNotifications(e.target.checked)}
                    style={{ width: '20px', height: '20px', cursor: 'pointer', accentColor: '#2563eb' }}
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #f1f5f9' }}>
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '0.95rem', color: '#0f172a' }}>
                      Task Assignment Alerts
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px' }}>
                      Notify instantly in the notification bell whenever a team member assigns you a new task
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={taskAssignedAlert}
                    onChange={(e) => setTaskAssignedAlert(e.target.checked)}
                    style={{ width: '20px', height: '20px', cursor: 'pointer', accentColor: '#2563eb' }}
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #f1f5f9' }}>
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '0.95rem', color: '#0f172a' }}>
                      Due Date & Overdue Reminders
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px' }}>
                      Trigger warnings 24 hours prior to deadline and when tasks become overdue
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={dueDateReminders}
                    onChange={(e) => setDueDateReminders(e.target.checked)}
                    style={{ width: '20px', height: '20px', cursor: 'pointer', accentColor: '#2563eb' }}
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #f1f5f9' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '700', fontSize: '0.95rem', color: '#0f172a' }}>
                      <Volume2 size={16} color="#64748b" />
                      <span>Sound Notifications</span>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px' }}>
                      Play subtle audio cues when new team messages arrive in the chat room
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={soundAlerts}
                    onChange={(e) => setSoundAlerts(e.target.checked)}
                    style={{ width: '20px', height: '20px', cursor: 'pointer', accentColor: '#2563eb' }}
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0' }}>
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '0.95rem', color: '#0f172a' }}>
                      Weekly Executive Performance Digest
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px' }}>
                      Consolidated report summarizing sprint velocity, completed tasks, and upcoming milestones
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={weeklyDigest}
                    onChange={(e) => setWeeklyDigest(e.target.checked)}
                    style={{ width: '20px', height: '20px', cursor: 'pointer', accentColor: '#2563eb' }}
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 24px',
                backgroundColor: '#2563eb',
                color: '#ffffff',
                borderRadius: '10px',
                fontSize: '0.95rem',
                fontWeight: '700',
                cursor: saving ? 'not-allowed' : 'pointer',
                opacity: saving ? 0.7 : 1,
                alignSelf: 'flex-start',
                border: 'none',
                boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)',
                transition: 'all 0.15s ease',
              }}
            >
              <Save size={18} />
              <span>{saving ? 'Saving...' : 'Save Notification Preferences'}</span>
            </button>
          </form>
        )}

        {/* ============================================================== */}
        {/* TAB 4: SECURITY & PASSWORD */}
        {/* ============================================================== */}
        {activeTab === 'security' && (
          <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              padding: '1.75rem',
              border: '1px solid #e2e8f0',
              boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.25rem' }}>
                <div style={{ padding: '8px', backgroundColor: '#fef3c7', borderRadius: '10px' }}>
                  <Shield size={20} color="#d97706" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                    Change Account Password
                  </h3>
                  <p style={{ fontSize: '0.825rem', color: '#64748b', margin: '2px 0 0 0' }}>
                    Ensure your account is protected with a secure password (minimum 6 characters)
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxWidth: '520px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                    Current Password
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showCurrentPassword ? 'text' : 'password'}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter your current password"
                      required
                      style={{
                        width: '100%',
                        padding: '10px 42px 10px 14px',
                        borderRadius: '10px',
                        border: '1px solid #cbd5e1',
                        fontSize: '0.9rem',
                        outline: 'none',
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      style={{
                        position: 'absolute',
                        right: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#64748b',
                      }}
                    >
                      {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                    New Password
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      required
                      style={{
                        width: '100%',
                        padding: '10px 42px 10px 14px',
                        borderRadius: '10px',
                        border: '1px solid #cbd5e1',
                        fontSize: '0.9rem',
                        outline: 'none',
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      style={{
                        position: 'absolute',
                        right: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#64748b',
                      }}
                    >
                      {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat new password"
                    required
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '10px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.9rem',
                      outline: 'none',
                    }}
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 24px',
                backgroundColor: '#0f172a',
                color: '#ffffff',
                borderRadius: '10px',
                fontSize: '0.95rem',
                fontWeight: '700',
                cursor: saving ? 'not-allowed' : 'pointer',
                opacity: saving ? 0.7 : 1,
                alignSelf: 'flex-start',
                border: 'none',
                boxShadow: '0 4px 6px -1px rgba(15, 23, 42, 0.2)',
                transition: 'all 0.15s ease',
              }}
            >
              <Lock size={18} />
              <span>{saving ? 'Updating Password...' : 'Update Password'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
