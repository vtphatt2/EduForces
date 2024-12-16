import React from "react";
import ContestCard from "../../components/ContestCard";
import "./Contest.css";

const Contest = () => {
  // Mock data, truyền vào real data sau này
  const liveContest = [
    { title: "THPTQG Mock Test 1", date: "21:00 - 12/03/2024", duration: "180 minutes" },
  ];
  const upcomingContests = [
    { title: "THPTQG Mock Test 1", date: "21:00 - 12/03/2024", duration: "180 minutes" },
    { title: "Physics weekly practice 35", date: "17:00 - 20/03/2024", duration: "180 minutes" },
  ];
  const endedContests = [
    { title: "THPTQG Mock Test 1", date: "21:00 - 12/03/2024", duration: "180 minutes" },
    { title: "Physics weekly practice 35", date: "17:00 - 20/03/2024", duration: "180 minutes" },
  ];

  return (
    <div className="contest-container">
      <section>
        <h2>Live contests</h2>
        {liveContest.map((contest, index) => (
          <ContestCard
            key={index}
            title={contest.title}
            date={contest.date}
            duration={contest.duration}
            status="live"
            buttonText="Join"
            onButtonClick={() => console.log("Join clicked")}
          />
        ))}
      </section>

      <section>
        <h2>Upcoming contests</h2>
        {upcomingContests.map((contest, index) => (
          <ContestCard
            key={index}
            title={contest.title}
            date={contest.date}
            duration={contest.duration}
            status="upcoming"
            buttonText="Register"
            onButtonClick={() => console.log("Register clicked")}
          />
        ))}
      </section>

      <section>
        <h2>Ended contests</h2>
        {endedContests.map((contest, index) => (
          <ContestCard
            key={index}
            title={contest.title}
            date={contest.date}
            duration={contest.duration}
            status="ended"
            buttonText="Join virtually"
            onButtonClick={() => console.log("Join virtually clicked")}
          />
        ))}
      </section>
    </div>
  );
};

export default Contest;
