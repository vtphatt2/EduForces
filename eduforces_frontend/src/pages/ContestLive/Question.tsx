import React, { useState } from "react";
import { QuestionProps } from "./Type";
import styles from "./Question.module.css";

const Question: React.FC<
  QuestionProps & {
    onAnswerSelect: (answer: string) => void;
    onFlagToggle: () => void;
  }
> = ({
  questionNumber,
  title,
  answerList,
  userAnswer,
  // isAnswered,
  isFlagged,
  onAnswerSelect,
  onFlagToggle,
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | undefined>(
    userAnswer
  );

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
    onAnswerSelect(answer); // Notify parent of answer selection
  };

  return (
    <div className={styles.questionContainer}>
      {/* Question Section */}
      <section className={styles.questionHeader}>
        <span className={styles.questionNumber}>Q{questionNumber}</span>
        <div className={styles.questionTitleContainer}>
          <p className={styles.questionTitle}>{title}</p>
        </div>
        <button
          className={styles.flagButton}
          onClick={onFlagToggle} // Notify parent of flag toggle
        >
          <img
            src={
              isFlagged
                ? "RaisedFlag.png"
                : "Flag.png"
            }
            alt=""
            className={styles.flagIcon}
          />
        </button>
      </section>

      {/* Answer List */}
      <div className={styles.answerList}>
        {answerList.map((answer, index) => (
          <label key={index} className={styles.answerOption}>
            <input
              type="radio"
              name={`question-${questionNumber}`}
              value={answer}
              checked={selectedAnswer === answer}
              onChange={() => handleAnswerSelect(answer)}
              className={styles.radioInput}
            />
            {answer}
          </label>
        ))}
      </div>
    </div>
  );
};

export default Question;
