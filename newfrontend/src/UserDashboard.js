import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './UserDashboard.css';
const backendURL = process.env.REACT_APP_BACKEND_URL;

function UserDashboard() {
  const [user, setUser] = useState(null);
  const [roadmap, setRoadmap] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const goalResponse = await axios.get(`${backendURL}/api/user-goal`);
        const goals = goalResponse.data;

        if (goals.length === 0) {
          setError('No goals found. Please add one.');
          setLoading(false);
          return;
        }

        const goalsWithData = await Promise.all(
          goals.map(async (goal) => {
            const [roadmapRes, progressRes] = await Promise.all([
              axios.get(`${backendURL}/api/generate-roadmap/${goal._id}`),
              axios.get(`${backendURL}/api/user-goal/${goal._id}/progress`),
            ]);
            const markdown = roadmapRes.data?.roadmap || '';

            const regex = /\d+\.\s\*\*(.*?)\*\*\s*:?([\s\S]*?)(?=\n\d+\.|\n🎯|\n---|$)/g;
            const matches = [...markdown.matchAll(regex)];

            const steps = matches.map((match, index) => ({
              id: `step-${index}`,
              title: match[1].trim(),
              description: match[2].trim(),
            }));

            const progress = progressRes.data?.progress || {};
            const completedSteps = Object.values(progress).filter(Boolean).length;
            const totalSteps = steps.length;
            const percentage = totalSteps ? Math.round((completedSteps / totalSteps) * 100) : 0;

            return {
              goalId: goal._id,
              goalTitle: goal.goal?.trim() || 'Untitled Goal',
              steps,
              progress,
              percentage,
            };
          })
        );

        const completed = goalsWithData.filter(g => g.percentage === 100).length;
        const started = goalsWithData.filter(g => g.percentage >= 0 && g.percentage < 100).length;

        setUser({
          name: 'User',
          roadmapsStarted: started,
          roadmapsCompleted: completed,
          interestsAdded: 1,
        });

        setRoadmap(goalsWithData);
      } catch (err) {
        setError('Failed to fetch roadmap.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const handleDelete = async (goalId) => {
  const confirmDelete = window.confirm("Are you sure you want to delete this roadmap?");
  if (!confirmDelete) return;

  try {
    await axios.delete(`${backendURL}/api/user-goal/${goalId}`);
    setRoadmap(prev => {
      const updatedRoadmaps = prev.filter(r => r.goalId !== goalId);

      // Recalculate counts
      const completed = updatedRoadmaps.filter(g => g.percentage === 100).length;
      const started = updatedRoadmaps.filter(g => g.percentage >= 0 && g.percentage < 100).length;

      // Update user stats
      setUser(userPrev => ({
        ...userPrev,
        roadmapsStarted: started,
        roadmapsCompleted: completed,
      }));

      return updatedRoadmaps;
    });
  } catch (err) {
    console.error("Error deleting roadmap:", err);
    alert("Failed to delete roadmap.");
  }
};


  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="UserDashboard">
      <header className="UserDashboard-header">
        <h2 className="dashboard-heading">
          <img
            src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linkedin/linkedin-original.svg"
            alt="LinkedIn"
            className="linkedin-icon"
          />
          User Dashboard
        </h2>
      </header>

      <main className="UserDashboard-main">
        <section className="roadmap-section">
          {roadmap.length === 0 && <p>No roadmaps found.</p>}

          {roadmap.map((rmap) => (
            <div key={rmap.goalId} className="roadmap-card">
              <div className="roadmap-card-header">
                <h3>{rmap.goalTitle}</h3>
                <button
                  className="delete-button"
                  title="Delete Roadmap"
                  onClick={() => handleDelete(rmap.goalId)}
                >
                  Delete🗑️
                </button>
              </div>
              <p>{rmap.percentage}% completed</p>
              <div className="progress-bar-bg">
                <div
                  className="progress-bar-fill"
                  style={{ width: `${rmap.percentage}%` }}
                />
              </div>
              <Link
                to="/start-roadmap"
                state={{ goalId: rmap.goalId }}
                className="continue-button"
              >
                Continue Roadmap →
              </Link>
              <Link
                to="/roadmap-display"
                state={{ goalId: rmap.goalId }}
                className="view-button"
              >
                View Full Roadmap
              </Link>
            </div>
          ))}
        </section>

        <section className="profile-section">
          <h3>{user?.name || 'User'}</h3>
          <p>
            Roadmaps Started: <span>{user?.roadmapsStarted || 0}</span>
          </p>
          <p>
            Roadmaps Completed: <span>{user?.roadmapsCompleted || 0}</span>
          </p>
        </section>
      </main>
    </div>
  );
}

export default UserDashboard;
