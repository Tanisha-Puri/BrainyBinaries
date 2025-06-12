import React from 'react';
   import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
   import UserDashboard from './UserDashboard';
   import './App.css';

   function Dashboard() {
     const userName = "Jane Doe"; // Updated from Tanisha Puri

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
           <Route path="/peer-pod-matcher" element={<div>Peer Pod Matcher - Coming Soon</div>} />
           <Route path="/user-dashboard" element={<UserDashboard />} />
           <Route path="/add-interest" element={<div>Add Interest - Coming Soon</div>} />
         </Routes>
       </Router>
     );
   }

   export default App;