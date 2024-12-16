import React from "react";
import { HomeProps } from "./Type";
import HomePost from "./HomePost";
import HomeContest from "./HomeContest";
import HomeLeaderboard from "./HomeLeaderboard";
import styles from "./Home.module.css";


const Home: React.FC<HomeProps> = ({
  postList,
  contestList,
  leaderboardList,
}) => {
  return (
    <div className={styles.homeContainer}>
      {/* Left Section: Recent Posts */}
      <section className={styles.recentPosts}>
        <h2>Recent Posts</h2>
        {postList.map((post, index) => (
          <HomePost
            key={index}
            title={post.title}
            content={post.content}
            postAuthor={post.postAuthor}
          />
        ))}
      </section>

      {/* Right Sidebar */}
      <aside className={styles.sidebar}>
        {/* Contest Section */}
        <section className={styles.contestSection}>
          <h3>Pay Attention!</h3>
          <div>
            <h4>Incoming Contests</h4>
            {contestList.map((contest, index) => (
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
          <h3>Top Rated</h3>
          <table>
            <thead>
              <tr>
                <th>Top</th>
                <th>Username</th>
                <th>Elo</th>
              </tr>
            </thead>
            <tbody>
              {leaderboardList.map((entry, index) => (
                <HomeLeaderboard
                  key={index}
                  ranking={entry.ranking}
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
