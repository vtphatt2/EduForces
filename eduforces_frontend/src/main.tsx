// import ReactDOM from 'react-dom/client';
// import { StrictMode } from 'react';
// import { BrowserRouter } from 'react-router-dom';
// import App from './App';
// import './index.css';

// ReactDOM.createRoot(document.getElementById('root')!).render(
//   <StrictMode>
//     <BrowserRouter>
//       <App />
//     </BrowserRouter>
//   </StrictMode>,
// );


import React from "react";
import ReactDOM from "react-dom/client";
import Home from "./pages/Home/Home";

const postList = [
  { title: "Hard inequality", content: "Let a + b = 1. Prove that...", postAuthor: "conghanh1203" },
  { title: "Why is mathematics important?", content: "Mathematics is integral...", postAuthor: "phuloi1512" },
];

const contestList = [
  { title: "THPTQG Mock Test 1", timestamp: "2024-09-20" },
  { title: "Math MCQ Mock Test 21", timestamp: "2024-09-25" },
];

const leaderboardList = [
  { ranking: 1, username: "phuloi123", elo: 3200 },
  { ranking: 2, username: "phuloi321", elo: 3120 },
];

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(
  <React.StrictMode>
    <Home postList={postList} contestList={contestList} leaderboardList={leaderboardList} />
  </React.StrictMode>
);
