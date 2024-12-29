import React from "react";
import { useState, useEffect } from "react";
import styles from "./StudySpace.module.css";
// import Button from "../../components/Button";
import NavBar from "../../components/NavBar";
import QuestionCard from "./QuestionCard";
import FilterItem from "./FilterItem";
import { QuestionPropsAPI } from "./Type";
import Button from "../../components/Button";

const baseUrl = "http://localhost:8080/api/v1";

const StudySpace: React.FC = () => {
  // const questionsList = [
  //   {
  //     id: "Math 1",
  //     question: "What is the value of 7 + 5?",
  //     all_answer: ["10", "12", "15", "13"],
  //     correct_answer: "12",
  //     isDone: true,
  //   },
  //   {
  //     id: "Physics 1",
  //     question: "What is the unit of electric current?",
  //     all_answer: ["Ampere", "Volt", "Ohm", "Watt"],
  //     correct_answer: "Ampere",
  //     isDone: false,
  //   },
  //   {
  //     id: "Chemistry 1",
  //     question: "What is the chemical symbol for water?",
  //     all_answer: ["H2O", "CO2", "O2", "H2"],
  //     correct_answer: "H2O",
  //     isDone: true,
  //   },
  //   {
  //     id: "Biology 1",
  //     question: "What organ is responsible for pumping blood?",
  //     all_answer: ["Heart", "Lung", "Liver", "Kidney"],
  //     correct_answer: "Heart",
  //     isDone: false,
  //   },
  //   {
  //     id: "History 1",
  //     question: "Who discovered America?",
  //     all_answer: [
  //       "Christopher Columbus",
  //       "Ferdinand Magellan",
  //       "Marco Polo",
  //       "Leif Erikson",
  //     ],
  //     correct_answer: "Christopher Columbus",
  //     isDone: true,
  //   },
  //   {
  //     id: "Geography 1",
  //     question: "What is the capital of France?",
  //     all_answer: ["Paris", "London", "Berlin", "Madrid"],
  //     correct_answer: "Paris",
  //     isDone: false,
  //   },
  //   {
  //     id: "English 1",
  //     question: "What is a synonym for 'happy'?",
  //     all_answer: ["Joyful", "Sad", "Angry", "Tired"],
  //     correct_answer: "Joyful",
  //     isDone: true,
  //   },
  //   {
  //     id: "Math 2",
  //     question: "What is the square root of 144?",
  //     all_answer: ["10", "12", "14", "16"],
  //     correct_answer: "12",
  //     isDone: false,
  //   },
  //   {
  //     id: "Physics 2",
  //     question: "What is the formula for energy?",
  //     all_answer: ["E = mc²", "E = mv²", "E = Fd", "E = pV"],
  //     correct_answer: "E = mc²",
  //     isDone: true,
  //   },
  //   {
  //     id: "Chemistry 2",
  //     question: "What is the pH level of pure water?",
  //     all_answer: ["7", "0", "14", "3"],
  //     correct_answer: "7",
  //     isDone: false,
  //   },
  //   {
  //     id: "Biology 2",
  //     question: "What is the basic unit of life?",
  //     all_answer: ["Cell", "Atom", "Molecule", "Tissue"],
  //     correct_answer: "Cell",
  //     isDone: true,
  //   },
  //   {
  //     id: "History 2",
  //     question: "In what year did the Titanic sink?",
  //     all_answer: ["1912", "1905", "1898", "1920"],
  //     correct_answer: "1912",
  //     isDone: false,
  //   },
  //   {
  //     id: "Geography 2",
  //     question: "Which is the largest continent?",
  //     all_answer: ["Asia", "Africa", "North America", "Australia"],
  //     correct_answer: "Asia",
  //     isDone: true,
  //   },
  //   {
  //     id: "English 2",
  //     question: "What is the antonym of 'difficult'?",
  //     all_answer: ["Easy", "Hard", "Complex", "Challenging"],
  //     correct_answer: "Easy",
  //     isDone: false,
  //   },
  //   {
  //     id: "Math 3",
  //     question: "What is 15% of 200?",
  //     all_answer: ["30", "25", "35", "20"],
  //     correct_answer: "30",
  //     isDone: true,
  //   },
  // ];
  const [questionsList, setQuestionsList] = useState([] as QuestionPropsAPI[]);
  const [filter, setFilter] = useState([
    true,
    true,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
  ]);

  const fetchQuestions = async (subject: string[], done: number) => {
    try {
      const response = await fetch(`${baseUrl}/questions/filter`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("session_id") || "",
        },
        body: JSON.stringify({ subjects: subject, done: done }),
      });
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      const data = await response.json();
      setQuestionsList(data);
    } catch (error) {
      alert(error);
    }
  };
  useEffect(() => {
    fetchQuestions(
      [
        "Math",
        "Physics",
        "Chemistry",
        "Biology",
        "History",
        "Geography",
        "English",
      ],
      3
    );
  }, []);

  const filterQuestions = async () => {
    const subjects = [];
    for (let i = 0; i < 7; i++) {
      const subject = document.getElementsByTagName("input")[i].checked;
      // console.log(subject);
      if (subject) {
        subjects.push(document.getElementsByTagName("label")[i].innerText);
      }
    }
    const isDone = document.getElementsByTagName("input")[7].checked;
    const isUndone = document.getElementsByTagName("input")[8].checked;
    const done = isDone && isUndone ? 3 : isDone ? 1 : isUndone ? 2 : 0;
    try {
      const response = await fetch(`${baseUrl}/questions/filter`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("session_id") || "",
        },
        body: JSON.stringify({ subjects: subjects, done: done }),
      });
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      const data = await response.json();
      setQuestionsList(data);
    } catch (error) {
      alert(error);
    }
  };

  return (
    <main className={styles.container}>
      <NavBar />
      <div className={styles.content}>
        <div className={styles.questionContainer}>
          <h1 className={styles.title}>Questions</h1>
          <section className={styles.questionCardContainer}>
            {questionsList === null || questionsList.length === 0 ? (
              <h2 style={{ color: "black" }}>No questions found</h2>
            ) : (
              questionsList.map((question) => (
                <QuestionCard
                  key={question.question_id}
                  id={question.question_tag}
                  question={question.description}
                  all_answer={question.answers}
                  correct_answer={question.correct_answer}
                  isDone={true}
                />
              ))
            )}
          </section>
        </div>
        <aside className={styles.filterContainer}>
          <h1 className={styles.title}>Filter</h1>
          <div className={styles.allFilter}>
            <h2 className={styles.filterTitle}>Subject</h2>
            <FilterItem label="Math" isChecked={filter[0]} />
            <FilterItem label="Physics" isChecked={filter[1]} />
            <FilterItem label="Chemistry" isChecked={filter[2]} />
            <FilterItem label="Biology" isChecked={filter[3]} />
            <FilterItem label="History" isChecked={filter[4]} />
            <FilterItem label="Geography" isChecked={filter[5]} />
            <FilterItem label="English" isChecked={filter[6]} />
            <h2 className={styles.filterTitle}>Status</h2>
            <FilterItem label="Done" isChecked={filter[7]} />
            <FilterItem label="Undone" isChecked={filter[8]} />
            <Button label="Apply" onClick={filterQuestions} />
          </div>
        </aside>
      </div>
    </main>
  );
};

export default StudySpace;
