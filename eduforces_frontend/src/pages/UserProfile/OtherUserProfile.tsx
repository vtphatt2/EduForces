import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./UserProfile.module.css";
import InfoBox from "./InfoBox";
import NavBar from "../../components/NavBar";

const baseUrl = "http://localhost:8080/api/v1";

const OtherUserProfile: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  const userId = query.get("id");
  const [user, setUser] = useState({ title: "Username", content: "" });
  const [name, setName] = useState({ title: "Name", content: "" });
  const [school, setSchool] = useState("");
  const [avatarSrc, setAvatarSrc] = useState(
    "https://www.w3schools.com/howto/img_avatar.png"
  );
  const [elo, setElo] = useState({ title: "Elo", content: "0" });
  const fetchUserProfile = React.useCallback(async () => {
    try {
      const response = await fetch(
        `${baseUrl}/accounts/account-details/${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("session_id") || "",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch user profile");
      }

      const data = await response.json();
      setUser({ title: "Username", content: data.username });
      setName({ title: "Name", content: data.name });
      setSchool(data.school);
      setAvatarSrc(data.avatar_path);
      setElo({ title: "Elo", content: `${data.elo_rating}` });
    } catch (error) {
      alert(`Error: ${error}`);
    }
  }, [userId]);

  const fetchCurrentUserId = async () => {
    try {
      const response = await fetch(`${baseUrl}/accounts/account-details`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("session_id") || "",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch current user profile");
      }

      const data = await response.json();
      return data.account_id;
    } catch (error) {
      alert(`Error: ${error}`);
      return null;
    }
  };

  useEffect(() => {
    fetchCurrentUserId().then((currentUserId) => {
      if (currentUserId === userId) {
        navigate("/user");
      } else fetchUserProfile();
    });
  }, [fetchUserProfile, navigate, userId]);
  const property = {
    title: "Property",
    content: "10 Gold",
  };

  return (
    <main className={styles.userProfile}>
      <NavBar />
      <img src={avatarSrc} alt="Avatar" className={styles.avatar} />
      <div className={styles.info}>
        <InfoBox title={user.title} content={user.content} />
        <InfoBox title={name.title} content={name.content} />
        <InfoBox title="School" content={school} />
        <InfoBox title={elo.title} content={elo.content} />
        <InfoBox title={property.title} content={property.content} />
      </div>
    </main>
  );
};
export default OtherUserProfile;
