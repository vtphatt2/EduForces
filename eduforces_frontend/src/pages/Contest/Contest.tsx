import { useState, useEffect } from "react";
import ContestCard from "../../components/ContestCard";
import { useNavigate } from "react-router-dom";
import "./Contest.css";

interface Contest {
  id: number;
  title: string;
  timestamp: string;
  duration: string;
  status: string;
}

const Contest = () => {
  const navigate = useNavigate();
  const [liveContests, setLiveContests] = useState<Contest[]>([]);
  const [pendingContests, setPendingContests] = useState<Contest[]>([]);
  const [endedContests, setEndedContests] = useState<Contest[]>([]);

  const fetchContests = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/v1/contests", {
        method: "GET",
        headers: {
          Authorization: localStorage.getItem("session_id") || "",
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();


      for (let i = 0; i < data.length; i++) {
        let contest_id = data[i].contest_id;
        let contest_title = data[i].name;
        let constest_timestamp = data[i].start_time;
        let contest_duration = data[i].duration = `${data[i].duration} minutes`;
        let contest_status = data[i].status;
        
        data[i] = {
          id: contest_id,
          title: contest_title,
          timestamp: constest_timestamp,
          duration: contest_duration,
          status: contest_status,
        };
      }

      const live = data.filter((contest: Contest) => contest.status === "Live");
      const pending = data.filter((contest: Contest) => contest.status === "Pending");
      const ended = data.filter((contest: Contest) => contest.status === "Ended");

      setLiveContests(live);
      setPendingContests(pending);
      setEndedContests(ended);
    } catch (error) {
      console.error("Failed to fetch contests:", error);
    }
  };

  useEffect(() => {
    fetchContests();
  }, []);

  const handleJoinContest = (contest: Contest) => {
    navigate(`/contest-live/${contest.id}`, {
      state: {
        contestId: contest.id,
        contestTitle: contest.title,
        contestTimestamp: contest.timestamp,
        contestDuration: contest.duration,
        announcementList: [],
      },
    });
  };

  return (
    <div className="contest-container">
      <section>
        <h2>Live contests</h2>
        {liveContests.length > 0 ? (
          liveContests.map((contest) => (
            <ContestCard
              key={contest.id}
              title={contest.title}
              date={contest.timestamp}
              duration={contest.duration}
              status="live"
              buttonText="Join"
              onButtonClick={() => handleJoinContest(contest)}
            />
          ))
        ) : (
          <p>No live contests available</p>
        )}
      </section>

      <section>
        <h2>Upcoming contests</h2>
        {pendingContests.length > 0 ? (
          pendingContests.map((contest) => (
            <ContestCard
              key={contest.id}
              title={contest.title}
              date={contest.timestamp}
              duration={contest.duration}
              status="upcoming"
              buttonText="Pending"
              onButtonClick={() => console.log("Pending clicked")}
            />
          ))
        ) : (
          <p>No upcoming contests available</p>
        )}
      </section>

      
      <section>
        <h2>Ended contests</h2>
        {endedContests.length > 0 ? (
          endedContests.map((contest) => (
            <ContestCard
              key={contest.id}
              title={contest.title}
              date={contest.timestamp}
              duration={contest.duration}
              status="ended"
              buttonText="Ended"
              onButtonClick={() => console.log("Ended clicked")}
            />
          ))
        ) : (
          <p>No ended contests available</p>
        )}
      </section>

    </div>
  );
};

export default Contest;
