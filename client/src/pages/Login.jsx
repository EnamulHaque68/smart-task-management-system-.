import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';
import ValidationAlert from '../components/ValidationAlert.jsx';
import { Sparkles } from 'lucide-react';

export default function Login() {
  const [formData, setFormData] = useState({ email: 'demo@brightmind.com', password: 'password123' });
  const [errors, setErrors] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors([]);
    setErrorMessage('');
  };

  const handleFillDemo = () => {
    setFormData({ email: 'demo@brightmind.com', password: 'password123' });
    setErrors([]);
    setErrorMessage('');
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
        Enter your details to access your dashboard.
      </p>

      {/* Demo helper pill */}
      <div
        onClick={handleFillDemo}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 12px',
          backgroundColor: '#eff6ff',
          borderRadius: '8px',
          border: '1px solid #bfdbfe',
          color: '#1d4ed8',
          fontSize: '0.8rem',
          fontWeight: '600',
          cursor: 'pointer',
          marginBottom: '1.25rem',
        }}
      >
        <Sparkles size={16} />
        <span>Click to auto-fill Demo Admin credentials</span>
      </div>

      <ValidationAlert errors={errors} message={errorMessage} />

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
        {/* Email */}
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>
            Email*
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
          disabled={loading}
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
            cursor: loading ? 'wait' : 'pointer',
          }}
          onMouseEnter={(e) => !loading && (e.currentTarget.style.backgroundColor = '#1d4ed8')}
          onMouseLeave={(e) => !loading && (e.currentTarget.style.backgroundColor = '#2563eb')}
        >
          {loading ? 'Logging in...' : 'Log in'}
        </button>

        {/* Sign in with Google */}
        <button
          type="button"
          onClick={() => alert('Google authentication is simulated for this demo')}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            padding: '11px',
            backgroundColor: '#ffffff',
            border: '1px solid #cbd5e1',
            borderRadius: '8px',
            fontSize: '0.9rem',
            fontWeight: '600',
            color: '#334155',
            cursor: 'pointer',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
          </svg>
          <span>Sign in with Google</span>
        </button>

        {/* Switch Link */}
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
