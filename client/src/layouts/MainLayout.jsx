import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar.jsx';

export default function MainLayout() {
  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
    }}>
      <Sidebar />
      <main style={{
        flex: 1,
        minWidth: 0,
        display: 'flex',
        flexDirection: 'column',
      }}>
        <Outlet />
      </main>
    </div>
  );
}
