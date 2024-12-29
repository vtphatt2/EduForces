import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import styles from "./Forum.module.css";
import { NavPageProps } from "./Type";
import { NavLink } from "react-router-dom";

const NavPage: React.FC<NavPageProps> = ({ numPages }) => {
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState(1);
  useEffect(() => {
    setCurrentPage(
      parseInt(
        new URLSearchParams(window.location.search).get("page") || "1",
        10
      )
    );
  }, [location.search]);
  return (
    <nav className={styles.navPageBar}>
      <ul className={styles.navPageLinks}>
        <li id={currentPage === 1 ? styles.disabled : ""}>
          <NavLink to={`/forum?page=${currentPage - 1}`}>
            <img src="left.svg" alt="prev" />
          </NavLink>
        </li>
        <li
          id={currentPage < 3 ? styles.disabled : ""}
          className={styles.tripledot}
        >
          ...
        </li>
        <li id={currentPage > 1 ? "" : styles.disabled}>
          <NavLink to={`/forum?page=${currentPage - 1}`}>
            {currentPage - 1}
          </NavLink>
        </li>
        <li>
          <NavLink to={`/forum?page=${currentPage}`} className={styles.active}>
            {currentPage}
          </NavLink>
        </li>
        <li id={currentPage < numPages ? "" : styles.disabled}>
          <NavLink to={`/forum?page=${currentPage + 1}`}>
            {currentPage + 1}
          </NavLink>
        </li>
        <li
          id={currentPage < numPages - 1 ? "" : styles.disabled}
          className={styles.tripledot}
        >
          ...
        </li>
        <li id={currentPage >= numPages ? styles.disabled : ""}>
          <NavLink to={`/forum?page=${currentPage + 1}`}>
            <img src="right.svg" alt="next" />
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default NavPage;
