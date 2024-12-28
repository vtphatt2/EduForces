import React, { useState, useEffect } from "react";
import styles from "./UserProfile.module.css";
import InfoBox from "./InfoBox";
import EditableInfoBox from "./EditableInfoBox";
import NavBar from "../../components/NavBar";
import Button from "../../components/Button";

const baseUrl = "http://localhost:8080/api/v1";

const UserProfile: React.FC = () => {
  const [checked, setChecked] = useState(true);
  const [user, setUser] = useState({ title: "Username", content: "" });
  const [name, setName] = useState({ title: "Name", content: "" });
  const [email, setEmail] = useState({ title: "Email", content: "" });
  const [role, setRole] = useState({ title: "Role", content: "" });
  const fetchUserProfile = async () => {
    try {
      const response = await fetch(`${baseUrl}/accounts/account-details`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("session_id") || "",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user profile");
      }

      const data = await response.json();
      setUser({ title: "Username", content: data.username });
      setName({ title: "Name", content: data.name });
      setEmail({ title: "Email", content: data.email });
      setRole({ title: "Role", content: data.role });
    } catch (error) {
      alert(`Error: ${error}`);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);
  // const user = {
  //   title: "Username",
  //   content: "phuloi321",
  // };
  // const name = {
  //   title: "Name",
  //   content: "Pham Phu Loi",
  // };
  // const email = {
  //   title: "Email",
  //   content: "phuloi123@gmail.com",
  // };
  const elo = {
    title: "Elo",
    content: "3200",
  };
  // const role = {
  //   title: "Role",
  //   content: "User",
  // };
  const property = {
    title: "Property",
    content: "10 Gold",
  };

  const changeAvatarClick = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];
    const avatar = document.getElementsByClassName(
      styles.avatar
    )[0] as HTMLImageElement;
    avatar.src = URL.createObjectURL(file);
  };

  const changeUserProfile = async () => {
    const username = (
      document.getElementsByTagName("textarea")[0] as HTMLTextAreaElement
    ).value;
    if (!username) {
      alert("Username cannot be empty");
      return;
    }

    try {
      const response = await fetch(`${baseUrl}/accounts/update-username`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("session_id") || "",
        },
        body: JSON.stringify({ username }),
      });

      if (!response.ok) {
        throw new Error("Failed to update username");
      }
      alert("Update username successfully");
      fetchUserProfile();
    } catch (error) {
      alert(`Error: ${error}`);
    }
  };

  return (
    <main className={styles.userProfile}>
      <NavBar />
      <img
        src="https://www.w3schools.com/howto/img_avatar.png"
        alt="Avatar"
        className={styles.avatar}
      />
      <input
        id={styles.upload}
        type="file"
        accept="image/*"
        onChange={changeAvatarClick}
      />
      <h1
        className={styles.changePhoto}
        onClick={() =>
          (document.getElementById(styles.upload) as HTMLInputElement).click()
        }
      >
        Change photo
      </h1>
      <div className={styles.info}>
        <EditableInfoBox title={user.title} content={user.content} />
        <InfoBox title={name.title} content={name.content} />
        <InfoBox title={email.title} content={email.content} />
        <InfoBox title={elo.title} content={elo.content} />
        <InfoBox title={role.title} content={role.content} />
        <InfoBox title={property.title} content={property.content} />
        <label>
          <input
            type="checkbox"
            checked={checked}
            onChange={() => setChecked(!checked)}
            style={{ backgroundColor: "red" }}
          />
          <span className={styles.notification}>
            Contest email notification
          </span>
        </label>
        <Button
          label="Save changes"
          onClick={changeUserProfile}
          style={{ width: "100%" }}
        />
      </div>
    </main>
  );
};
export default UserProfile;
