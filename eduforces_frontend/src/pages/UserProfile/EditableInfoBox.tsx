import React, { useState } from "react";
import { InfoBoxProps } from "./Type";
import styles from "./UserProfile.module.css";

const EditableInfoBox: React.FC<InfoBoxProps> = ({ title, content }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content);
  const editContent = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    e.target.value = e.target.value.replace("\n", "");
    e.target.value = e.target.value.replace("\r", "");
    e.target.value = e.target.value.slice(0, 50);
    setEditedContent(e.target.value);
  };
  return (
    <div className={styles.infoBox}>
      <h2 className={styles.infoBoxTitle}>{title}</h2>
      <div className={styles.infoBoxContent}>
        <textarea
          className={styles.infoBoxTextarea}
          value={editedContent}
          readOnly={!isEditing}
          onChange={editContent}
        />
        <button
          className={styles.editButton}
          onClick={() => setIsEditing(!isEditing)}
          id={isEditing ? styles.save : undefined}
        >
          <img src="edit.svg" alt="Edit" className={styles.editIcon} />
        </button>
      </div>
    </div>
  );
};
export default EditableInfoBox;
