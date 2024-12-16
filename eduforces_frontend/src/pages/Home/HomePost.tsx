import React from "react";
import { HomePostProps } from "./Type";
import styles from "./HomePost.module.css";

const HomePost: React.FC<HomePostProps> = ({ title, content, postAuthor }) => {
  return (
    <div className={styles.homePostContainer}>
      <h3 className={styles.postTitle}> {title}</h3>
      <p className={styles.postContent}>{content}</p>
      <p>
        <strong className={styles.postAuthor}>Source:</strong>
        <span className={styles.postAuthorSpan}>  {postAuthor}</span>
      </p>
    </div>
  );
};

export default HomePost;
