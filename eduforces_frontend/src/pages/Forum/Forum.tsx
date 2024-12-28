import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import styles from "./Forum.module.css";
import { Post } from "./Post";
import NavBar from "../../components/NavBar";
import NavPage from "./NavPage";
import TextArea from "./TextArea";
import { PostPropsAPI } from "./Type";

const baseUrl = "http://localhost:8080/api/v1";

const Forum: React.FC = () => {
  const location = useLocation();
  const currentPage = parseInt(
    new URLSearchParams(location.search).get("page") || "1",
    10
  );
  const [postList, setPostList] = useState<PostPropsAPI[]>([]);
  const [numPages, setNumPages] = useState(1);
  const getPostList = async (page = 1, limit = 10) => {
    try {
      const response = await fetch(
        `${baseUrl}/posts?page=${page}&limit=${limit}`,
        {
          method: "GET",
          headers: {
            Authorization: localStorage.getItem("session_id") || "",
          },
        }
      );

      if (localStorage.getItem("session_id") === null) {
        throw new Error("Please log in to view posts");
      }

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      setPostList(data.data);
      setNumPages(Math.ceil(data.meta.total / data.meta.limit));
    } catch (error) {
      alert(`Error: ${error}`);
    }
  };

  useEffect(() => {
    getPostList(currentPage, 5);
  }, [currentPage]);

  const uploadPost = async () => {
    const title = (
      document.getElementById("titleTextArea") as HTMLTextAreaElement
    ).value;
    const content = (
      document.getElementById("contentTextArea") as HTMLTextAreaElement
    ).value;
    if (title === "" || content === "") {
      alert("Please fill in both title and content");
      return;
    }
    const jsonData = JSON.stringify({
      title: title,
      content: content,
    });
    try {
      if (localStorage.getItem("session_id") === null) {
        throw new Error("Please log in to upload posts");
      }
      const response = await fetch(`${baseUrl}/posts`, {
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
      getPostList(currentPage);
    } catch (error) {
      alert("Error: " + error);
    }

    (document.getElementById("titleTextArea") as HTMLTextAreaElement).value =
      "";
    (document.getElementById("contentTextArea") as HTMLTextAreaElement).value =
      "";
  };
  return (
    <main>
      <NavBar />
      <div className={styles.forum}>
        <div className={styles.forumContainer}>
          <h1 className={styles.forumTitle}>Posts</h1>
          <section className={styles.postList}>
            {postList === null || postList.length === 0 ? (
              <p style={{ color: "black" }}>No posts found</p>
            ) : (
              postList.map((post) => (
                <Post
                  title={post.title}
                  shortDescription={post.content}
                  author={post.author_id}
                  id={post.post_id}
                />
              ))
            )}
          </section>
          <NavPage numPages={numPages} />
        </div>
        <aside className={styles.uploadAndRules}>
          <h1 className={styles.forumTitle}>Quick upload</h1>
          <h2 className={styles.uploadText}>Title</h2>
          <TextArea
            placeholder="Enter your title here"
            maxLength={500}
            id="titleTextArea"
          />
          <h2 className={styles.uploadText}>Content</h2>
          <TextArea
            placeholder="Enter your content here"
            maxLength={5000}
            id="contentTextArea"
          />
          <p className={styles.uploadRule}>
            Please read the forum rules carefully.
          </p>
          <button className={styles.uploadButton} onClick={uploadPost}>
            Upload
            <img
              src="upload_icon.svg"
              alt="upload"
              className={styles.uploadIcon}
            />
          </button>
          <h1 className={styles.forumTitle}>Forum rules</h1>
          <ol className={styles.rulesList}>
            <li>
              <span className={styles.titleOfRule}>Respectful Behavior</span>
              <br />
              Treat all members with respect and courtesy. Discrimination,
              harassment, or offensive language will not be tolerated.
            </li>
            <li>
              <span className={styles.titleOfRule}>Stay On-Topic</span>
              <br />
              Please ensure that discussions and posts are relevant to the
              topics of education and learning. Off-topic content may be removed
              or moved to a more appropriate section.
            </li>
            <li>
              <span className={styles.titleOfRule}>No Spam</span>
              <br />
              Spam, advertising, or any form of unsolicited promotional content
              is prohibited. This includes irrelevant links or repeated posts
              designed to promote external products, services, or websites.
            </li>
            <li>
              <span className={styles.titleOfRule}>
                Use Clear and Professional Language
              </span>
              <br />
              Avoid using overly casual language, slang, or text-speak. Ensure
              your posts are clear, respectful, and easy to understand.
            </li>
            <li>
              <span className={styles.titleOfRule}>Constructive Feedback</span>
              <br />
              When offering feedback, be constructive. Criticism should aim to
              help others improve, not to attack or belittle them.
            </li>
            <li>
              <span className={styles.titleOfRule}>Posting Frequency</span>
              <br />
              Avoid excessive posting in a short period of time. Allow others to
              participate and contribute to the conversation.
            </li>
          </ol>
        </aside>
      </div>
    </main>
  );
};

export default Forum;
