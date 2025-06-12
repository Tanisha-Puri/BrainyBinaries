// App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PeerPodMatcher from './Pages/PeerPodMatcher';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/matcher" element={<PeerPodMatcher />} />
        {/* You can add more routes here */}
        <Route path="/" element={<h1>Welcome to the Homepage</h1>} />
      </Routes>
    </Router>
  );
}

export default App;
