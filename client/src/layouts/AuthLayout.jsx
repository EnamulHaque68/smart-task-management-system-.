import React from 'react';
import { Outlet } from 'react-router-dom';
import { Layers, TrendingUp, BarChart2, CheckCircle2 } from 'lucide-react';

export default function AuthLayout() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f1f5f9',
      padding: '2rem 1rem',
    }}>
      <div style={{
        maxWidth: '1020px',
        width: '100%',
        backgroundColor: '#ffffff',
        borderRadius: '24px',
        boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.12)',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        overflow: 'hidden',
        border: '1px solid #e2e8f0',
      }}>
        {/* Left Visual Banner (Matches Image 2) */}
        <div style={{
          background: 'linear-gradient(145deg, #94a3b8 0%, #64748b 50%, #475569 100%)',
          padding: '3rem 2.5rem',
          color: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              backgroundColor: '#ffffff',
              color: '#2563eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 10px rgba(0, 0, 0, 0.15)',
            }}>
              <Layers size={22} />
            </div>
            <span style={{ fontSize: '1.25rem', fontWeight: '800', letterSpacing: '-0.02em', color: '#ffffff' }}>
              TaskFlow
            </span>
          </div>

          {/* Inspirational Headline & Preview Card */}
          <div style={{ margin: '2.5rem 0' }}>
            <h2 style={{ fontSize: '1.85rem', fontWeight: '800', lineHeight: 1.25, letterSpacing: '-0.02em', color: '#ffffff' }}>
              Keep your Projects, Tasks and all your services on track!
            </h2>
            <p style={{ marginTop: '0.85rem', fontSize: '0.9rem', color: '#e2e8f0', lineHeight: 1.5, opacity: 0.9 }}>
              Quite simply, analytics to help users see insights and all meaningful data that we might not otherwise detect.
            </p>

            {/* Dashboard Floating Preview Card (Matches Image 2) */}
            <div style={{
              marginTop: '2rem',
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              padding: '1.25rem',
              color: '#0f172a',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.25)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#0f172a' }}>Live Dashboard Preview</span>
                <span style={{ fontSize: '0.75rem', fontWeight: '600', color: '#10b981', backgroundColor: '#ecfdf5', padding: '2px 8px', borderRadius: '9999px' }}>
                  ● Active
                </span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', textAlign: 'center' }}>
                <div style={{ backgroundColor: '#f8fafc', padding: '8px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Projects</div>
                  <div style={{ fontSize: '1rem', fontWeight: '800', color: '#2563eb' }}>8 Active</div>
                </div>
                <div style={{ backgroundColor: '#f8fafc', padding: '8px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Tasks Done</div>
                  <div style={{ fontSize: '1rem', fontWeight: '800', color: '#10b981' }}>78%</div>
                </div>
                <div style={{ backgroundColor: '#f8fafc', padding: '8px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Team</div>
                  <div style={{ fontSize: '1rem', fontWeight: '800', color: '#8b5cf6' }}>5 Users</div>
                </div>
              </div>
            </div>
          </div>

          {/* Dots Carousel Indicator */}
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            <span style={{ width: '24px', height: '6px', borderRadius: '9999px', backgroundColor: '#ffffff' }} />
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'rgba(255, 255, 255, 0.5)' }} />
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'rgba(255, 255, 255, 0.5)' }} />
          </div>
        </div>

        {/* Right Form Container */}
        <div style={{
          padding: '3rem 2.5rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
