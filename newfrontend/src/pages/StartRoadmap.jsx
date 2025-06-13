import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/StartRoadmap.css';

function StartRoadmap() {
  const [steps, setSteps] = useState([]);
  const [stepIndex, setStepIndex] = useState(0);
  const [progress, setProgress] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);


  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRoadmapFromBackend = async () => {
      try {
        const goalId = location.state?.goalId || sessionStorage.getItem('goalId');

        if (!goalId) {
          alert("No goal ID found. Redirecting...");
          navigate('/');
          return;
        }

        const response = await axios.get(`http://localhost:5000/api/generate-roadmap/${goalId}`);
        const markdown = response.data?.roadmap;

        if (!markdown) {
          alert("No roadmap received. Redirecting...");
          navigate('/');
          return;
        }

        // Extract steps from markdown
        const regex = /\d+\.\s\*\*(.*?)\*\*\s*:?([\s\S]*?)(?=\n\d+\.|\n🎯|\n---|$)/g;
        const matches = [...markdown.matchAll(regex)];

        const extractedSteps = matches.map((match, index) => {
          const rawDesc = match[2].trim();
          const metaMatch = rawDesc.match(/^\((.*?)\):?/);
          const metadata = metaMatch ? metaMatch[1].trim() : null;
          const cleanedDescription = metaMatch
            ? rawDesc.replace(metaMatch[0], '').trim()
            : rawDesc;

          return {
            id: `step-${index}`,
            title: match[1].trim(),
            metadata,
            description: cleanedDescription,
          };
        });

        const progressResponse = await axios.get(
  `http://localhost:5000/api/user-goal/${goalId}/progress`
);
const savedProgress = progressResponse.data.progress || {};

        const initialProgress = {};
        extractedSteps.forEach((step) => {
          initialProgress[step.id] = savedProgress[step.id] || false;
        });

        setSteps(extractedSteps);
        setProgress(initialProgress);
        setLoading(false);
      } catch (error) {
        console.error('Failed to load roadmap:', error);
        alert('Unable to load roadmap. Redirecting...');
        navigate('/');
      }
    };

    fetchRoadmapFromBackend();
  }, [location.state, navigate]);

  const currentStep = steps[stepIndex];

  const toggleCheckbox = async () => {
  const stepId = currentStep.id;
  const updatedProgress = {
    ...progress,
    [stepId]: !progress[stepId],
  };
  setProgress(updatedProgress);

  const goalId = location.state?.goalId || sessionStorage.getItem('goalId');
  try {
    await axios.patch(`http://localhost:5000/api/user-goal/${goalId}/progress`, {
      progress: updatedProgress,
    });
  } catch (err) {
    console.error("Error saving progress:", err);
  }
};


  const completed = Object.values(progress).filter(Boolean).length;
  const percentage = steps.length
    ? Math.round((completed / steps.length) * 100)
    : 0;

  if (loading) return <p className="no-roadmap-message">Loading roadmap...</p>;

  if (steps.length === 0)
    return <p className="no-roadmap-message">No roadmap steps found.</p>;

  return (
    <div className="container">
      <h2 className="step-title">Start Your Roadmap</h2>
      <div className="card">
        <div className="step-header">
          <h3>
            Step {stepIndex + 1}: {currentStep.title}
          </h3>
          <label
            className={`checkbox-label ${progress[currentStep.id] ? 'checked' : ''}`}
          >
            <input
              type="checkbox"
              checked={progress[currentStep.id] || false}
              onChange={toggleCheckbox}
            />
            <span>
              {progress[currentStep.id] ? 'Completed' : 'Mark Complete'}
            </span>
          </label>
        </div>

        {currentStep.metadata && (
          <p className="estimated-time">⏱️ {currentStep.metadata}</p>
        )}

        <div className="step-desc">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {currentStep.description}
          </ReactMarkdown>
        </div>

        <div className="button-row">
          <button
            onClick={() => setStepIndex(stepIndex - 1)}
            disabled={stepIndex === 0}
            className="button"
          >
            Previous
          </button>
          <button
            onClick={() => setStepIndex(stepIndex + 1)}
            disabled={stepIndex === steps.length - 1}
            className="button"
          >
            Next
          </button>
        </div>
      </div>

      <div className="progress-container">
        <div className="button-row">
  <button
  className="button-secondary"
  disabled={saving}
  onClick={async () => {
    setSaving(true);
    const goalId = location.state?.goalId || sessionStorage.getItem('goalId');
    try {
      await axios.patch(`http://localhost:5000/api/user-goal/${goalId}/progress`, {
        progress,
      });
    } catch (err) {
      console.error('Error saving progress before navigating back:', err);
    } finally {
      setSaving(false);
      navigate(-1);
    }
  }}
>
  {saving ? 'Saving...' : '← Back'}
</button>
</div>

        <div className="progress-label">
          {percentage}% completed • {steps.length - completed} steps left
        </div>
        <div className="progress-bar-bg">
          <div
            className="progress-bar-fill"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        {percentage === 100 && (
          <div className="completion-message">
            🎉 You completed the roadmap!
          </div>
        )}
      </div>
    </div>
  );
}

export default StartRoadmap;
