import React from "react";
import styles from "./ForumPost.module.css";
import { PostProps } from "./Type";

export const Post: React.FC<PostProps> = ({
  content,
  postAuthor,
  timestamp,
}) => {
  return (
    <article className={styles.postContentContainer}>
      <p className={styles.postContent} id={styles.leftAlignText}>
        {content}
      </p>
      <p className={styles.postAuthor}>
        Posted by <span className={styles.authorName}>{postAuthor} </span>
        at {timestamp}
      </p>
    </article>
  );
};
