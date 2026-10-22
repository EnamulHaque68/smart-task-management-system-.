import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';
import ValidationAlert from '../components/ValidationAlert.jsx';
import {
  Layers,
  Zap,
  ShieldCheck,
  User,
  ArrowRight,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Globe,
  ChevronDown,
} from 'lucide-react';

export default function Login() {
  const [formData, setFormData] = useState({ email: 'demo@brightmind.com', password: 'password123' });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errors, setErrors] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [instantLoginLoading, setInstantLoginLoading] = useState(false);

  // Language selector state
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors([]);
    setErrorMessage('');
  };

  // 1-Click Instant Login handler
  const handleInstantLogin = async (email, password) => {
    setInstantLoginLoading(true);
    setErrors([]);
    setErrorMessage('');
    try {
      await login({ email, password });
      navigate('/dashboard');
    } catch (err) {
      setErrorMessage(err.message || 'Login failed');
      setErrors(err.errors || []);
    } finally {
      setInstantLoginLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors([]);
    setErrorMessage('');

    try {
      await login(formData);
      navigate('/dashboard');
    } catch (err) {
      setErrorMessage(err.message || 'Login failed');
      setErrors(err.errors || []);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    // Convenient simulation: instant login as Alex Morgan
    handleInstantLogin('demo@brightmind.com', 'password123');
  };

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      {/* Top-Right Language Selector Dropdown */}
      <div style={{ position: 'absolute', top: '-1.5rem', right: '0', zIndex: 30 }}>
        <button
          type="button"
          onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '5px 10px',
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            fontSize: '0.75rem',
            fontWeight: '600',
            color: '#475569',
            cursor: 'pointer',
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.04)',
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#cbd5e1')}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#e2e8f0')}
        >
          <Globe size={13} color="#64748b" />
          <span>{selectedLanguage}</span>
          <ChevronDown size={13} color="#64748b" />
        </button>

        {isLangMenuOpen && (
          <div
            style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              marginTop: '4px',
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              padding: '4px',
              minWidth: '110px',
              zIndex: 40,
            }}
          >
            {['English', 'Español', 'Français', 'Deutsch', 'বাংলা'].map((lang) => (
              <div
                key={lang}
                onClick={() => {
                  setSelectedLanguage(lang);
                  setIsLangMenuOpen(false);
                }}
                style={{
                  padding: '6px 10px',
                  fontSize: '0.75rem',
                  fontWeight: selectedLanguage === lang ? '700' : '500',
                  color: selectedLanguage === lang ? '#2563eb' : '#334155',
                  backgroundColor: selectedLanguage === lang ? '#eff6ff' : 'transparent',
                  borderRadius: '6px',
                  cursor: 'pointer',
                }}
              >
                {lang}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Centered Brand Header */}
      <div style={{ textAlign: 'center', marginTop: '0.5rem', marginBottom: '1.25rem' }}>
        <div
          style={{
            width: '46px',
            height: '46px',
            borderRadius: '12px',
            backgroundColor: '#2563eb',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto',
            boxShadow: '0 6px 16px rgba(37, 99, 235, 0.35)',
          }}
        >
          <Layers size={24} />
        </div>
        <h2
          style={{
            fontSize: '1.25rem',
            fontWeight: '800',
            color: '#0f172a',
            margin: '8px 0 0',
            letterSpacing: '-0.02em',
          }}
        >
          TaskFlow
        </h2>
        <div
          style={{
            fontSize: '0.68rem',
            fontWeight: '700',
            color: '#94a3b8',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginTop: '2px',
          }}
        >
          Bright Mind Ltd
        </div>

        {/* Welcome Back Header */}
        <h1
          style={{
            fontSize: '1.45rem',
            fontWeight: '800',
            color: '#0f172a',
            letterSpacing: '-0.02em',
            margin: '12px 0 0',
          }}
        >
          Welcome back 👋
        </h1>
        <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '4px', margin: '4px 0 0' }}>
          Log in to access your projects, tasks, and analytics.
        </p>
      </div>

      {/* Quick 1-Click Login Card Matching Image 2 */}
      <div
        style={{
          backgroundColor: '#eff6ff',
          borderRadius: '12px',
          border: '1px solid #bfdbfe',
          padding: '10px 12px',
          marginBottom: '1rem',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            color: '#1e40af',
            fontSize: '0.78rem',
            fontWeight: '700',
            marginBottom: '8px',
          }}
        >
          <Zap size={14} color="#2563eb" fill="#2563eb" />
          <span>Quick 1-Click Login:</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
          {/* Instant Admin Login Button */}
          <button
            type="button"
            disabled={instantLoginLoading || loading}
            onClick={() => handleInstantLogin('demo@brightmind.com', 'password123')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '8px 12px',
              backgroundColor: '#ffffff',
              borderRadius: '8px',
              border: '1px solid #93c5fd',
              color: '#1d4ed8',
              fontSize: '0.78rem',
              fontWeight: '700',
              cursor: instantLoginLoading ? 'wait' : 'pointer',
              boxShadow: '0 1px 2px rgba(37, 99, 235, 0.08)',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#dbeafe')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#ffffff')}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={15} color="#2563eb" />
              <span>Log in as Alex Morgan (Admin / Lead)</span>
            </div>
            <ArrowRight size={13} />
          </button>

          {/* Instant Member Login Button */}
          <button
            type="button"
            disabled={instantLoginLoading || loading}
            onClick={() => handleInstantLogin('sarah.wilson@brightmind.com', 'password123')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '8px 12px',
              backgroundColor: '#ffffff',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              color: '#334155',
              fontSize: '0.78rem',
              fontWeight: '600',
              cursor: instantLoginLoading ? 'wait' : 'pointer',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f1f5f9')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#ffffff')}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <User size={15} color="#10b981" />
              <span>Log in as Sarah Wilson (Team Member)</span>
            </div>
            <ArrowRight size={13} color="#10b981" />
          </button>
        </div>
      </div>

      <ValidationAlert errors={errors} message={errorMessage} />

      {/* Manual Email & Password Form */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        {/* Email Address with Mail Icon */}
        <div>
          <label
            style={{
              display: 'block',
              fontSize: '0.78rem',
              fontWeight: '600',
              color: '#334155',
              marginBottom: '5px',
            }}
          >
            Email Address
          </label>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '9px 12px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              backgroundColor: '#ffffff',
              transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = '#2563eb';
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = '#cbd5e1';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <Mail size={16} color="#94a3b8" />
            <input
              type="email"
              name="email"
              placeholder="demo@brightmind.com"
              required
              value={formData.email}
              onChange={handleChange}
              style={{
                width: '100%',
                border: 'none',
                outline: 'none',
                fontSize: '0.825rem',
                color: '#0f172a',
                backgroundColor: 'transparent',
              }}
            />
          </div>
        </div>

        {/* Password with Lock Icon & Show/Hide Eye Toggle */}
        <div>
          <label
            style={{
              display: 'block',
              fontSize: '0.78rem',
              fontWeight: '600',
              color: '#334155',
              marginBottom: '5px',
            }}
          >
            Password
          </label>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '9px 12px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              backgroundColor: '#ffffff',
              transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = '#2563eb';
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = '#cbd5e1';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <Lock size={16} color="#94a3b8" />
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="••••••••••"
              required
              value={formData.password}
              onChange={handleChange}
              style={{
                width: '100%',
                border: 'none',
                outline: 'none',
                fontSize: '0.825rem',
                color: '#0f172a',
                backgroundColor: 'transparent',
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              title={showPassword ? 'Hide password' : 'Show password'}
              style={{
                background: 'transparent',
                border: 'none',
                padding: '2px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                color: '#94a3b8',
              }}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {/* Remember Me & Forgot Password Row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            margin: '2px 0 4px',
          }}
        >
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', userSelect: 'none' }}>
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              style={{
                accentColor: '#2563eb',
                width: '14px',
                height: '14px',
                cursor: 'pointer',
              }}
            />
            <span style={{ fontSize: '0.78rem', fontWeight: '600', color: '#475569' }}>
              Remember me
            </span>
          </label>

          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              alert('Password reset instructions have been simulated for this demo.');
            }}
            style={{
              fontSize: '0.78rem',
              fontWeight: '600',
              color: '#2563eb',
              textDecoration: 'none',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
            onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
          >
            Forgot password?
          </a>
        </div>

        {/* Log in to Dashboard Button */}
        <button
          type="submit"
          disabled={loading || instantLoginLoading}
          style={{
            marginTop: '2px',
            width: '100%',
            padding: '11px',
            backgroundColor: '#2563eb',
            color: '#ffffff',
            borderRadius: '8px',
            fontSize: '0.85rem',
            fontWeight: '700',
            boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transition: 'background-color 0.15s ease',
            cursor: loading || instantLoginLoading ? 'wait' : 'pointer',
          }}
          onMouseEnter={(e) => !loading && (e.currentTarget.style.backgroundColor = '#1d4ed8')}
          onMouseLeave={(e) => !loading && (e.currentTarget.style.backgroundColor = '#2563eb')}
        >
          <span>{loading || instantLoginLoading ? 'Authenticating...' : 'Log in to Dashboard'}</span>
          <ArrowRight size={15} />
        </button>

        {/* Or continue with divider */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            margin: '4px 0',
          }}
        >
          <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }} />
          <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: '600' }}>
            Or continue with
          </span>
          <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }} />
        </div>

        {/* Social Logins: Google & Microsoft */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '10px',
          }}
        >
          {/* Google Button */}
          <button
            type="button"
            onClick={() => handleSocialLogin('Google')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '9px 12px',
              backgroundColor: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: '8px',
              fontSize: '0.75rem',
              fontWeight: '600',
              color: '#334155',
              cursor: 'pointer',
              transition: 'background-color 0.15s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f8fafc')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#ffffff')}
          >
            <svg width="15" height="15" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>Continue with Google</span>
          </button>

          {/* Microsoft Button */}
          <button
            type="button"
            onClick={() => handleSocialLogin('Microsoft')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '9px 12px',
              backgroundColor: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: '8px',
              fontSize: '0.75rem',
              fontWeight: '600',
              color: '#334155',
              cursor: 'pointer',
              transition: 'background-color 0.15s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f8fafc')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#ffffff')}
          >
            <svg width="14" height="14" viewBox="0 0 21 21">
              <rect x="1" y="1" width="9" height="9" fill="#f25022" />
              <rect x="11" y="1" width="9" height="9" fill="#7fba00" />
              <rect x="1" y="11" width="9" height="9" fill="#00a4ef" />
              <rect x="11" y="11" width="9" height="9" fill="#ffb900" />
            </svg>
            <span>Continue with Microsoft</span>
          </button>
        </div>

        {/* Switch to Register */}
        <div style={{ textAlign: 'center', fontSize: '0.8rem', color: '#64748b', marginTop: '6px' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: '#2563eb', fontWeight: '700', textDecoration: 'none' }}>
            Create an account
          </Link>
        </div>
      </form>
    </div>
  );
}
