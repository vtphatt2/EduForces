import React from "react";
import styles from "./Forum.module.css";
import { Post } from "./Post";
// import { ForumProps } from "./Type";
import NavBar from "../../components/NavBar";
import NavPage from "./NavPage";
import TextArea from "./TextArea";

const Forum: React.FC = () =>
  // {
  //   postList,
  //   pageList,
  // }
  {
    // Mock data, truyền vào real data sau này
    const postList = [
      {
        title: "Hard inequality",
        shortDescription: "Let a + b = 1. Prove that...",
        author: "congthanh1203",
      },
      {
        title: "Why is mathematics important in real life?",
        shortDescription:
          "Mathematics is integral to real life because it provides tools and frameworks for solving problems, making decisions, and understanding the world around us. Here are key reasons why mathematics is essential in everyday life:",
        author: "phuloi1512",
      },
      {
        title: "Projectile Motion",
        shortDescription:
          "A ball is thrown with an initial velocity of 20 m/s at an angle of 30∘ to the horizontal. Calculate:",
        author: "congthanh1203",
      },
      {
        title: "Free Fall",
        shortDescription:
          "A stone is dropped from the top of a 45-meter-high building. Calculate:",
        author: "hoangky1802",
      },
      {
        title: "Atomic Structure",
        shortDescription:
          "Write the electron configuration for the following elements:",
        author: "thinhphat544",
      },
    ];
    const pageList = [1, 2, 3, 4, 5];
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
                  shortDescription={post.shortDescription}
                  author={post.author}
                />
              ))}
            </section>
            <NavPage pageList={pageList} />
          </div>
          <aside className={styles.uploadAndRules}>
            <h1 className={styles.forumTitle}>Quick upload</h1>
            <h2 className={styles.uploadText}>Title</h2>
            <TextArea placeholder="Enter your title here" maxLength={500} />
            <h2 className={styles.uploadText}>Content</h2>
            <TextArea placeholder="Enter your content here" maxLength={5000} />
            <p className={styles.uploadRule}>
              Please read the forum rules carefully.
            </p>
            <button className={styles.uploadButton}>
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
                topics of education and learning. Off-topic content may be
                removed or moved to a more appropriate section.
              </li>
              <li>
                <span className={styles.titleOfRule}>No Spam</span>
                <br />
                Spam, advertising, or any form of unsolicited promotional
                content is prohibited. This includes irrelevant links or
                repeated posts designed to promote external products, services,
                or websites.
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
                <span className={styles.titleOfRule}>
                  Constructive Feedback
                </span>
                <br />
                When offering feedback, be constructive. Criticism should aim to
                help others improve, not to attack or belittle them.
              </li>
              <li>
                <span className={styles.titleOfRule}>Posting Frequency</span>
                <br />
                Avoid excessive posting in a short period of time. Allow others
                to participate and contribute to the conversation.
              </li>
            </ol>
          </aside>
        </div>
      </main>
    );
  };

export default Forum;
