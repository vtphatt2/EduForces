import React from "react";
import { HomeContestProps } from "./Type";
import styles from "./HomeContest.module.css";

const HomeContest: React.FC<HomeContestProps> = ({ title, timestamp }) => {
  return (
    <div className={styles.contestItem}>
      <span>{title}</span>
      <span>{timestamp}</span>
      <button className={styles.registerButton}>Register</button>
    </div>
  );
};

export default HomeContest;
