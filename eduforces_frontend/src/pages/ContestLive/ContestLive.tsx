import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { QuestionProps } from "./Type";
import Button from "../../components/Button.tsx";
import Announcement from "./Announcement";
import Question from "./Question";
import Progress from "./Progress";
import styles from "./ContestLive.module.css";

const baseUrl = "http://localhost:8080/api/v1";

const ContestLive: React.FC = () =>{
  const location = useLocation();
  const navigate = useNavigate();

  const { contestId, contestTitle, contestTimestamp, contestDuration, announcementList } = location.state || {};
  console.log("Contest Details:", { contestId, contestTitle, contestTimestamp, contestDuration, announcementList });

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
          let question_number = i + 1;
          let question_title = questions[i].description;
          let question_answerList = questions[i].answers;
          let question_correctAnswer = questions[i].correct_answer;
  
          questions[i] = {
            questionNumber: question_number,
            title: question_title,
            answerList: question_answerList,
            correctAnswer: question_correctAnswer,
          };
        }
  
        setQuestionList(questions);
      } catch (error) {
        console.error("Failed to fetch contests:", error);
      }
    };
  
    useEffect(() => {
      if (contestId){ 
        fetchQuestionsOfContestById(contestId);
      }
    }, [contestId]);


  const updateQuestionState = (
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

  const navigateBack = () => {
    const userConfirmed = window.confirm(
      "You have unsaved changes. Are you sure you want to go back? The progress will be lost."
    );
    if (userConfirmed) {
      navigate("/contest"); // Replace with the actual path to Contest page
    }
  };

  const handleSubmit = async () => {
    const contestData = {
      contest_id: contestId,
      answer: 
        questionList.map((question) => ({
          answer: question.userAnswer,
          correct_answer: question.correctAnswer
        })),
    };

    try {
      let response;
      {
        response = await fetch(`${baseUrl}/contests/submit/${contestId}`, {
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

      const data = await response.json();
      const score = data.score;
      alert("Submitted successfully!\nYour score is: " + score);

      navigate("/contest");
    } catch (error) {
      console.error("Failed to save contest:", error);
      alert("Failed to save contest. Please try again.");
    }
  };

  return (
    <>
      <header className={styles.header}>
        <div className={styles.buttonWrapper}>
          <Button
            label="&#8592;" /* Left arrow for back */
            onClick={navigateBack}
            color="black"
            backgroundColor="#F2F1FA"
          />
        </div>
        <div className={styles.headerContent}>
          <h1 className={styles.contestTitle}> {contestTitle}</h1>
          <p className={styles.timeLeft}> {contestTimestamp}</p>
        </div>
        <div className={styles.buttonWrapper}>
          <Button
            label="Submit"
            onClick={handleSubmit}
            color="black"
            backgroundColor="#00C12A"
          />
        </div>
      </header>

      <div className={styles.contestLiveContainer}>
        {/* Left Section: Questions */}
        <section className={styles.questions}>
          {questionList.map((question) => (
            <Question
              key={question.questionNumber}
              {...question}
              onAnswerSelect={(answer) =>
                updateQuestionState(question.questionNumber, {
                  userAnswer: answer,
                  isAnswered: true,
                })
              }
              onFlagToggle={() =>
                updateQuestionState(question.questionNumber, {
                  isFlagged: !question.isFlagged,
                })
              }
            />
          ))}
        </section>

        {/* Right Sidebar */}
        <aside className={styles.sidebar}>
          {/* Progress Section */}
          <section className={styles.progressSection}>
            <div>
              <h3 className={styles.progress}>Progress</h3>
              <Progress questionList={questionList} />
            </div>
          </section>

          <hr className={styles.divider} />

          {/* Announcement Section */}
          <section className={styles.announcementSection}>
            <h3 className={styles.announcement}>Announcement</h3>
            <p className={styles.announcementText}>
              {" "}
              During the exam, any announcements from the organizers will be
              displayed here.*
            </p>
            {announcementList.map((announcement: { title: string; content: string }, index: number) => (
              <Announcement
                key={index}
                title={announcement.title}
                content={announcement.content}
              />
            ))}
          </section>
        </aside>
      </div>
    </>
  );
};

export default ContestLive;
