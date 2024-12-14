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
    event.target.style.height = "auto";
    event.target.style.height = `${event.target.scrollHeight}px`;
    if (event.target.value.length > 5000) {
      event.target.value = event.target.value.slice(0, 5000);
    }
    const commentCount = document.getElementById("commentCount");
    if (commentCount) {
      commentCount.textContent = `${event.target.value.length}/5.000`;
    }
  };
  return (
    <main className={styles.forumPost}>
      <article className={styles.postContainer}>
        <h2 className={styles.postTitle}>{postTitle}</h2>
        <div className={styles.postLayout}>
          <Post {...post} />
          <UserInfo {...userInfo} />
        </div>
      </article>
      <hr className={styles.divider} />
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
        <button className={styles.commentSubmit} type="button">
          Send
        </button>
        <p className={styles.commentCount} id="commentCount">
          0/5.000
        </p>
      </form>
      <p className="commentRule">
        Please read the forum rules carefully. Negative comments may result in a
        24-hour ban.
      </p>
    </main>
  );
};

export default ForumPost;
