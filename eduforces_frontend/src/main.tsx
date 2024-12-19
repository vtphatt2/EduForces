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

////////////////////////////////////////////////////////////////////////////////////////////////////
// Test Home Screen
/*
import React from "react";
import ReactDOM from "react-dom/client";
import Home from "./pages/Home/Home";

const postList = [
  { title: "Hard inequality", content: "Let a + b = 1. Prove that 1 - a = doancongthanh", postAuthor: "congthanh1203" },
  { title: "Why is mathematics important?", content: "Mathematics is integral to real life because it provides tools and frameworks for solving problems, making decisions, and understanding the world around us. Here are key reasons why mathematics is essential in everyday life:", postAuthor: "chacchanladeoainoithe" },
  { title: "Projectile Motion", content: "A ball is thrown with an initial velocity of 20 m/s at an angle of 30∘ to the horizontal. Calculate:", postAuthor: "congthanh1203" },
  { title: "Free Fall", content: "A stone is dropped from the top of a 45-meter-high building. Calculate:", postAuthor: "hoangky1802" },
  { title: "Atomic Structure", content: "The atomic structure is the arrangement of the atom's subatomic particles. There are three subatomic particles in an atom: protons, neutrons, and electrons. The protons and neutrons are located in the nucleus at the center of the atom, while the electrons orbit around the nucleus.", postAuthor: "phuloi1512" },
  { title: "Newton's Laws of Motion", content: "Newton's laws of motion are three physical laws that form the foundation for classical mechanics. They describe the relationship between a body and the forces acting on it, and its motion in response to those forces.", postAuthor: "hoangky1802" },
];

const contestList = [
  { title: "THPTQG Mock Test 1", timestamp: "21:00 2024-09-20" },
  { title: "Math MCQ Mock Test 21", timestamp: "18:00 2024-09-25" },
  { title: "Physics MCQ Mock Test 3", timestamp: "17:00 2024-09-30" },
  { title: "Chemistry MCQ Mock Test 5", timestamp: "19:00 2024-10-05" },
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

let processedContestList = contestList
for (let i = 0; i < contestList.length; i++) {
  processedContestList[i].title = '> ' + processedContestList[i].title;
}
let processedLeaderboardList = leaderboardList.sort((a, b) => b.elo - a.elo);

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(
  <React.StrictMode>
    <Home postList={postList} contestList={processedContestList} leaderboardList={processedLeaderboardList.slice(0, 10)} />
  </React.StrictMode>
);
*/

////////////////////////////////////////////////////////////////////////////////////////////////////
// Test LiveContest Screen

import React from "react";
import ReactDOM from "react-dom/client";
import ContestLive from "./pages/ContestLive/ContestLive";

