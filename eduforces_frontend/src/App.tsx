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
import ContestCoordinator from "./pages/ContestCoordinator/ContestCoordinator";
import ContestCreate from "./pages/ContestCreate/ContestCreate";

const postList = [
  {
    title: "Hard inequality",
    content: "Let a + b = 1. Prove that 1 - a = doancongthanh",
    postAuthor: "congthanh1203",
  },
  {
    title: "Why is mathematics important?",
    content:
      "Mathematics is integral to real life because it provides tools and frameworks for solving problems, making decisions, and understanding the world around us. Here are key reasons why mathematics is essential in everyday life:",
    postAuthor: "vothinhphat",
  },
  {
    title: "Projectile Motion",
    content:
      "A ball is thrown with an initial velocity of 20 m/s at an angle of 30∘ to the horizontal. Calculate:",
    postAuthor: "congthanh1203",
  },
  {
    title: "Free Fall",
    content:
      "A stone is dropped from the top of a 45-meter-high building. Calculate:",
    postAuthor: "hoangky1802",
  },
  {
    title: "Atomic Structure",
    content:
      "The atomic structure is the arrangement of the atom's subatomic particles. There are three subatomic particles in an atom: protons, neutrons, and electrons. The protons and neutrons are located in the nucleus at the center of the atom, while the electrons orbit around the nucleus.",
    postAuthor: "phuloi1512",
  },
  {
    title: "Newton's Laws of Motion",
    content:
      "Newton's laws of motion are three physical laws that form the foundation for classical mechanics. They describe the relationship between a body and the forces acting on it, and its motion in response to those forces.",
    postAuthor: "hoangky1802",
  },
];

const contestList = [
  { title: "THPTQG Mock Test 1", timestamp: "21:00 2024-09-20", duration: "180 minutes" },
  { title: "Math MCQ Mock Test 21", timestamp: "18:00 2024-09-25", duration: "120 minutes" },
  { title: "Physics MCQ Mock Test 3", timestamp: "17:00 2024-09-30", duration: "90 minutes" },
  { title: "Chemistry MCQ Mock Test 5", timestamp: "19:00 2024-10-05", duration: "120 minutes" },
];

const leaderboardList = [
  { username: "phuloi123", elo: 3200 },
  { username: "phuloi321", elo: 3120 },
  { username: "phuloi135", elo: 1800 },
  { username: "phuloi531", elo: 1500 },
  { username: "phuloi246", elo: 1200 },
  { username: "phuloi456", elo: 3000 },
  { username: "phuloi654", elo: 2500 },
  { username: "phuloi789", elo: 2400 },
  { username: "phuloi987", elo: 2000 },
  { username: "phuloi642", elo: 1000 },
  { username: "congthanh123", elo: 2200 },
  { username: "thinhphat321", elo: 2220 },
  { username: "minhkhoa135", elo: 3800 },
  { username: "hoangky531", elo: 3110 },
  { username: "phuloi226", elo: 3201 },
  { username: "phuloi456", elo: 3205 },
  { username: "phuloi654", elo: 2500 },
  { username: "hoangky789", elo: 2420 },
  { username: "congthanh987", elo: 2999 },
  { username: "thinhphat642", elo: 2422 },
];

const questionList = [
  {
    questionNumber: 1,
    title: "What is the capital of France?",
    answerList: ["Paris", "London", "Berlin", "Madrid"],
    correctAnswer: "Paris",
  },
  {
    questionNumber: 2,
    title: "What is the capital of Germany?",
    answerList: ["Paris", "London", "Berlin", "Madrid"],
    correctAnswer: "Berlin",
  },
  {
    questionNumber: 3,
    title: "What is the capital of Spain?",
    answerList: ["Paris", "London", "Berlin", "Madrid"],
    correctAnswer: "Madrid",
  },
  {
    questionNumber: 4,
    title: "What is the capital of England?",
    answerList: ["Paris", "London", "Berlin", "Madrid"],
    correctAnswer: "London",
  },
  {
    questionNumber: 5,
    title: "What is the capital of Italy?",
    answerList: ["Paris", "London", "Berlin", "Madrid"],
    correctAnswer: "Rome",
  },
];

// let processedContestList = contestList;
// for (let i = 0; i < contestList.length; i++) {
//   processedContestList[i].title = "> " + processedContestList[i].title;
// }
let processedLeaderboardList = leaderboardList.sort((a, b) => b.elo - a.elo);

const App: React.FC = () => {
  return (
    <AuthProvider>
      <div>
        <NavBar />
        <div className="content" style={{ marginTop: "80px" }}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/home" element={<Home postList={[]} contestList={[]} leaderboardList={[]} />} />
            <Route path="/" element={<ContestCreate questionList={questionList} />} />
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
