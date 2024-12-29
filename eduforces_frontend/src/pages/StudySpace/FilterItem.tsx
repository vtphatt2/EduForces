import React from "react";
import { useState, useEffect } from "react";
import styles from "./StudySpace.module.css";
import { FilterItemProps } from "./Type";

const FilterItem: React.FC<FilterItemProps> = ({ label, isChecked }) => {
  const [checked, setIsChecked] = useState(isChecked);

  useEffect(() => {
    setIsChecked(isChecked);
  }, [isChecked]);
  return (
    <label className={styles.filterItem}>
      <input
        type="checkbox"
        checked={checked}
        onChange={() => setIsChecked(!checked)}
      />
      {label}
    </label>
  );
};

export default FilterItem;