const questionList = [
  {
    questionNumber: 1,
    title: "What is the capital of Vietnam? Is it?",
    answerList: ["Hanoi", "Ho Chi Minh City", "Da Nang", "Hai Phong"],
  },

  {
    questionNumber: 2,
    title: "What is the capital of France?",
    answerList: ["Berlin", "Madrid", "Paris", "Rome"],
    userAnswer: "",
  },

  {
    questionNumber: 3,
    title: "What is the capital of Japan?",
    answerList: ["Beijing", "Seoul", "Tokyo", "Bangkok"],
    userAnswer: "",
  },

  {
    questionNumber: 4,
    title: "What is the capital of South Korea?",
    answerList: ["Seoul", "Pyongyang", "Tokyo", "Beijing"],
  },

  {
    questionNumber: 5,
    title: "What is the capital of Thailand?",
    answerList: ["Bangkok", "Hanoi", "Manila", "Jakarta"],
  },

  {
    questionNumber: 6,
    title: "What is the capital of Indonesia?",
    answerList: ["Jakarta", "Bangkok", "Manila", "Hanoi"],
  },

  {
    questionNumber: 7,
    title: "What is the capital of the Philippines?",
    answerList: ["Manila", "Jakarta", "Bangkok", "Hanoi"],
  },

  {
    questionNumber: 8,
    title: "What is the capital of Malaysia?",
    answerList: ["Kuala Lumpur", "Singapore", "Bangkok", "Manila"],
  },

  {
    questionNumber: 9,
    title: "What is the capital of Singapore?",
    answerList: ["Singapore", "Kuala Lumpur", "Bangkok", "Manila"],
  },

  {
    questionNumber: 10,
    title: "Who was the first president of the United States?",
    answerList: ["George Washington", "Thomas Jefferson", "Abraham Lincoln", "John Adams"],
  },

  {
    questionNumber: 11,
    title: "Who wrote the play 'Romeo and Juliet'?",
    answerList: ["William Shakespeare", "Charles Dickens", "Jane Austen", "Mark Twain"],
  },

  {
    questionNumber: 12,
    title: "Who painted the Mona Lisa?",
    answerList: ["Leonardo da Vinci", "Michelangelo", "Vincent van Gogh", "Pablo Picasso"],
  },

  {
    questionNumber: 13,
    title: "Who wrote the novel 'Pride and Prejudice'?",
    answerList: ["Jane Austen", "Charles Dickens", "William Shakespeare", "Mark Twain"],
  },

  {
    questionNumber: 14,
    title: "Who composed the symphony 'Symphony No. 9'?",
    answerList: ["Ludwig van Beethoven", "Wolfgang Amadeus Mozart", "Johann Sebastian Bach", "Franz Schubert"],
  },

  {
    questionNumber: 15,
    title: "Who invented the light bulb?",
    answerList: ["Thomas Edison", "Nikola Tesla", "Alexander Graham Bell", "Albert Einstein"],
  },

  {
    questionNumber: 16,
    title: "Who discovered penicillin?",
    answerList: ["Alexander Fleming", "Louis Pasteur", "Marie Curie", "Robert Koch"],
  },
  
  {
    questionNumber: 17,
    title: "Who founded Microsoft?",
    answerList: ["Bill Gates", "Steve Jobs", "Jeff Bezos", "Mark Zuckerberg"],
  },

  {
    questionNumber: 18,
    title: "Who founded Apple Inc.?",
    answerList: ["Steve Jobs", "Bill Gates", "Jeff Bezos", "Mark Zuckerberg"],
  },

  {
    questionNumber: 19,
    title: "Who founded Amazon?",
    answerList: ["Jeff Bezos", "Bill Gates", "Steve Jobs", "Mark Zuckerberg"],
  },

  {
    questionNumber: 20,
    title: "Who founded Facebook?",
    answerList: ["Mark Zuckerberg", "Bill Gates", "Steve Jobs", "Jeff Bezos"],
  },
 
  {
    questionNumber: 21,
    title: "Who founded Google?",
    answerList: ["Larry Page", "Sergey Brin", "Jeff Bezos", "Mark Zuckerberg"],
  },

  {
    questionNumber: 22,
    title: "Who founded Tesla?",
    answerList: ["Elon Musk", "Bill Gates", "Steve Jobs", "Jeff Bezos"],
  },

  {
    questionNumber: 23,
    title: "Who founded SpaceX?",
    answerList: ["Elon Musk", "Bill Gates", "Steve Jobs", "Jeff Bezos"],
  },

  {
    questionNumber: 24,
    title: "Who founded Twitter?",
    answerList: ["Jack Dorsey", "Bill Gates", "Steve Jobs", "Jeff Bezos"],
  },

  {
    questionNumber: 25,
    title: "Who founded LinkedIn?",
    answerList: ["Reid Hoffman", "Bill Gates", "Steve Jobs", "Jeff Bezos"],
  },

  {
    questionNumber: 26,
    title: "Who founded WhatsApp?",
    answerList: ["Jan Koum", "Bill Gates", "Steve Jobs", "Jeff Bezos"],
  },

  {
    questionNumber: 27,
    title: "Who founded Instagram?",
    answerList: ["Kevin Systrom", "Bill Gates", "Steve Jobs", "Jeff Bezos"],
  },

]

const announcementList = [
  { title: "Announcement 1", content: "After a thorough review of the exam questions, we would like to inform you that there was an error in Question 12 of the English Language multiple-choice section. The question has been corrected as follows:\nOriginal Question: “If I was you, I would choose that option.”\nCorrected Question: “If I were you, I would choose that option.”" },
  { title: "Announcement 2", content: "Please be informed that the exam duration has been extended by an additional 30 minutes. You now have 3 hours and 30 minutes to complete the exam. The exam will end at 12:30 PM." },
]

const contestTitle = "THPTQG Mock Test 1";
const contestTimestamp = "Time left - 01:23:45";

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(
  <React.StrictMode>
    <ContestLive questionList={questionList} announcementList={announcementList} contestTitle={contestTitle} contestTimestamp={contestTimestamp} />
  </React.StrictMode>
);