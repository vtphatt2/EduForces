import React from "react";
import { useNavigate } from "react-router-dom";
import { ContestCoordinatorBlockProps } from "./Type";
import Button from "../../components/Button.tsx";
import styles from "./ContestCoordinatorBlock.module.css";

const ContestCoordinatorBlock: React.FC<
  ContestCoordinatorBlockProps & {
    onDelete: () => void;
  }
  > = ({
    id,
    title,
    timestamp,
    duration,
    onDelete
}) => {
  const navigate = useNavigate();

  const handleEditClick = () => {
    // Add logic to navigate to the page: ContestCreate
    // Pass the contest details to the ContestCreate page
    navigate("/contest-create", { 
      state: {
        id,
        title,
        timestamp,
        duration,
      },
    });
  };
  
  const handleDeleteClick = () => {
      if (window.confirm(`Are you sure you want to delete contest ${title}?`)) {
        console.log("Deleting Contest:", title); // Debugging log
        onDelete();
      }
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
