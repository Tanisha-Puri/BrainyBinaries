import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';
import '../styles/RoadmapForm.css';

function RoadmapForm() {
  const [goal, setGoal] = useState({ goal: '', timeline: '', level: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (field, value) => {
    setGoal(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Step 1: Save user goal
      const saveRes = await axios.post('http://localhost:5000/api/user-goal', goal);

      if (!saveRes.data._id) {
        throw new Error('Failed to retrieve saved goal ID');
      }

      const goalId = saveRes.data._id;

      // Step 2: Navigate to RoadmapDisplay with goal ID
      navigate('/roadmap-display', { state: { goalId } });

    } catch (error) {
      console.error('Error during goal submission:', error);
      alert('Failed to save and generate roadmap. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="form-container">
      <div className="card">
        <h2 className="form-title">Generate Your Roadmap</h2>
        <form onSubmit={handleSubmit}>
          <div className="goal-section">
            <div className="goal-fields">
              <input
                type="text"
                placeholder="Your goal"
                value={goal.goal}
                onChange={(e) => handleChange('goal', e.target.value)}
                className="input-field"
                required
              />
              <input
                type="text"
                placeholder="Timeline (e.g. 3 months)"
                value={goal.timeline}
                onChange={(e) => handleChange('timeline', e.target.value)}
                className="input-field"
                required
              />
              <select
                value={goal.level}
                onChange={(e) => handleChange('level', e.target.value)}
                className="input-field"
                required
              >
                <option value="">Select your level</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>

          <div className="button-group">
            <button type="submit" className="button-primary">
              Generate Roadmap
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RoadmapForm;
