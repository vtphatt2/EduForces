import React, { useState } from "react";
import styles from "./StudySpace.module.css";
// import Button from "../../components/Button";
import { QuestionProps } from "./Type";
import Button from "../../components/Button";

const QuestionCard: React.FC<QuestionProps> = ({
  id,
  question,
  all_answer,
  correct_answer,
  isDone,
}) => {
  const [selectedOption, setSelectedOption] = useState("");
  const [isFold, setIsFold] = useState(true);
  const options = [
    { label: all_answer[0], value: "A" },
    { label: all_answer[1], value: "B" },
    { label: all_answer[2], value: "C" },
    { label: all_answer[3], value: "D" },
  ];
  return (
    <div className={styles.questionCard}>
      <h2 className={styles.questionId}>{id}</h2>
      <p className={styles.question} id={isFold ? styles.hide : undefined}>
        {question}
      </p>
      <section
        className={styles.allOptions}
        id={isFold ? styles.hide : undefined}
      >
        {options.map((option) => (
          <label key={option.value} className={styles.option}>
            <input
              type="radio"
              value={option.value}
              checked={selectedOption === option.value}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setSelectedOption(e.target.value)
              }
            />
            {option.label}
          </label>
        ))}
      </section>
      <img
        src={isFold ? "left.svg" : "down_arrow.svg"}
        alt="fold"
        className={styles.foldIcon}
        onClick={() => setIsFold(!isFold)}
      />
      <img
        src={isDone ? "check.svg" : "uncheck.svg"}
        alt="done"
        className={styles.doneIcon}
      />
      <Button
        label={"Submit"}
        style={{ alignSelf: "end", display: "flex" }}
        onClick={() => console.log("Submit")}
        id={isFold ? styles.hide : undefined}
      />
    </div>
  );
};

export default QuestionCard;
