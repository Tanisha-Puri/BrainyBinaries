import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import './UserDashboard.css';

function UserDashboard() {
  const [user, setUser] = useState(null);
  const [roadmap, setRoadmap] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const goalResponse = await axios.get('http://localhost:5000/api/user-goal');
        const goals = goalResponse.data;

        if (goals.length === 0) {
          setError('No goals found. Please add one.');
          setLoading(false);
          return;
        }

        const goalsWithData = await Promise.all(
          goals.map(async (goal) => {
            console.log('Goal from API:', goal);
            const [roadmapRes, progressRes] = await Promise.all([
              axios.get(`http://localhost:5000/api/generate-roadmap/${goal._id}`),
              axios.get(`http://localhost:5000/api/user-goal/${goal._id}/progress`),
            ]);
            const markdown = roadmapRes.data?.roadmap || '';

            // parse steps (numbered list with bold titles)
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
              goalTitle: goal.goal && goal.goal.trim() !== '' ? goal.goal : 'Untitled Goal',
              steps,
              progress,
              percentage,
            };
          })
        );

        setUser({
          name: 'User',
          roadmapsStarted: goals.length,
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

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="UserDashboard">
      <header>
        {/* <h1>User Dashboard</h1> */}
      </header>
      <main>
        <section className="roadmap-section">
         <h2 className="dashboard-heading"> <img 
    src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linkedin/linkedin-original.svg" 
    alt="LinkedIn"
    className="linkedin-icon"
  />User Dashboard</h2>
          {roadmap.length === 0 && <p>No roadmaps found.</p>}
          {roadmap.map((rmap) => (
            <div key={rmap.goalId} className="roadmap-card">
              <h3>{rmap.goalTitle}</h3>
              <p>{rmap.percentage}% completed</p>
              <div className="progress-bar-bg">
                <div className="progress-bar-fill" style={{ width: `${rmap.percentage}%` }} />
              </div>
              {/* <Link to="/start-roadmap" state={{ goalId: rmap.goalId }} className="resume-button">
                Continue Roadmap →
              </Link>
              <Link
                to="/roadmap-display"
                state={{ goalId: rmap.goalId }}
                className="edit-button"
              >
                View Full Roadmap
              </Link>  */}
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
          <p>Roadmaps Started: {user?.roadmapsStarted || 0}</p>
        </section>
      </main>
    </div>
  );
}

export default UserDashboard;
