import React from 'react';
import { Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';

import LoginPage from './pages/LoginPage/LoginPage';
import Home from './pages/Home/Home';
import Forum from './pages/Forum/Forum';
import Contest from './pages/Contest/Contest';
import StudySpace from './pages/StudySpace/StudySpace';


const App: React.FC = () => {
  return (
    <div>
      <NavBar />
      <div className="content">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<Home />} />
          <Route path="/forum" element={<Forum />} />
          <Route path="/contest" element={<Contest />} />
          <Route path="/study-space" element={<StudySpace />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
