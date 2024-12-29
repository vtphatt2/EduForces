import React from "react";
import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import { AuthProvider } from "./context/AuthContext";

import LoginPage from "./pages/LoginPage/LoginPage";
import Home from "./pages/Home/Home";
import ForumPost from "./pages/ForumPost/ForumPost";
import Forum from "./pages/Forum/Forum";
import Contest from "./pages/Contest/Contest";
import ContestPage from "./pages/Contest/ContestPage";
import StudySpace from "./pages/StudySpace/StudySpace";
import UserProfile from "./pages/UserProfile/UserProfile";
import OtherUserProfile from "./pages/UserProfile/OtherUserProfile";
import ContestCoordinator from "./pages/ContestCoordinator/ContestCoordinator";
import ContestCreate from "./pages/ContestCreate/ContestCreate";

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
            <Route path="/contest" element={<ContestPage />} />
            <Route path="/study-space" element={<StudySpace />} />
            <Route path="/contest-create" element={<ContestCreate />} />
            <Route path="/contest-coordinator" element={<ContestCoordinator />} />
            <Route path="/user" element={<UserProfile />} />
            <Route path="/profile" element={<OtherUserProfile />} />
          </Routes>
        </div>
      </div>
    </AuthProvider>
  );
};

export default App;
