import React from "react";
import { HomeLeaderboardProps } from "./Type";
import styles from "./HomeLeaderboard.module.css";

const HomeLeaderboard: React.FC<HomeLeaderboardProps> = ({
  ranking,
  username,
  elo,
}) => {
  return (
    <tr className={styles.leaderboardRow}>
      <td className={styles.elementText}>{ranking}</td>
      <td className={styles.elementText}>{username}</td>
      <td className={styles.elementText}>{elo}</td>
    </tr>
  );
};

export default HomeLeaderboard;
