import React, { useState } from "react";
import styles from "./Forum.module.css";
import { TextAreaProps } from "./Type";

const TextArea: React.FC<TextAreaProps> = ({ placeholder, maxLength, id }) => {
  const [text, setText] = useState("");
  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value);
    event.target.style.height = "auto";
    event.target.style.height = `${event.target.scrollHeight}px`;
    if (event.target.value.length > maxLength) {
      event.target.value = event.target.value.slice(0, maxLength);
      setText(event.target.value);
    }
    const textCount = event.target.parentElement?.querySelector("p");
    if (textCount) {
      textCount.textContent = `${event.target.value.length}/${maxLength}`;
    }
  };
  return (
    <div className={styles.textAreaForm}>
      <textarea
        className={styles.textArea}
        placeholder={placeholder}
        value={text}
        onChange={handleTextChange}
        id={id}
      />
      <p className={styles.textCount}>0/{maxLength}</p>
    </div>
  );
};

export default TextArea;
