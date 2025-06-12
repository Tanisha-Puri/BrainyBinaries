import React, { useEffect, useRef, useState } from 'react';
   import { Link } from 'react-router-dom';
   import { Tooltip } from 'react-tooltip';
   import * as d3 from 'd3';
   import axios from 'axios';
   import './UserDashboard.css';

   function UserDashboard() {
     const [user, setUser] = useState(null);
     const [roadmap, setRoadmap] = useState([]);
     const [motivationalMessage, setMotivationalMessage] = useState('');
     const [loading, setLoading] = useState(true);
     const [error, setError] = useState(null);
     const [selectedNode, setSelectedNode] = useState(null);
     const svgRef = useRef(null);

     useEffect(() => {
       const fetchData = async () => {
         try {
           setLoading(true);
           setError(null);

           // Fetch user profile
           const userResponse = await axios.get('http://localhost:3000/api/user');
           setUser(userResponse.data);

           // Fetch roadmap
           const roadmapResponse = await axios.get('http://localhost:3000/api/roadmap');
           setRoadmap(roadmapResponse.data);

           // Fetch motivational message
           const motivationResponse = await axios.get('http://localhost:3000/api/motivation');
           setMotivationalMessage(motivationResponse.data.message);
         } catch (err) {
           setError('Failed to fetch data from the backend. Please try again later.');
           console.error(err);
         } finally {
           setLoading(false);
         }
       };

       fetchData();
     }, []);

     useEffect(() => {
       if (!roadmap.length || loading) return;

       const svg = d3.select(svgRef.current);
       svg.selectAll('*').remove(); // Clear previous content

       const width = 300;
       const height = 500;
       const nodeRadius = 15;
       const nodeSpacing = 100;

       svg.attr('width', width).attr('height', height);

       // Define nodes with positions for a linear vertical layout
       const nodes = roadmap.map((node, index) => ({
         id: node.id,
         title: node.title,
         completed: node.completed,
         resource: node.resource,
         x: width / 2, // Center horizontally
         y: 50 + index * nodeSpacing // Space vertically
       }));

       // Define edges (links between consecutive nodes)
       const edges = roadmap.slice(0, -1).map((node, index) => ({
         source: nodes[index],
         target: nodes[index + 1]
       }));

       // Draw edges (lines between nodes)
       svg
         .selectAll('.edge')
         .data(edges)
         .enter()
         .append('line')
         .attr('class', 'edge')
         .attr('x1', d => d.source.x)
         .attr('y1', d => d.source.y)
         .attr('x2', d => d.target.x)
         .attr('y2', d => d.target.y)
         .attr('stroke', '#999')
         .attr('stroke-width', 2)
         .attr('marker-end', 'url(#arrow)');

       // Add arrowheads to edges
       svg
         .append('defs')
         .append('marker')
         .attr('id', 'arrow')
         .attr('viewBox', '0 -5 10 10')
         .attr('refX', 10)
         .attr('refY', 0)
         .attr('markerWidth', 6)
         .attr('markerHeight', 6)
         .attr('orient', 'auto')
         .append('path')
         .attr('d', 'M0,-5L10,0L0,5')
         .attr('fill', '#999');

       // Draw nodes (circles)
       const nodeGroup = svg
         .selectAll('.node-group')
         .data(nodes)
         .enter()
         .append('g')
         .attr('class', 'node-group')
         .attr('transform', d => `translate(${d.x},${d.y})`);

       nodeGroup
         .append('circle')
         .attr('r', nodeRadius)
         .attr('fill', d => (d.completed ? '#d4edda' : '#e0e0e0'))
         .attr('stroke', d => (d.completed ? '#28a745' : '#666'))
         .attr('stroke-width', 1)
         .attr('data-tooltip-id', d => `tooltip-${d.id}`)
         .attr('data-tooltip-content', d => `Resource: ${d.resource}`)
         .on('click', (event, d) => {
           setSelectedNode(d);
         });

       // Add labels to nodes
       nodeGroup
         .append('text')
         .attr('dy', nodeRadius + 20)
         .attr('text-anchor', 'middle')
         .text(d => d.title)
         .attr('font-size', '12px')
         .attr('fill', '#333');
     }, [roadmap, loading]);

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
             <div className="roadmap-graph">
               <svg ref={svgRef} className="roadmap-svg"></svg>
               {roadmap.map(node => (
                 <Tooltip
                   key={node.id}
                   id={`tooltip-${node.id}`}
                   place="right"
                 />
               ))}
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