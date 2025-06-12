import React from 'react';
<<<<<<< HEAD
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RoadmapForm from './pages/RoadmapForm';
import RoadmapDisplay from './pages/RoadmapDisplay';
import StartRoadmap from './pages/StartRoadmap';
import AppLayout from './components/AppLayout';
import EditTask from './pages/EditTask';




function App() {
  return (
    <Router>
      <AppLayout>
        <Routes>

          
          <Route path="/" element={<StartRoadmap />} />
          
        </Routes>
      </AppLayout>
    </Router>
  );
}
=======
   import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
   import UserDashboard from './UserDashboard';
   import PeerPodMatcher from './Pages/PeerPodMatcher';
   import './App.css';

   function Dashboard() {
     const userName = "Jane Doe"; // Updated from Tanisha Puri
>>>>>>> 9b7d0720efa9ec8a5601462d02fae0b87978ee88

     return (
       <div className="App">
         <header className="App-header">
           <h1>Welcome, {userName}!</h1>
           <p>Your personalized dashboard</p>
         </header>
         <main className="App-main">
           <div className="options">
             <Link to="/roadmap" className="option-button">
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
           <Route path="/" element={<Dashboard />} />
           <Route path="/roadmap" element={<div>Gen AI Roadmap Generator - Coming Soon</div>} />
           <Route path="/peer-pod-matcher" element={<PeerPodMatcher />} />
           <Route path="/user-dashboard" element={<UserDashboard />} />
           <Route path="/add-interest" element={<div>Add Interest - Coming Soon</div>} />
         </Routes>
       </Router>
     );
   }

   export default App;