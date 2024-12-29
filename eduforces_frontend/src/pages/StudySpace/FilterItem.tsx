import React from "react";
import { useState, useEffect } from "react";
import styles from "./StudySpace.module.css";
import { FilterItemProps } from "./Type";

const FilterItem: React.FC<FilterItemProps> = ({
  label,
  isChecked: initialChecked,
}) => {
  const [isChecked, setIsChecked] = useState(initialChecked);

  useEffect(() => {
    // setIsChecked(isChecked);
    console.log(
      "isChecked: ",
      isChecked,
      document.getElementsByTagName("input")[0].checked
    );
  }, [isChecked]);

  return (
    <label className={styles.filterItem}>
      <input
        type="checkbox"
        checked={isChecked}
        onChange={(e) => setIsChecked(e.target.checked)}
      />
      {label}
    </label>
  );
};

export default FilterItem;
