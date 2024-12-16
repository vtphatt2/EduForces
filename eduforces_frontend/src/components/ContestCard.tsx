import React from "react";
import "./ContestCard.css";

interface ContestCardProps {
  title: string;
  date: string;
  duration: string;
  status: "live" | "upcoming" | "ended";
  buttonText: string;
  onButtonClick: () => void;
}

const ContestCard: React.FC<ContestCardProps> = ({
  title,
  date,
  duration,
  status,
  buttonText,
  onButtonClick,
}) => {
  return (
    <div className={`contest-card ${status}`}>
      <div>
      <h3 style={{ color: "#5D5A88" }}>{title}</h3>
        <p style={{ color: "#5D5A88" }}>{date}</p>
        <p style={{ color: "#5D5A88" }}><strong>Duration:</strong> {duration}</p>
      </div>
      <button className={`button ${status}`} onClick={onButtonClick}>
        {buttonText}
      </button>
    </div>
  );
};

export default ContestCard;
