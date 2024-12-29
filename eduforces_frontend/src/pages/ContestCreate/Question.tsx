import React, { useState, useEffect } from "react";
import { QuestionProps } from "./Type";
import Button from "../../components/Button.tsx";
import styles from "./Question.module.css";

const Question: React.FC<
  QuestionProps & {
    onUpdate: (updatedFields: Partial<QuestionProps>) => void;
    onDelete: () => void;
  }
> = ({
  questionNumber,
  title,
  answerList,
  correctAnswer,
  onUpdate,
  onDelete,
}) => {
  // Ensure exactly 4 answers
  const initializeAnswers = (list: string[]) => {
    const defaultAnswers = ["", "", "", ""];
    return list.length === 4 ? list : defaultAnswers.map((_, i) => list[i] || "");
  };

  const [questionTitle, setQuestionTitle] = useState(title);
  const [answers, setAnswers] = useState(initializeAnswers(answerList));
  const [correct, setCorrect] = useState(correctAnswer);

  useEffect(() => {
    // Update answers if the provided `answerList` changes
    setAnswers(initializeAnswers(answerList));
  }, [answerList]);

  const handleDeleteClick = () => {
    if (window.confirm(`Are you sure you want to delete Question ${questionNumber}?`)) {
      console.log("Deleting Question:", questionNumber); // Debugging log
      onDelete();
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuestionTitle(e.target.value);
    onUpdate({ title: e.target.value });
  };

  const handleAnswerChange = (index: number, value: string) => {
    const updatedAnswers = [...answers];
    updatedAnswers[index] = value;
    setAnswers(updatedAnswers);
    onUpdate({ answerList: updatedAnswers });
  };

  const handleCorrectAnswerChange = (value: string) => {
    setCorrect(value);
    onUpdate({ correctAnswer: value });
  };

  return (
    <div className={styles.questionContainer}>
      <section className={styles.questionHeader}>
        <span className={styles.questionNumber}>Q{questionNumber}</span>
          <input
            type="text"
            placeholder="Enter question title"
            value={questionTitle}
            onChange={handleTitleChange}
            className={styles.textArea}
          />
        <span className={styles.deleteButton}>
          <Button
            label="Delete"
            onClick={handleDeleteClick}
            color="#882a2a"
            backgroundColor="#faf1f1"
            borderColor="red"
          />
        </span>
      </section>

      <div>
        {answers.map((answer, index) => (
          <div key={index} className={styles.answerOption}>
            <input
              type="radio"
              name={`correct-${questionNumber}`}
              value={answer}
              checked={correct === answer}
              onChange={() => handleCorrectAnswerChange(answer)}
              className={styles.radioInput}
            />
            <input
              type="text"
              placeholder={`Answer ${index + 1}`}
              value={answer}
              onChange={(e) => handleAnswerChange(index, e.target.value)}
              className={styles.answerList}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Question;
