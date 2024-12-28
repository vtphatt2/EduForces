import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import styles from "./ForumPost.module.css";
import { CommentProps } from "./Type";

const baseUrl = "http://localhost:8080/api/v1";

export const Comment: React.FC<CommentProps> = ({
  id,
  content,
  author,
  timestamp,
  fetchDataFunction,
}) => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const postId = query.get("id");
  const [votes, setVotes] = useState(0);
  const [my_vote, setMyVote] = useState<string>("");
  const vote = async (voteType: string) => {
    const realVoteType = my_vote === voteType ? "UNVOTE" : voteType;
    const jsonData = JSON.stringify({
      reaction_type: realVoteType,
    });
    try {
      const fetchVote = await fetch(
        `${baseUrl}/${postId}/comments/${id}/add-reaction`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: jsonData,
        }
      );
      if (!fetchVote.ok) {
        throw new Error(`Error: ${fetchVote.status}`);
      }
      fetchDataFunction();
      fetchVoteCount();
      fetchMyVote();
    } catch (error) {
      alert("Error: " + error);
    }
  };

  const fetchVoteCount = async () => {
    try {
      const response = await fetch(
        `${baseUrl}/${postId}/comments/${id}/count-reaction`,
        {
          method: "GET",
          headers: {
            Authorization: localStorage.getItem("session_id") || "",
          },
        }
      );
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      setVotes(data.data.upvotes - data.data.downvotes);
    } catch (error) {
      alert("Error: " + error);
    }
  };

  fetchVoteCount();

  const fetchMyVote = async () => {
    try {
      const response = await fetch(
        `${baseUrl}/${postId}/comments/${id}/get-reaction`,
        {
          method: "GET",
          headers: {
            Authorization: localStorage.getItem("session_id") || "",
          },
        }
      );
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      setMyVote(data.type);
    } catch (error) {
      alert("Error: " + error);
    }
  };

  fetchMyVote();
  return (
    <article className={styles.commentContainer}>
      <div className={styles.commentContent}>
        <p className={styles.commentText} id={styles.leftAlignText}>
          {content}
        </p>
        <div className={styles.voteContainer}>
          <button
            className={styles.voteButton}
            onClick={() => vote("UPVOTE")}
            id={my_vote === "UPVOTE" ? styles.voted : undefined}
          >
            <img src="up_arrow.svg" alt="upvote" />
          </button>
          <div className={styles.voteCount}>{votes}</div>
          <button
            className={styles.voteButton}
            onClick={() => vote("DOWNVOTE")}
            id={my_vote === "DOWNVOTE" ? styles.voted : undefined}
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
