import React, { useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { QuestionProps } from "./Type";
import Button from "../../components/Button.tsx";
import Question from "./Question";
import styles from "./ContestCreate.module.css";

const ContestCreate: React.FC = () => {
  const location = useLocation();
  const { id, title, timestamp, duration } = location.state || {};
  console.log("Contest Details:", { id, title, timestamp, duration });

  // State for contest details
  const [contestName, setContestName] = useState(title);
  const [startTime, setStartTime] = useState(timestamp);
  const [contestDuration, setContestDuration] = useState(duration);

  let [questionList, setQuestionList] = useState<QuestionProps[]>([
    {
      id: 10001,
      questionNumber: 1,
      title: "What is the capital of France?",
      answerList: ["Paris", "London", "Berlin", "Madrid"],
      correctAnswer: "Paris",
    },
    {
      id: 10002,
      questionNumber: 2,
      title: "What is the capital of Germany?",
      answerList: ["Paris", "London", "Berlin", "Madrid"],
      correctAnswer: "Berlin",
    },
    {
      id: 10003,
      questionNumber: 3,
      title: "What is the capital of Spain?",
      answerList: ["Paris", "London", "Berlin", "Madrid"],
      correctAnswer: "Madrid",
    },
    {
      id: 10004,
      questionNumber: 4,
      title: "What is the capital of England?",
      answerList: ["Paris", "London", "Berlin", "Madrid"],
      correctAnswer: "London",
    },
    {
      id: 10005,
      questionNumber: 5,
      title: "What is the capital of Italy?",
      answerList: ["Paris", "London", "Berlin", "Rome"],
      correctAnswer: "Rome",
    },
  ]);

  const generateId = useRef(10200); // Use useRef to persist the generateId value


  const handleCreateQuestion = () => {
    const newQuestionNumber = questionList.length + 1;
    const newQuestion: QuestionProps = {
      id: generateId.current++,
      questionNumber: newQuestionNumber,
      title: "",
      answerList: [],
      correctAnswer: "",
    };
    setQuestionList([...questionList, newQuestion]);
  };

  const handleUpdateQuestion = (
    questionNumber: number,
    updatedFields: Partial<QuestionProps>
  ) => {
    setQuestionList((prevList) =>
      prevList.map((question) =>
        question.questionNumber === questionNumber
          ? { ...question, ...updatedFields }
          : question
      )
    );
  };

  const handleDeleteQuestion = (questionNumber: number) => {
    setQuestionList((prevList) =>
      prevList.filter((question) => question.questionNumber !== questionNumber).map((question, index) => ({...question, questionNumber: index + 1}))
    );
  }

  const navigate = useNavigate();
  const navigateBack = () => {
    const userConfirmed = window.confirm(
      "You have unsaved changes. Are you sure you want to go back? Unsaved changes will be lost."
    );
    if (userConfirmed) {
      navigate("/"); // Replace with the actual path to ContestCoordinator page
    }
  };

  const handleSaveClick = () => {
    // Collect the data to be saved
    const contestData = {
      id,
      title, // Add logic to fetch the updated title from the textarea
      timestamp, // Add logic to fetch the updated timestamp from the textarea
      duration, // Add logic to fetch the updated duration from the textarea
      questionList, // Current question list
    };

    console.log("Saving Contest Data:", contestData); // Debugging log

    // Save data logic (e.g., API call or updating state)
    // Example: await saveContest(contestData);

    // Navigate back to ContestCoordinator page
    navigate("/");
  };


  return (
    <div>
      <header className={styles.header}>
        <Button
          label="&#8592;" /* Left arrow for back */
          onClick={navigateBack}
          color="black"
          backgroundColor="#F2F1FA"
          borderColor= "black"
        />
        <div className={styles.headerContent}>
          <div className={styles.headerComponentWrapper}>
            <strong className={styles.headerText}>Contest Name </strong>
            <textarea
              className={styles.textArea}
              placeholder="Enter contest name"
              value={contestName}
              onChange={(e) => setContestName(e.target.value)}
            />
          </div>

          <div className={styles.headerComponentWrapper}>
            <strong className={styles.headerText}>Start Time </strong>
            <textarea
              className={styles.textArea}
              placeholder="Enter start time in this format: YYYY-MM-DD HH:MM:SS"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </div>

          <div className={styles.headerComponentWrapper}>
            <strong className={styles.headerText}>Duration </strong>
            <textarea
              className={styles.textArea}
              placeholder="Enter duration in minutes: ex: 60"
              value={contestDuration}
              onChange={(e) => setContestDuration(e.target.value)}
            />
          </div>
        </div>
        <Button label="Save" onClick={handleSaveClick} />
      </header>

      <div className={styles.questionContainer}>
        {questionList.map((question) => (
          <Question
            key={question.id}
            id = {question.id}
            questionNumber = {question.questionNumber}
            title = {question.title}
            answerList = {question.answerList}
            correctAnswer = {question.correctAnswer}
            onUpdate={(updatedFields) =>
              handleUpdateQuestion(question.questionNumber, updatedFields)
            }
            onDelete={() => handleDeleteQuestion(question.questionNumber)}
          />
        ))}
      </div>

      <Button
        label="Add New Question"
        onClick={handleCreateQuestion}
        color="white"
        backgroundColor="#5D5A88"
      />
    </div>
  );
};

export default ContestCreate;
