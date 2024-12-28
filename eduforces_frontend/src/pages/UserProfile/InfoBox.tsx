import React from "react";
import { InfoBoxProps } from "./Type";
import styles from "./UserProfile.module.css";

const InfoBox: React.FC<InfoBoxProps> = ({ title, content }) => {
  return (
    <div className={styles.infoBox}>
      <h2 className={styles.infoBoxTitle}>{title}</h2>
      <div className={styles.infoBoxContent}>
        <p className={styles.infoBoxText}>{content}</p>
      </div>
    </div>
  );
};
export default InfoBox;
