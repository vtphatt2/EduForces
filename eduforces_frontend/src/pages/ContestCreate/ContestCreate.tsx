import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { QuestionProps } from "./Type";
import Button from "../../components/Button.tsx";
import Question from "./Question";
import styles from "./ContestCreate.module.css";

const baseUrl = "http://localhost:8080/api/v1";

const ContestCreate: React.FC = () => {
  const location = useLocation();
  const { id, title, timestamp, duration } = location.state || {};
  console.log("Contest Details:", { id, title, timestamp, duration });
  const generateId = useRef(10000); // Use useRef to persist the generateId value

  // State for contest details
  const [isEditContest, setIsEditContest] = useState(false);
  const [contestName, setContestName] = useState(title);
  const [startTime, setStartTime] = useState(timestamp);
  const [contestDuration, setContestDuration] = useState(duration);
  const [questionList, setQuestionList] = useState<QuestionProps[]>([]);

    const fetchQuestionsOfContestById = async (id: string) => {
      try {
        const response = await fetch(`${baseUrl}/contests/${id}`, {
          method: "GET",
          headers: {
            Authorization: localStorage.getItem("session_id") || "",
          },
        });
  
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
  
        const data = await response.json();
        const questions = data.questions;
        for (let i = 0; i < questions.length; i++) {
          let question_id = generateId.current++;
          let question_number = i + 1;
          let question_title = questions[i].description;
          let question_answerList = questions[i].answers;
          let question_correctAnswer = questions[i].correct_answer;
  
          questions[i] = {
            id: question_id,
            questionNumber: question_number,
            title: question_title,
            answerList: question_answerList,
            correctAnswer: question_correctAnswer,
          };
        }
  
        setQuestionList(questions);
        setIsEditContest(true);
      } catch (error) {
        setIsEditContest(false);
        console.error("Failed to fetch contests:", error);
      }
    };
  
    useEffect(() => {
      fetchQuestionsOfContestById(id);
    }, []);


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
      navigate("/contest-coordinator"); // Replace with the actual path to ContestCoordinator page
    }
  };

  const handleSaveClick = async () => {
    // Collect the data to be saved
    const contestData = {
      name: contestName,
      description: null,
      start_time: startTime,
      duration: Number(contestDuration.split(" ")[0]),
      difficulty: null,
      questions: questionList.map((question) => ({
        description: question.title,
        answers: question.answerList,
        correct_answer: question.correctAnswer,
        subject: "General",
      })),
    };

    console.log("Saving Contest Data:", contestData); // Debugging log

    try {
      let response;
      if (isEditContest) {
        // If the contest has an id, call the PUT API to edit the contest
        response = await fetch(`${baseUrl}/contests/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("session_id") || "",
          },
          body: JSON.stringify(contestData),
        });
      } else {
        // If the contest doesn't have an id, call the POST API to add a new contest
        response = await fetch(`${baseUrl}/contests`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("session_id") || "",
          },
          body: JSON.stringify(contestData),
        });
      }
  
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
  
      alert("Contest saved successfully!");
      navigate("/contest-coordinator");
    } catch (error) {
      console.error("Failed to save contest:", error);
      alert("Failed to save contest. Please try again.");
    }
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
              placeholder="Enter start time in this format: ex: 2025-03-15T16:30:00Z"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </div>

          <div className={styles.headerComponentWrapper}>
            <strong className={styles.headerText}>Duration </strong>
            <textarea
              className={styles.textArea}
              placeholder="Enter duration in minutes: ex: 60"
              // In Python to take the first word: 60 minutes -> 60, we do contestDuration.split(" ")[0], in typescript we can do contestDuration.split(" ")[0]
              value={contestDuration.split(" ")[0]}
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
