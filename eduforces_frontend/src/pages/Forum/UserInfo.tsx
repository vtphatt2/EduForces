import React from "react";
import styles from "./Forum.module.css";
import { UserInfoProps } from "./Type";

export const UserInfo: React.FC<UserInfoProps> = ({
  elo,
  university,
  avatarSrc,
}) => {
  return (
    <aside className={styles.userInfoContainer}>
      <img src={avatarSrc} alt="User profile" className={styles.profileImage} />
      <div className={styles.userStatsContainer}>
        <p className={styles.elo}>Elo: {elo}</p>
        <p className={styles.university}>{university}</p>
      </div>
    </aside>
  );
};
