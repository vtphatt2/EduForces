import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import styles from "./ForumPost.module.css";
import { PostProps } from "./Type";

const baseUrl = "http://localhost:8080/api/v1";

export const Post: React.FC<PostProps> = ({
  content,
  postAuthor,
  timestamp,
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
      const fetchVote = await fetch(`${baseUrl}/posts/${postId}/add-reaction`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("session_id") || "",
        },
        body: jsonData,
      });
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
        `${baseUrl}/posts/${postId}/count-reaction`,
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
  }, [postId]);

  const fetchMyVote = React.useCallback(async () => {
    try {
      const response = await fetch(`${baseUrl}/posts/${postId}/get-reaction`, {
        method: "GET",
        headers: {
          Authorization: localStorage.getItem("session_id") || "",
        },
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      setMyVote(data.data.String);
    } catch (error) {
      alert("Error: " + error);
    }
  }, [postId]);

  useEffect(() => {
    fetchVoteCount();
    fetchMyVote();
  }, [votes, my_vote, fetchVoteCount, fetchMyVote]);
  return (
    <article className={styles.postContentContainer}>
      <p className={styles.postContent} id={styles.leftAlignText}>
        {content}
      </p>
      <div className={styles.voteAndAuthor}>
        <div className={styles.voteContainerOfPost}>
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
        <p className={styles.postAuthor}>
          Posted by <span className={styles.authorName}>{postAuthor} </span>
          at {timestamp}
        </p>
      </div>
    </article>
  );
};
