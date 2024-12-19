import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Forum.module.css";
import { PostProps } from "./Type";

export const Post: React.FC<PostProps> = ({
  title,
  shortDescription,
  author,
  id,
}) => {
  const navigate = useNavigate();
  const handlePostClick = async () => {
    try {
      navigate(`/post?id=${id}`);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <article className={styles.postContainer} onClick={handlePostClick}>
      <h2 className={styles.postTitle}>{title}</h2>
      <p className={styles.postDescription}>{shortDescription}</p>
      <p className={styles.postAuthor}>
        <span className={styles.authorLabel}>Source: </span>
        {author}
      </p>
    </article>
  );
};
