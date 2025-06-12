import React from 'react';
import '../styles/AppBar.css';

const AppBar = () => {
  return (
    <header className="app-bar">
      <div className="app-bar-left">
        <img src="/linkedin_logo.png" alt="LinkedIn Logo" className="logo" />
        <h1 className="app-name">Roadmap Builder</h1>
      </div>
    </header>
  );
};

export default AppBar;
