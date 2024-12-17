import React, { useState } from "react";
import { HomeContestProps } from "./Type";
import Button from "../../components/Button.tsx";
import styles from "./HomeContest.module.css";

const HomeContest: React.FC<HomeContestProps> = ({ title, timestamp }) => {
  const [isRegistered, setIsRegistered] = useState(false);

  const handleRegisterClick = () => {
    setIsRegistered((prev) => !prev); 
  };

  return (
    <div className={styles.homeContestContainer}>
      <section className={styles.contestItem}>
        <div className={styles.contestTitleWrapper}>
          <span
            className={`${styles.contestTitle} ${
              isRegistered ? styles.registeredContestTitle : ""
            }`}
          >
            {title}
          </span>
        </div>
        <div className={styles.contestTimestampWrapper}>
          <span className={styles.contestTimestamp}>{timestamp}</span>
        </div>
      </section>

      <aside className={styles.sidebar}>
        <section className={styles.registerButtonWrapper}>
          <Button
            label={isRegistered ? "Cancel" : "Register"}
            onClick={handleRegisterClick}
            color={isRegistered ? "#1E285F" : "white"}
            backgroundColor={isRegistered ? "#F2F1FA" : "#5D5A88"}
          />
        </section>
      </aside>
    </div>
  );
};

export default HomeContest;
