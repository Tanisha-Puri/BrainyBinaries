import React from 'react';
import AppBar from './AppBar';
import '../styles/AppLayout.css';

const AppLayout = ({ children }) => {
  return (
    <div className="layout">
      <AppBar />
      <main className="main-content-no-sidebar">
        {children}
      </main>
    </div>
  );
};

export default AppLayout;
