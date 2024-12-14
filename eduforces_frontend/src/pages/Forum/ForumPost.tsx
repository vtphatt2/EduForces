import React, { useState } from "react";
import styles from "./Forum.module.css";
import { Comment } from "./Comment";
import { Post } from "./Post";
import { UserInfo } from "./UserInfo";
import { ForumPostProps } from "./Type";

const ForumPost: React.FC<ForumPostProps> = ({
  post,
  userInfo,
  commentList,
  postTitle,
}) => {
  const [comment, setComment] = useState("");
  const handleCommentChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setComment(event.target.value);
  };
  return (
    <main className={styles.forumPost}>
      <article className={styles.postContent}>
        <h2 className={styles.postTitle}>{postTitle}</h2>
        <div className={styles.postLayout}>
          <Post {...post} />
          <UserInfo {...userInfo} />
        </div>
      </article>
      <section className={styles.commentSection}>
        {commentList.map((comment, index) => (
          <Comment key={index} {...comment} />
        ))}
      </section>
      <form className={styles.commentForm}>
        <textarea
          className={styles.commentInput}
          placeholder="Write a comment..."
          value={comment}
          onChange={handleCommentChange}
        />
        <button className={styles.commentSubmit}>Submit</button>
        <p className={styles.commentCount}></p>
      </form>
    </main>
  );
};

export default ForumPost;
