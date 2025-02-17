import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import styles from "./ForumPost.module.css";
import { Comment } from "./Comment";
import { Post } from "./Post";
import { UserInfo } from "./UserInfo";
import Button from "../../components/Button";
import NavBar from "../../components/NavBar";
import { PostPropsAPI, CommentPropsAPI, ForumPostProps } from "./Type";
import getAccountDetailById, {
  formatTimestamp,
  getTrueImageSrc,
} from "../../components/Common";

const baseUrl = "http://localhost:8080/api/v1";

const ForumPost: React.FC = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const postId = query.get("id");
  const [post, setPost] = useState<PostPropsAPI>({
    post_id: "",
    title: "",
    content: "",
    author_id: "",
    author_name: "",
    timestamp: "",
  });
  const [userInfo, setUserInfo] = useState<ForumPostProps["userInfo"]>({
    elo: 0,
    university: "",
    avatarSrc: "",
  });
  const [commentList, setCommentList] = useState<CommentPropsAPI[]>([]);
  const fetchData = React.useCallback(async (id: string | null) => {
    try {
      if (localStorage.getItem("session_id") === null) {
        throw new Error(`Please log in to view posts`);
      }
      const fetchPost = await fetch(`${baseUrl}/posts/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("session_id") || "",
        },
      });

      if (!fetchPost.ok) {
        throw new Error(`Error: ${fetchPost.status}`);
      }
      const postData = await fetchPost.json();
      const accountDetail = await getAccountDetailById(postData.author_id);
      setUserInfo({
        elo: accountDetail.elo_rating,
        university: accountDetail.school,
        avatarSrc: getTrueImageSrc(accountDetail.avatar_path),
      });
      setPost({
        post_id: postData.post_id,
        title: postData.title,
        content: postData.content,
        author_id: postData.author_id,
        author_name: accountDetail.username,
        timestamp: formatTimestamp(postData.timestamp),
      });
    } catch (error) {
      alert("Error: " + error);
    }

    try {
      if (localStorage.getItem("session_id") === null) {
        throw new Error(`Please log in to view posts`);
      }
      const fetchCommentList = await fetch(`${baseUrl}/posts/${id}/comments`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("session_id") || "",
        },
      });
      if (!fetchCommentList.ok) {
        throw new Error(`Error: ${fetchCommentList.status}`);
      }
      const commentData = await fetchCommentList.json();
      const commentListTemp = commentData.data === null ? [] : commentData.data;
      for (let i = 0; i < commentListTemp.length; i++) {
        const accountDetail = await getAccountDetailById(
          commentListTemp[i].author_id
        );
        commentListTemp[i].author_name = accountDetail.username;
        commentListTemp[i].timestamp = formatTimestamp(
          commentListTemp[i].timestamp
        );
      }
      setCommentList(commentListTemp);
    } catch (error) {
      alert("Error: " + error);
    }
  }, []);
  useEffect(() => {
    fetchData(postId);
  }, [postId, fetchData]);
  const [comment, setComment] = useState("");
  const handleCommentChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setComment(event.target.value);
    event.target.style.height = "auto";
    event.target.style.height = `${event.target.scrollHeight}px`;
    if (event.target.value.length > 5000) {
      event.target.value = event.target.value.slice(0, 5000);
      setComment(event.target.value);
    }
    const commentCount = document.getElementById("commentCount");
    if (commentCount) {
      commentCount.textContent = `${event.target.value.length}/5000`;
    }
  };
  const sendComment = async () => {
    if (comment.length === 0) {
      alert("Please write a comment before sending.");
      return;
    }

    const jsonData = JSON.stringify({
      content: comment,
    });
    try {
      if (localStorage.getItem("session_id") === null) {
        throw new Error("Please log in to upload posts");
      }
      const response = await fetch(`${baseUrl}/posts/${postId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("session_id") || "",
        },
        body: jsonData,
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      setComment("");
      fetchData(postId);
    } catch (error) {
      alert("Error: " + error);
    }
  };
  return (
    <main className={styles.forumPost}>
      <NavBar />
      <article className={styles.postContainer}>
        <h2 className={styles.postTitle}>{post.title}</h2>
        <div className={styles.postLayout}>
          <Post
            content={post.content}
            postAuthor={post.author_name}
            postAuthorId={post.author_id}
            timestamp={post.timestamp}
          />
          <UserInfo {...userInfo} />
        </div>
      </article>
      <hr className={styles.divider} />
      <section className={styles.commentSection}>
        {commentList === null || commentList.length === 0 ? (
          <p style={{ color: "black" }}>There are no comments yet.</p>
        ) : (
          commentList.map((_comment, index) => (
            <Comment
              key={index}
              content={_comment.content}
              author={_comment.author_name}
              author_id={_comment.author_id}
              timestamp={_comment.timestamp}
              id={_comment.comment_id}
            />
          ))
        )}
      </section>
      <div className={styles.commentForm}>
        <textarea
          className={styles.commentInput}
          placeholder="Write a comment..."
          value={comment}
          onChange={handleCommentChange}
        />
        <Button label="Send" onClick={sendComment} />
        <p className={styles.commentCount} id="commentCount">
          0/5.000
        </p>
      </div>
      <p className={styles.commentGuideline}>
        Please read the forum rules carefully. Negative comments may result in a
        24-hour ban.
      </p>
    </main>
  );
};

export default ForumPost;
