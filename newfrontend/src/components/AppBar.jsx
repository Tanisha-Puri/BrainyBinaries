import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/AppBar.css';

const AppBar = () => {
  return (
    <header className="app-bar">
      <div className="app-bar-left">
        <img src="/LinkedIn_logo.png" alt="LinkedIn Logo" className="logo" />
        <h1 className="app-name">Roadmap Builder and Peer-Pod-Matcher</h1>
      </div>
      <div className="app-bar-right">
        <Link to="/" className="home-button">Home</Link>
      </div>
    </header>
  );
};

export default AppBar;
