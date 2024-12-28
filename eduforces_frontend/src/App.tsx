import React from "react";
import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import { AuthProvider } from "./context/AuthContext";

import LoginPage from "./pages/LoginPage/LoginPage";
import Home from "./pages/Home/Home";
import ForumPost from "./pages/ForumPost/ForumPost";
import Forum from "./pages/Forum/Forum";
import Contest from "./pages/Contest/Contest";
import StudySpace from "./pages/StudySpace/StudySpace";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <div>
        <NavBar />
        <div className="content" style={{ marginTop: "80px" }}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<Home />} />
            <Route path="/forum" element={<Forum />} />
            <Route path="/post" element={<ForumPost />} />
            <Route path="/contest" element={<Contest />} />
            <Route path="/study-space" element={<StudySpace />} />
          </Routes>
        </div>
      </div>
    </AuthProvider>
  );
};

export default App;
