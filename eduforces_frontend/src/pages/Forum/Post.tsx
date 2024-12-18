import React from "react";
import styles from "./Forum.module.css";
import { PostProps } from "./Type";

export const Post: React.FC<PostProps> = ({
  title,
  shortDescription,
  author,
}) => {
  return (
    <article className={styles.postContainer}>
      <h2 className={styles.postTitle}>{title}</h2>
      <p className={styles.postDescription}>{shortDescription}</p>
      <p className={styles.postAuthor}>
        <span className={styles.authorLabel}>Source: </span>
        {author}
      </p>
    </article>
  );
};
