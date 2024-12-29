import React from "react";
import { ProgressProps } from "./Type";
import styles from "./Progress.module.css";

const Progress: React.FC<ProgressProps> = ({ questionList }) => {
    return (
        <div className={styles.progressGrid}>
            {questionList.map((question) => (
                <div
                    key={question.questionNumber}
                    className={`${styles.progressItem} ${
                        question.isAnswered ? styles.answered : ""
                    } ${question.isFlagged ? styles.flagged : ""}`}
                >
                    {question.questionNumber}
                </div>
            ))}
        </div>
    );
};

export default Progress;
