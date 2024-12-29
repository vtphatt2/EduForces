import React, { useState, useRef } from "react";
import { ContestCreateProps } from "./Type";
import { QuestionProps } from "./Type";
import Button from "../../components/Button.tsx";
import Question from "./Question";
import styles from "./ContestCreate.module.css";

const ContestCreate: React.FC<ContestCreateProps> = () => {
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

  const navigateBack = () => {
    // Logic to navigate back (e.g., use history or router)
    console.log("Navigate back");
  };

  const handleCreateContest = () => {
    console.log("Contest created with questions:", questionList);
  };


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
    console.log("ID", generateId);
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
            />
          </div>

          <div className={styles.headerComponentWrapper}>
            <strong className={styles.headerText}>Start Time </strong>
            <textarea
              className={styles.textArea}
              placeholder="Enter start time in this format: YYYY-MM-DD HH:MM:SS"
            />
          </div>

          <div className={styles.headerComponentWrapper}>
            <strong className={styles.headerText}>Duration </strong>
            <textarea
              className={styles.textArea}
              placeholder="Enter duration in minutes: ex: 60"
            />
          </div>
        </div>
        <Button label="Create" onClick={handleCreateContest} />
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
