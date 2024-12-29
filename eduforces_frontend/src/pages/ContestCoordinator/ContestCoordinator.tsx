import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ContestCoordinatorBlock from "./ContestCoordinatorBlock";
import { ContestCoordinatorBlockProps } from "./Type";
import Button from "../../components/Button.tsx";
import styles from "./ContestCoordinator.module.css";

const baseUrl = "http://localhost:8080/api/v1";

const ContestCoordinator: React.FC = () => {
  const navigate = useNavigate();
  const [contests, setContests] = useState<ContestCoordinatorBlockProps[]>([]);
  const generateId = useRef(5); // Use useRef to persist the generateId value

  const fetchContests = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/v1/contests", {
        method: "GET",
        headers: {
          Authorization: localStorage.getItem("session_id") || "",
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      for (let i = 0; i < data.length; i++) {
        let contest_id = data[i].contest_id;
        let contest_title = data[i].name;
        let constest_timestamp = data[i].start_time;
        let contest_duration = data[i].duration = `${data[i].duration} minutes`;
        
        data[i] = {
          id: contest_id,
          title: contest_title,
          timestamp: constest_timestamp,
          duration: contest_duration,
        };
      }

      setContests(data);
    } catch (error) {
      console.error("Failed to fetch contests:", error);
    }
  };

  useEffect(() => {
    fetchContests();
  }, []);

  const handleDeleteContest = async (id: number) => {
    try {
      const response = await fetch(`${baseUrl}/contests/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: localStorage.getItem("session_id") || "",
        },
      });
  
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
  
      // Update the state to remove the deleted contest
      setContests((prevContests) => prevContests.filter((contest) => contest.id !== id));
      alert("Contest deleted successfully!");
    } catch (error) {
      console.error("Failed to delete contest:", error);
      alert("Failed to delete contest. Please try again.");
    }
  };


  const handleAddContest = () => {
    const id = generateId.current;
    const newContest = {
      id,
      title: '',
      timestamp: '',
      duration: '',
    };
    generateId.current += 1;
    setContests((prevContests) => [...prevContests, newContest]);

    navigate("/contest-create", { 
      state: {
        id,
        title: newContest.title,
        timestamp: newContest.timestamp,
        duration: newContest.duration,
      },
    });
  };

  return (
    <div className={styles.container}>
      <section>
        <div className={styles.headerWrapper}>
          <h2 className={styles.createdContestsText}>Contests</h2>
          <div className={styles.buttonWrapper}>
            <Button
              label="Create New Contest"
              onClick={handleAddContest}
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
