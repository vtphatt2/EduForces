import React from "react";
import styles from "./Forum.module.css";
import { CommentProps } from "./Type";

export const Comment: React.FC<CommentProps> = ({
  content,
  votes,
  author,
  timestamp,
}) => {
  return (
    <article className={styles.commentContainer}>
      <div className={styles.commentContent}>
        <p className={styles.commentText}>{content}</p>
        <div className={styles.voteCount} aria-label={`${votes} votes`}>
          {votes}
        </div>
      </div>
      <div className={styles.commentMeta}>
        <span className={styles.author}>by {author}</span>
        <time className={styles.timestamp}>{timestamp}</time>
      </div>
    </article>
  );
};
