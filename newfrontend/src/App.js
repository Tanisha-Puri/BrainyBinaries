import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RoadmapForm from './pages/RoadmapForm';
import RoadmapDisplay from './pages/RoadmapDisplay';
import StartRoadmap from './pages/StartRoadmap';
import AppLayout from './components/AppLayout';
import EditTask from './pages/EditTask';




function App() {
  return (
    <Router>
      <AppLayout>
        <Routes>

          
          <Route path="/" element={<StartRoadmap />} />
          
        </Routes>
      </AppLayout>
    </Router>
  );
}

export default App;
