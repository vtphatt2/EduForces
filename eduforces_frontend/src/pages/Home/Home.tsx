/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useState } from "react";
import HomePost from "./HomePost";
import HomeContest from "./HomeContest";
import HomeLeaderboard from "./HomeLeaderboard";
import styles from "./Home.module.css";
import { PostPropsAPI } from "../Forum/Type";

const baseUrl = "http://localhost:8080/api/v1";

const Home: React.FC = () => {
  const [postList, setPostList] = useState<PostPropsAPI[]>([]);
  const getPostList = async () => {
    try {
      const response = await fetch(`${baseUrl}/posts?page=1&limit=5`, {
        method: "GET",
        headers: {
          Authorization: localStorage.getItem("session_id") || "",
        },
      });

      if (localStorage.getItem("session_id") === null) {
        throw new Error("Please log in first");
      }

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      setPostList(data.data);
    } catch (error) {
      alert(`Error: ${error}`);
    }
  };

  useEffect(() => {
    getPostList();
  }, []);
  const contestList = [
    { title: "THPTQG Mock Test 1", timestamp: "21:00 2024-09-20" },
    { title: "Math MCQ Mock Test 21", timestamp: "18:00 2024-09-25" },
    { title: "Physics MCQ Mock Test 3", timestamp: "17:00 2024-09-30" },
    { title: "Chemistry MCQ Mock Test 5", timestamp: "19:00 2024-10-05" },
  ];

  const leaderboardList = [
    { username: "phuloi123", elo: 3200 },
    { username: "phuloi321", elo: 3120 },
    { username: "phuloi135", elo: 1800 },
    { username: "phuloi531", elo: 1500 },
    { username: "phuloi246", elo: 1200 },
    { username: "phuloi456", elo: 3000 },
    { username: "phuloi654", elo: 2500 },
    { username: "phuloi789", elo: 2400 },
    { username: "phuloi987", elo: 2000 },
    { username: "phuloi642", elo: 1000 },
    { username: "congthanh123", elo: 2200 },
    { username: "thinhphat321", elo: 2220 },
    { username: "minhkhoa135", elo: 3800 },
    { username: "hoangky531", elo: 3110 },
    { username: "phuloi226", elo: 3201 },
    { username: "phuloi456", elo: 3205 },
    { username: "phuloi654", elo: 2500 },
    { username: "hoangky789", elo: 2420 },
    { username: "congthanh987", elo: 2999 },
    { username: "thinhphat642", elo: 2422 },
  ];

  const processedContestList = contestList;
  for (let i = 0; i < contestList.length; i++) {
    processedContestList[i].title = "> " + processedContestList[i].title;
  }
  const processedLeaderboardList = leaderboardList.sort(
    (a, b) => b.elo - a.elo
  );
  return (
    <div className={styles.homeContainer}>
      {/* Left Section: Recent Posts */}
      <section className={styles.recentPosts}>
        <h2 className={styles.recentPostsText}>Recent Posts</h2>
        {postList === null ? (
          <p style={{ color: "black" }}>No posts to display</p>
        ) : (
          postList.map((post, index) => (
            <HomePost
              key={index}
              title={post.title}
              content={post.content}
              postAuthor={post.author_id}
              id={post.post_id}
            />
          ))
        )}
      </section>

      {/* Right Sidebar */}
      <aside className={styles.sidebar}>
        {/* Contest Section */}
        <section className={styles.contestSection}>
          <h3 className={styles.payAttention}>Pay Attention!</h3>
          <div className={styles.homeContestContainer}>
            <h4 className={styles.incomingContests}>Incoming Contests</h4>
            {processedContestList.map((contest, index) => (
              <HomeContest
                key={index}
                title={contest.title}
                timestamp={contest.timestamp}
              />
            ))}
          </div>
        </section>

        {/* Leaderboard Section */}
        <section className={styles.leaderboardSection}>
          <h3 className={styles.topRated}>Top Rated</h3>
          <table>
            <thead>
              <tr>
                <th className={styles.elementText}>Top</th>
                <th className={styles.elementText}>Username</th>
                <th className={styles.elementText}>Elo</th>
              </tr>
            </thead>
            <tbody>
              {processedLeaderboardList.map((entry, index) => (
                <HomeLeaderboard
                  key={index}
                  ranking={index + 1}
                  username={entry.username}
                  elo={entry.elo}
                />
              ))}
            </tbody>
          </table>
        </section>
      </aside>
    </div>
  );
};

export default Home;
