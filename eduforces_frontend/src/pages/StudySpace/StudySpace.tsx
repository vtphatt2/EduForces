import React from "react";
import styles from "./StudySpace.module.css";
// import Button from "../../components/Button";
import NavBar from "../../components/NavBar";
import QuestionCard from "./QuestionCard";

const StudySpace: React.FC = () => {
  const questionsList = [
    {
      id: "Math 1",
      question: "What is the value of 7 + 5?",
      all_answer: ["10", "12", "15", "13"],
      correct_answer: "12",
      isDone: true, // Giá trị ngẫu nhiên
    },
    {
      id: "Physics 1",
      question: "What is the unit of electric current?",
      all_answer: ["Ampere", "Volt", "Ohm", "Watt"],
      correct_answer: "Ampere",
      isDone: false, // Giá trị ngẫu nhiên
    },
    {
      id: "Chemistry 1",
      question: "What is the chemical symbol for water?",
      all_answer: ["H2O", "CO2", "O2", "H2"],
      correct_answer: "H2O",
      isDone: true, // Giá trị ngẫu nhiên
    },
    {
      id: "Biology 1",
      question: "What organ is responsible for pumping blood?",
      all_answer: ["Heart", "Lung", "Liver", "Kidney"],
      correct_answer: "Heart",
      isDone: false, // Giá trị ngẫu nhiên
    },
    {
      id: "History 1",
      question: "Who discovered America?",
      all_answer: [
        "Christopher Columbus",
        "Ferdinand Magellan",
        "Marco Polo",
        "Leif Erikson",
      ],
      correct_answer: "Christopher Columbus",
      isDone: true, // Giá trị ngẫu nhiên
    },
    {
      id: "Geography 1",
      question: "What is the capital of France?",
      all_answer: ["Paris", "London", "Berlin", "Madrid"],
      correct_answer: "Paris",
      isDone: false, // Giá trị ngẫu nhiên
    },
    {
      id: "English 1",
      question: "What is a synonym for 'happy'?",
      all_answer: ["Joyful", "Sad", "Angry", "Tired"],
      correct_answer: "Joyful",
      isDone: true, // Giá trị ngẫu nhiên
    },
    {
      id: "Math 2",
      question: "What is the square root of 144?",
      all_answer: ["10", "12", "14", "16"],
      correct_answer: "12",
      isDone: false, // Giá trị ngẫu nhiên
    },
    {
      id: "Physics 2",
      question: "What is the formula for energy?",
      all_answer: ["E = mc²", "E = mv²", "E = Fd", "E = pV"],
      correct_answer: "E = mc²",
      isDone: true, // Giá trị ngẫu nhiên
    },
    {
      id: "Chemistry 2",
      question: "What is the pH level of pure water?",
      all_answer: ["7", "0", "14", "3"],
      correct_answer: "7",
      isDone: false, // Giá trị ngẫu nhiên
    },
    {
      id: "Biology 2",
      question: "What is the basic unit of life?",
      all_answer: ["Cell", "Atom", "Molecule", "Tissue"],
      correct_answer: "Cell",
      isDone: true, // Giá trị ngẫu nhiên
    },
    {
      id: "History 2",
      question: "In what year did the Titanic sink?",
      all_answer: ["1912", "1905", "1898", "1920"],
      correct_answer: "1912",
      isDone: false, // Giá trị ngẫu nhiên
    },
    {
      id: "Geography 2",
      question: "Which is the largest continent?",
      all_answer: ["Asia", "Africa", "North America", "Australia"],
      correct_answer: "Asia",
      isDone: true, // Giá trị ngẫu nhiên
    },
    {
      id: "English 2",
      question: "What is the antonym of 'difficult'?",
      all_answer: ["Easy", "Hard", "Complex", "Challenging"],
      correct_answer: "Easy",
      isDone: false, // Giá trị ngẫu nhiên
    },
    {
      id: "Math 3",
      question: "What is 15% of 200?",
      all_answer: ["30", "25", "35", "20"],
      correct_answer: "30",
      isDone: true, // Giá trị ngẫu nhiên
    },
  ];
  return (
    <main className={styles.container}>
      <NavBar />
      <div className={styles.content}>
        <div className={styles.questionContainer}>
          <h1 className={styles.title}>Questions</h1>
          <section className={styles.questionCardContainer}>
            {questionsList.map((question) => (
              <QuestionCard key={question.id} {...question} />
            ))}
          </section>
        </div>
        <aside className={styles.filterContainer}>
          <h1>Filter</h1>
        </aside>
      </div>
    </main>
  );
};

export default StudySpace;
