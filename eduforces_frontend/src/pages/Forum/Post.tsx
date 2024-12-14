import React from "react";
import styles from "./Forum.module.css";
import { PostProps } from "./Type";

export const Post: React.FC<PostProps> = ({
  content,
  postAuthor,
  timestamp,
}) => {
  return (
    <article className={styles.post}>
      <p className={styles.content}>{content}</p>
      <p className={styles.author}>
        Posted by {postAuthor} on {timestamp}
      </p>
    </article>
  );
};
