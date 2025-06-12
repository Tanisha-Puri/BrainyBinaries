import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import '../styles/RoadmapDisplay.css';

function RoadmapDisplay() {
  const navigate = useNavigate();
  const location = useLocation();
  const [roadmapText, setRoadmapText] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const goalId = location.state?.goalId; // goalId should be passed from previous route

    if (!goalId) {
      navigate('/');
      return;
    }

    const fetchRoadmap = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/generate-roadmap/${goalId}`);
        setRoadmapText(response.data.roadmap);
      } catch (error) {
        console.error("Error fetching roadmap:", error);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchRoadmap();
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
            onClick={() => navigate('/start-roadmap', { state: { roadmap: roadmapText } })}
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
