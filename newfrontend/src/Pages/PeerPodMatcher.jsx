import React, { useState } from 'react';
import './PeerPodMatcher.css';

export default function PeerPodMatcher() {
  const [searchInput, setSearchInput] = useState('');
  const [type, setType] = useState('');
  const [profiles, setProfiles] = useState([]);

  const handleSearch = async () => {
  try {
    document.querySelector('.matcher-container')?.scrollIntoView({ behavior: 'smooth' });

    const response = await fetch("http://localhost:5000/api/match", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        userText: searchInput,
        type: type
      })
    });

    if (!response.ok) throw new Error("API error");

    const data = await response.json();

    // The API response is an array of { profile, similarity }
    const extractedProfiles = data.map(match => match.profile);

    setProfiles(extractedProfiles);
  } catch (error) {
    console.error("Failed to fetch profiles:", error);
  }
};


  return (
    <div className="matcher-container">
      <h1 className="title">Peer Pod Matcher</h1>

      <div className="search-section">
  <input
    type="text"
    placeholder="Enter a role or skill (e.g. React, Mentor, GenAI)"
    className="search-input"
    value={searchInput}
    onChange={(e) => setSearchInput(e.target.value)}
  />
  
  <div className="button-group">
    <div className="toggle-buttons">
      <button
        className={`toggle-button ${type === 'peer' ? 'active' : ''}`}
        onClick={() => setType('peer')}
        type="button"
      >
        Find a Peer
      </button>
      <button
        className={`toggle-button ${type === 'mentor' ? 'active' : ''}`}
        onClick={() => setType('mentor')}
        type="button"
      >
        Find a Mentor
      </button>
    </div>

    <button onClick={handleSearch} className="search-button">
      Search
    </button>
  </div>
</div>



      <div className="profile-grid">
        {profiles.length > 0 ? (
          profiles.map((profile) => (
            <div key={profile.userId} className="profile-card">
              <h2>{profile.name}</h2>
              <p className="headline">{profile.headline}</p>
              <p className="about">{profile.about}</p>

              <div className="skills">
                <p>Skills:</p>
                <div className="skill-tags">
                  {profile.skills.map((skill, i) => (
                    <span key={i} className="tag">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="edu-exp">
                <p>
                  <strong>Education:</strong>{' '}
                  {profile.education[0]?.institution || 'N/A'}
                </p>
                {profile.experience.length > 0 && (
                  <p>
                    <strong>Experience:</strong> {profile.experience[0].title} @{' '}
                    {profile.experience[0].company}
                  </p>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="no-results">
            No matching profiles found. Try a different keyword.
          </p>
        )}
      </div>
    </div>
  );
}
