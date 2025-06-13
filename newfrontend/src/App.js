import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import RoadmapForm from './Pages/RoadmapForm';
import RoadmapDisplay from './Pages/RoadmapDisplay';
import StartRoadmap from './Pages/StartRoadmap';
import AppLayout from './components/AppLayout';
import UserDashboard from './UserDashboard';
import PeerPodMatcher from './Pages/PeerPodMatcher';
import './App.css';

function Dashboard() {
  const userName = "Jane Doe";

  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome, {userName}!</h1>
        <p>Your personalized dashboard</p>
      </header>
      <main className="App-main">
        <div className="options">
          <Link to="/roadmap-form" className="option-button">
            Gen AI Roadmap Generator
          </Link>
          <Link to="/peer-pod-matcher" className="option-button">
            Peer Pod Matcher
          </Link>
          <Link to="/user-dashboard" className="option-button">
            User Dashboard
          </Link>
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AppLayout><Dashboard /></AppLayout>} />
        <Route path="/roadmap-form" element={<AppLayout><RoadmapForm /></AppLayout>} />
        <Route path="/roadmap-display" element={<AppLayout><RoadmapDisplay /></AppLayout>} />
        <Route path="/start-roadmap" element={<AppLayout><StartRoadmap /></AppLayout>} />
        <Route path="/peer-pod-matcher" element={<AppLayout><PeerPodMatcher /></AppLayout>} />
        <Route path="/user-dashboard" element={<AppLayout><UserDashboard /></AppLayout>} />
        <Route path="/add-interest" element={<AppLayout><div>Add Interest - Coming Soon</div></AppLayout>} />
      </Routes>
    </Router>
  );
}

export default App;
