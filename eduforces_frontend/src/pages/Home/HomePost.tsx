import React from "react";
import { useNavigate } from "react-router-dom";
import { HomePostProps } from "./Type";
import styles from "./HomePost.module.css";

const HomePost: React.FC<HomePostProps> = ({
  title,
  content,
  postAuthor,
  id,
}) => {
  const navigate = useNavigate();
  return (
    <div
      className={styles.homePostContainer}
      onClick={() => {
        navigate(`/post?id=${id}`);
      }}
    >
      <h3 className={styles.postTitle}> {title}</h3>
      <p className={styles.postContent}>{content}</p>
      <p>
        <strong className={styles.postAuthor}>Source:</strong>
        <span className={styles.postAuthorSpan}> {postAuthor}</span>
      </p>
    </div>
  );
};

export default HomePost;
