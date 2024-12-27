import React, { useState } from "react";
import styles from "./UserProfile.module.css";
import InfoBox from "./InfoBox";
import EditableInfoBox from "./EditableInfoBox";
import NavBar from "../../components/NavBar";
import Button from "../../components/Button";

const UserProfile: React.FC = () => {
  const [checked, setChecked] = useState(true);
  const user = {
    title: "Username",
    content: "phuloi321",
  };
  const name = {
    title: "Name",
    content: "Pham Phu Loi",
  };
  const email = {
    title: "Email",
    content: "phuloi123@gmail.com",
  };
  const elo = {
    title: "Elo",
    content: "3200",
  };
  const role = {
    title: "Role",
    content: "User",
  };
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

  const changeUserProfile = () => {
    alert("Changes saved successfully");
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
