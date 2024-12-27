import React from "react";
import { useLocation } from "react-router-dom";
import styles from "./ForumPost.module.css";
import { CommentProps } from "./Type";

const baseUrl = "http://localhost:8080/api/v1";

export const Comment: React.FC<CommentProps> = ({
  id,
  content,
  votes,
  author,
  timestamp,
  fetchDataFunction,
}) => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const postId = query.get("id");
  const vote = async (voteType: string) => {
    const jsonData = JSON.stringify({
      type: voteType,
      post_id: postId,
      comment_id: id,
    });
    try {
      const fetchVote = await fetch(`${baseUrl}/reactions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: jsonData,
      });
      if (!fetchVote.ok) {
        throw new Error(`Error: ${fetchVote.status}`);
      }
      fetchDataFunction();
    } catch (error) {
      alert("Error: " + error);
    }
  };
  return (
    <article className={styles.commentContainer}>
      <div className={styles.commentContent}>
        <p className={styles.commentText} id={styles.leftAlignText}>
          {content}
        </p>
        <div className={styles.voteContainer}>
          <button className={styles.voteButton} onClick={() => vote("UPVOTE")}>
            <img src="up_arrow.svg" alt="upvote" />
          </button>
          <div className={styles.voteCount}>{votes}</div>
          <button
            className={styles.voteButton}
            onClick={() => vote("DOWNVOTE")}
          >
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
