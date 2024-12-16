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
        <div className={styles.voteContainer}>
          <button className={styles.voteButton}>
            <img src="up_arrow.svg" alt="upvote" />
          </button>
          <div className={styles.voteCount}>{votes}</div>
          <button className={styles.voteButton}>
            <img src="down_arrow.svg" alt="downvote" />
          </button>
        </div>
      </div>
      <div className={styles.commentMeta}>
        <span className={styles.commentAuthor}>by {author}</span>
        <br />
        <time className={styles.commentTimestamp}>{timestamp}</time>
      </div>
    </article>
  );
};
