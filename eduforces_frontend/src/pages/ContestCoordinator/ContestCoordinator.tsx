import React from "react";
import { ContestCoordinatorProps } from "./Type";
import ContestCoordinatorBlock from "./ContestCoordinatorBlock";
import Button from "../../components/Button.tsx";
import styles from  "./ContestCoordinator.module.css";

const ContestCoordinator: React.FC<ContestCoordinatorProps> = ({
  contestList,
}) => {
  
  const handleCreateContestClick = () => {
    console.log("Create contest button clicked");
  };

  return (
    <div className={styles.container}>
      <section>
        <div className={styles.headerWrapper}>
          <h2 className={styles.createdContestsText}>Contests</h2>
          <div className={styles.buttonWrapper}>
            <Button
              label="Create New Contest"
              onClick={handleCreateContestClick}
              color="white"
              backgroundColor="#5D5A88"
            />
          </div>  
        </div>
        {contestList.map((contest, index) => (
          <ContestCoordinatorBlock
            key={index}
            title={contest.title}
            timestamp={contest.timestamp}
            duration={contest.duration}
          />
        ))}
      </section>
    </div>
  );
};

export default ContestCoordinator;
