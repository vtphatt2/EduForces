import React, { useState, useRef } from "react";
import ContestCoordinatorBlock from "./ContestCoordinatorBlock";
import { ContestCoordinatorBlockProps } from "./Type";
import Button from "../../components/Button.tsx";
import styles from "./ContestCoordinator.module.css";

const ContestCoordinator: React.FC = () => {
  const [contests, setContests] = useState<ContestCoordinatorBlockProps[]>([
    { id: 1, title: "Contest 1", timestamp: "2023-01-01", duration: "120 minutes" },
    { id: 2, title: "Contest 2", timestamp: "2023-02-01", duration: "180 minutes" },
    { id: 3, title: "Contest 3", timestamp: "2023-03-01", duration: "90 minutes" },
    { id: 4, title: "Contest 4", timestamp: "2023-04-01", duration: "150 minutes" },
    // Add more contests as needed
  ]);

  const generateId = useRef(5); // Use useRef to persist the generateId value

  const handleDeleteContest = (id: number) => {
    setContests((prevContests) => prevContests.filter((contest) => contest.id !== id));
  };
  
  const handleCreateContestClick = () => {
    const newContest: ContestCoordinatorBlockProps = {
      id: generateId.current,
      title: 'Not yet set',
      timestamp: 'Not yet set',
      duration: 'Not yet set',
    };
    generateId.current += 1;
    setContests((prevContests) => [...prevContests, newContest]);
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
        {contests.map((contest) => (
          <ContestCoordinatorBlock
            key={contest.id}
            {...contest}
            onDelete={() => handleDeleteContest(contest.id)}
          />
        ))}
      </section>
    </div>
  );
};

export default ContestCoordinator;
