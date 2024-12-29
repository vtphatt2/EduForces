import React from "react";
import { AnnouncementProps } from "./Type";
import styles from "./Announcement.module.css";

const Announcement: React.FC<AnnouncementProps> = ({ title, content }) => {
  return (
    <div>
      <h3 className={styles.announcementTitle}> {title}</h3>
      <p className={styles.announcementContent}>{content}</p>
    </div>
  );
};

export default Announcement;
