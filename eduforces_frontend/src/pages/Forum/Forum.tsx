import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import styles from "./Forum.module.css";
import { Post } from "./Post";
// import { ForumProps } from "./Type";
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
  const [numPages, setNumPages] = useState(0);
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

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      setPostList(data.data);
      setNumPages(Math.ceil(data.meta.total / 10));
    } catch (error) {
      alert("Error: " + error);
    }
  };

  useEffect(() => {
    getPostList(currentPage);
  }, [currentPage]);

  // const postList = [
  //   {
  //     title: "Hard inequality",
  //     shortDescription: "Let a + b = 1. Prove that...",
  //     author: "congthanh1203",
  //     id: "h4578t9h495u8ujrre8",
  //   },
  //   {
  //     title: "Why is mathematics important in real life?",
  //     shortDescription:
  //       "Mathematics is integral to real life because it provides tools and frameworks for solving problems, making decisions, and understanding the world around us. Here are key reasons why mathematics is essential in everyday life:",
  //     author: "phuloi1512",
  //     id: "5478yt894t9ht9th9r8",
  //   },
  //   {
  //     title: "Projectile Motion",
  //     shortDescription:
  //       "A ball is thrown with an initial velocity of 20 m/s at an angle of 30∘ to the horizontal. Calculate:",
  //     author: "congthanh1203",
  //     id: "fjh489jt8jj93tj4308tj",
  //   },
  //   {
  //     title: "Free Fall",
  //     shortDescription:
  //       "A stone is dropped from the top of a 45-meter-high building. Calculate:",
  //     author: "hoangky1802",
  //     id: "lsmjfklojf849j8j9j8",
  //   },
  //   {
  //     title: "Atomic Structure",
  //     shortDescription:
  //       "Write the electron configuration for the following elements:",
  //     author: "thinhphat544",
  //     id: "f8j4w9jf88jjfg0439j",
  //   },
  // ];
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
            {postList.map((post) => (
              <Post
                title={post.title}
                shortDescription={post.content}
                author={post.author_id}
                id={post.post_id}
              />
            ))}
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
