import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./ForumPost.module.css";
import { CommentProps } from "./Type";

const baseUrl = "http://localhost:8080/api/v1";

export const Comment: React.FC<CommentProps> = ({
  id,
  content,
  author,
  author_id,
  timestamp,
}) => {
  const navigate = useNavigate();
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
        `${baseUrl}/posts/${postId}/comments/${id}/add-reaction`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("session_id") || "",
          },
          body: jsonData,
        }
      );
      if (!fetchVote.ok) {
        throw new Error(`Error: ${fetchVote.status}`);
      }
      fetchVoteCount();
      fetchMyVote();
    } catch (error) {
      alert("Error: " + error);
    }
  };

  const fetchVoteCount = React.useCallback(async () => {
    try {
      const response = await fetch(
        `${baseUrl}/posts/${postId}/comments/${id}/count-reaction`,
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
      setVotes(data.upvotes - data.downvotes);
    } catch (error) {
      alert("Error: " + error);
    }
  }, [postId, id]);

  const fetchMyVote = React.useCallback(async () => {
    try {
      const response = await fetch(
        `${baseUrl}/posts/${postId}/comments/${id}/get-reaction`,
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
      setMyVote(data.data.String);
    } catch (error) {
      alert("Error: " + error);
    }
  }, [postId, id]);

  useEffect(() => {
    fetchVoteCount();
    fetchMyVote();
  }, [votes, my_vote, fetchVoteCount, fetchMyVote]);

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
        by{" "}
        <span
          className={styles.commentAuthor}
          onClick={() => navigate(`/profile?id=${author_id}`)}
        >
          {author}
        </span>
        <br />
        <time className={styles.commentTimestamp}>{timestamp}</time>
      </div>
    </article>
  );
};
