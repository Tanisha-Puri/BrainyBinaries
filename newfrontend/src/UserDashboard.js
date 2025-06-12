import React, { useEffect, useRef, useState } from 'react';
   import { Link } from 'react-router-dom';
   import axios from 'axios';
   import './UserDashboard.css';
   import ReactMarkdown from "react-markdown";

   function UserDashboard() {
     const [user, setUser] = useState(null);
     const [roadmap, setRoadmap] = useState('');
     const [motivationalMessage, setMotivationalMessage] = useState('');
     const [loading, setLoading] = useState(true);
     const [error, setError] = useState(null);
     const [selectedNode, setSelectedNode] = useState(null);

     useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch user goals
      const goalResponse = await axios.get('http://localhost:5000/api/user-goal');
      const goals = goalResponse.data;

      if (goals.length === 0) {
        setError("No goals found. Please add one.");
        setLoading(false);
        return;
      }

      // For simplicity, pick the first goal and generate roadmap for it
      const selectedGoal = goals[0];
      setUser({ name: "User", roadmapsStarted: goals.length, interestsAdded: 1 }); // dummy user info

      const roadmapResponse = await axios.get(`http://localhost:5000/api/generate-roadmap/${selectedGoal._id}`);
      setRoadmap(roadmapResponse.data.roadmap); // should be a string
    } catch (err) {
      setError("Failed to fetch roadmap.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, []);

     if (loading) {
       return (
         <div className="UserDashboard">
           <header className="UserDashboard-header">
             <h1>User Dashboard</h1>
           </header>
           <main className="UserDashboard-main">
             <p>Loading...</p>
           </main>
         </div>
       );
     }

     if (error) {
       return (
         <div className="UserDashboard">
           <header className="UserDashboard-header">
             <h1>User Dashboard</h1>
           </header>
           <main className="UserDashboard-main">
             <p className="error">{error}</p>
           </main>
         </div>
       );
     }

     return (
       <div className="UserDashboard">
         <header className="UserDashboard-header">
           <h1>User Dashboard</h1>
         </header>
         <main className="UserDashboard-main">
           <div className="roadmap-section">
  <h2>Your Roadmap</h2>
  <div className="roadmap-markdown">
    <ReactMarkdown>{roadmap}</ReactMarkdown>
  </div>
</div>
           <div className="info-section">
             <div className="profile-section">
               <h3>{user?.name || 'User'}</h3>
               <p>Roadmaps Started: {user?.roadmapsStarted || 0}</p>
               <p>Interests Added: {user?.interestsAdded || 0}</p>
             </div>
             {selectedNode && (
               <div className="node-details">
                 <h3>Node Details</h3>
                 <p><strong>Title:</strong> {selectedNode.title}</p>
                 <p><strong>Status:</strong> {selectedNode.completed ? 'Completed' : 'Pending'}</p>
                 <p><strong>Resource:</strong> <a href={selectedNode.resource} target="_blank" rel="noopener noreferrer">{selectedNode.resource}</a></p>
               </div>
             )}
             <div className="motivation-section">
               <p>{motivationalMessage || 'Keep up the good work!'}</p>
             </div>
             <div className="action-section">
               <Link to="/add-interest" className="action-button">
                 Add Another Interest
               </Link>
             </div>
           </div>
         </main>
       </div>
     );
   }

   export default UserDashboard;