import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';
import ValidationAlert from '../components/ValidationAlert.jsx';
import { Zap, ShieldCheck, UserCheck, ArrowRight } from 'lucide-react';

export default function Login() {
  const [formData, setFormData] = useState({ email: 'demo@brightmind.com', password: 'password123' });
  const [errors, setErrors] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [instantLoginLoading, setInstantLoginLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors([]);
    setErrorMessage('');
  };

  // 1-Click Instant Login handler (No double clicking needed!)
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

  return (
    <div>
      <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.02em' }}>
        Welcome back
      </h2>
      <p style={{ fontSize: '0.9rem', color: '#64748b', marginTop: '6px', marginBottom: '1.25rem' }}>
        Log in to access your projects, tasks, and analytics.
      </p>

      {/* 1-Click Instant Login Box for Ultimate Convenience */}
      <div style={{
        backgroundColor: '#eff6ff',
        borderRadius: '12px',
        border: '1px solid #bfdbfe',
        padding: '1rem',
        marginBottom: '1.5rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#1e40af', fontSize: '0.85rem', fontWeight: '700', marginBottom: '8px' }}>
          <Zap size={16} color="#2563eb" />
          <span>Quick 1-Click Login:</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {/* Instant Admin Login Button */}
          <button
            type="button"
            disabled={instantLoginLoading || loading}
            onClick={() => handleInstantLogin('demo@brightmind.com', 'password123')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '9px 12px',
              backgroundColor: '#ffffff',
              borderRadius: '8px',
              border: '1px solid #93c5fd',
              color: '#1d4ed8',
              fontSize: '0.85rem',
              fontWeight: '700',
              cursor: instantLoginLoading ? 'wait' : 'pointer',
              boxShadow: '0 1px 3px rgba(37, 99, 235, 0.1)',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#dbeafe';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#ffffff';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={16} color="#2563eb" />
              <span>Log in as Alex Morgan (Admin / Lead)</span>
            </div>
            <ArrowRight size={14} />
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
              padding: '9px 12px',
              backgroundColor: '#ffffff',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              color: '#475569',
              fontSize: '0.85rem',
              fontWeight: '600',
              cursor: instantLoginLoading ? 'wait' : 'pointer',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f1f5f9';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#ffffff';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <UserCheck size={16} color="#10b981" />
              <span>Log in as Sarah Wilson (Team Member)</span>
            </div>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>

      <ValidationAlert errors={errors} message={errorMessage} />

      {/* Manual Email & Password Form */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
        {/* Email */}
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>
            Email Address*
          </label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            required
            value={formData.email}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              outline: 'none',
              fontSize: '0.9rem',
              color: '#0f172a',
            }}
          />
        </div>

        {/* Password */}
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>
            Password*
          </label>
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            required
            value={formData.password}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              outline: 'none',
              fontSize: '0.9rem',
              color: '#0f172a',
            }}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || instantLoginLoading}
          style={{
            marginTop: '0.5rem',
            width: '100%',
            padding: '12px',
            backgroundColor: '#2563eb',
            color: '#ffffff',
            borderRadius: '8px',
            fontSize: '0.95rem',
            fontWeight: '700',
            boxShadow: '0 4px 12px rgba(37, 99, 235, 0.35)',
            transition: 'background-color 0.15s ease',
            cursor: loading || instantLoginLoading ? 'wait' : 'pointer',
          }}
          onMouseEnter={(e) => !loading && (e.currentTarget.style.backgroundColor = '#1d4ed8')}
          onMouseLeave={(e) => !loading && (e.currentTarget.style.backgroundColor = '#2563eb')}
        >
          {loading || instantLoginLoading ? 'Authenticating...' : 'Log in to Dashboard'}
        </button>

        {/* Switch to Register */}
        <div style={{ textAlign: 'center', fontSize: '0.875rem', color: '#64748b', marginTop: '0.5rem' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: '#2563eb', fontWeight: '700' }}>
            Create an account
          </Link>
        </div>
      </form>
    </div>
  );
}
