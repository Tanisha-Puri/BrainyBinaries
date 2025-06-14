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
  const [feedback, setFeedback] = useState('');  // ✅ NEW: User feedback input
  const [refining, setRefining] = useState(false); // ✅ NEW: Loading state for refinement

  const goalId = location.state?.goalId || sessionStorage.getItem('goalId');

  useEffect(() => {
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
  }, [goalId, navigate]);

  const handleRefine = async () => {
    if (!feedback.trim()) return;

    setRefining(true);
    try {
      const response = await axios.patch(`http://localhost:5000/api/roadmap/${goalId}/update`, {
        feedback,
      });
      setRoadmapText(response.data.roadmap);
      setFeedback('');
    } catch (error) {
      console.error("Error refining roadmap:", error);
      alert("Failed to refine roadmap. Please try again.");
    } finally {
      setRefining(false);
    }
  };

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
        <>
        <div className="center-wrapper">
          <div className="button-group">
            <button
              onClick={() => navigate('/start-roadmap', { state: { roadmap: roadmapText, goalId } })}
              className="button-primary"
            >
              Start Roadmap
            </button>
          </div>
          </div>

          {/* ✅ NEW: Feedback and refine option */}
          <div className="refine-section">
            <textarea
              className="feedback-textarea"
              placeholder="Enter your feedback to refine the roadmap..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            />
            <button
              className="button-secondary"
              onClick={handleRefine}
              disabled={refining}
            >
              {refining ? "Refining..." : "Refine Roadmap"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default RoadmapDisplay;
