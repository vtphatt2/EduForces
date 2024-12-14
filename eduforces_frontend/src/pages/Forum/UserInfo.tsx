import React from "react";
import styles from "./Forum.module.css";
import { UserInfoProps } from "./Type";

export const UserInfo: React.FC<UserInfoProps> = ({
  elo,
  university,
  avatarSrc,
}) => {
  return (
    <aside className={styles.userInfo}>
      <img src={avatarSrc} alt="User profile" className={styles.profileImage} />
      <div className={styles.userStats}>
        <p className={styles.elo}>Elo: {elo}</p>
        <p className={styles.university}>{university}</p>
      </div>
    </aside>
  );
};
