
import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/RoadmapDisplay.css';

function RoadmapDisplay() {
  const navigate = useNavigate();
  const location = useLocation();
  const [roadmapText, setRoadmapText] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const roadmapFromState = location.state?.roadmap;

    if (!roadmapFromState) {
      // If roadmap data is missing, redirect to home
      navigate('/');
    } else {
      setRoadmapText(roadmapFromState);
      setLoading(false);
    }
  }, [location.state, navigate]);

  if (loading) {
    return <p className="loading-message">Loading your roadmap...</p>;
  }

  return (
    <div className="roadmap-container">
      <h2 className="section-title">Your Personalized Roadmap</h2>

      {roadmapText ? (
        <div className="roadmap-markdown">
          <ReactMarkdown>{roadmapText}</ReactMarkdown>
        </div>
      ) : (
        <p className="empty-message">No roadmap found. Please generate one.</p>
      )}

      {roadmapText && (
        <div className="button-group">
          <button
            onClick={() => navigate('/start-roadmap')}
            className="button-primary"
          >
            Start Roadmap
          </button>
        </div>
      )}
    </div>
  );
}

export default RoadmapDisplay;
