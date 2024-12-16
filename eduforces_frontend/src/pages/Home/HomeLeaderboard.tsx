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
      <td>{ranking}</td>
      <td>{username}</td>
      <td>{elo}</td>
    </tr>
  );
};

export default HomeLeaderboard;
