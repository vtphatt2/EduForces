import React from "react";
import { HomeContestProps } from "./Type";
import Button from "../../components/Button.tsx";
import styles from "./HomeContest.module.css";

const HomeContest: React.FC<HomeContestProps> = ({ title, timestamp }) => {
  const handleRegisterClick = () => {
    // Implement the registration logic here
    console.log("Registered for contest");
  };

  return (
    <div className={styles.homeContestContainer}>
      <section className={styles.contestItem}>
        <div className={styles.contestTitleWrapper}>
          <span className={styles.contestTitle}>{title}</span>
        </div>
        <div className={styles.contestTimestampWrapper}>
          <span className={styles.contestTimestamp}>{timestamp}</span>
        </div>
      </section>

      <aside className={styles.sidebar}>
        <section className={styles.registerButtonWrapper}>
          <Button label="Register" onClick={handleRegisterClick} />
        </section>
      </aside>
    </div>
  );
};

export default HomeContest;
