import React, { useState, useEffect, useRef } from "react";
import styles from "./StudySpace.module.css";
import { FilterItemProps } from "./Type";

const FilterItem: React.FC<FilterItemProps> = ({
  label,
  isChecked: initialChecked,
  onChange,
}) => {
  const [isChecked, setIsChecked] = useState(initialChecked);
  const checkboxRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (checkboxRef.current) {
      console.log("isChecked: ", isChecked, checkboxRef.current.checked);
    }
  }, [isChecked]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(e.target.checked);
    onChange(e.target.checked);
  };

  return (
    <label className={styles.filterItem}>
      <input
        type="checkbox"
        checked={isChecked}
        onChange={handleChange}
        ref={checkboxRef}
      />
      {label}
    </label>
  );
};

export default FilterItem;