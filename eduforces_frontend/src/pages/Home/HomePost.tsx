import React from "react";
import { HomePostProps } from "./Type";
import styles from "./HomePost.module.css";


const HomePost: React.FC<HomePostProps> = ({ title, content, postAuthor }) => {
    return (
      <div className={styles.postCard}>
        <h3>{title}</h3>
        <p>{content}</p>
        <p className={styles.source}>
          <strong>Source:</strong> {postAuthor}
        </p>
      </div>
    );
  };
  
export default HomePost;

