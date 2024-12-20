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
        <h2 className={styles.recentPostsText}>Recent Posts</h2>
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
          <h3 className={styles.payAttention}>Pay Attention!</h3>
          <div className={styles.homeContestContainer}>
            <h4 className={styles.incomingContests}>Incoming Contests</h4>
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
              {leaderboardList
                .map((entry, index) => (
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
