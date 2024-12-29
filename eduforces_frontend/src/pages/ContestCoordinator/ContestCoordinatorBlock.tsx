import React from "react";
import { ContestCoordinatorBlockProps } from "./Type";
import Button from "../../components/Button.tsx";
import styles from "./ContestCoordinatorBlock.module.css";

const ContestCoordinatorBlock: React.FC<ContestCoordinatorBlockProps> = ({ title, timestamp, duration }) => {

  const handleEditClick = () => {
    console.log("Edit button clicked");
  };
  
  const handleDeleteClick = () => {
    console.log("Delete button clicked");
  };

  return (
    <div className={styles.container}>
      <section className={styles.leftWrapper}>
        <h3 className={styles.title}> {title}</h3>
        <p className={styles.date}>{timestamp}</p>
        <p>
          <strong className={styles.duration}>Duration:</strong>
          <span className={styles.durationSpan}> {duration}</span>
        </p>
      </section>

      <aside className={styles.sidebar}>
        <section className={styles.buttonWrapper}>
          <Button
            label="Edit"
            onClick={handleEditClick}
            color="white"
            backgroundColor="#5D5A88"
          />
          <Button
            label="Delete"
            onClick={handleDeleteClick}
            color="#882a2a"
            backgroundColor="#faf1f1"
            borderColor="red"
          />
        </section>
      </aside>
    </div>
  );
};

export default ContestCoordinatorBlock;
