import React, { useState } from "react";
import { ContestLiveProps } from "./Type";
import { QuestionProps } from "./Type";
import Button from "../../components/Button.tsx";
import Announcement from "./Announcement";
import Question from "./Question";
import Progress from "./Progress";
import styles from "./ContestLive.module.css";

const ContestLive: React.FC<ContestLiveProps> = ({
  questionList: initialQuestionList,
  announcementList,
  contestTitle,
  contestTimestamp,
}) => {
  const [questionList, setQuestionList] = useState(initialQuestionList);

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
    // Logic to navigate back (e.g., use history or router)
    console.log("Navigate back");
  };

  const handleSubmit = () => {
    // Logic for submission
    console.log("Submission handled");
  };

  return (
    <>
      <header className={styles.header}>
        <Button
          label="&#8592;" /* Left arrow for back */
          onClick={navigateBack}
          color="black"
          backgroundColor="#F2F1FA"
        />
        <div className={styles.headerContent}>
          <h1 className={styles.contestTitle}> {contestTitle}</h1>
          <p className={styles.timeLeft}> {contestTimestamp}</p>
        </div>
        <Button
          label="Submit"
          onClick={handleSubmit}
          color="black"
          backgroundColor="#00C12A"
        />
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
            {announcementList.map((announcement, index) => (
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
