import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import styles from "./Forum.module.css";
import { NavPageProps } from "./Type";
import { NavLink } from "react-router-dom";

const NavPage: React.FC<NavPageProps> = ({ pageList }) => {
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
  if (currentPage > 1 && pageList.indexOf(currentPage + 1) !== -1) {
    return (
      <nav className={styles.navPageBar}>
        <ul className={styles.navPageLinks}>
          <li>
            <NavLink
              to={`/forum?page=${currentPage - 1}`}
              className={({ isActive }) =>
                isActive ? styles.active : undefined
              }
            >
              <img src="left.svg" alt="prev" />
            </NavLink>
          </li>
          {pageList.map((page) => (
            <li key={page}>
              <NavLink
                to={`/forum?page=${page}`}
                className={({ isActive }) =>
                  isActive ? styles.active : undefined
                }
              >
                {page}
              </NavLink>
            </li>
          ))}
          <li>
            <NavLink
              to={`/forum?page=${currentPage + 1}`}
              className={({ isActive }) =>
                isActive ? styles.active : undefined
              }
            >
              <img src="right.svg" alt="next" />
            </NavLink>
          </li>
        </ul>
      </nav>
    );
  } else if (currentPage > 1 && pageList.indexOf(currentPage + 1) === -1) {
    return (
      <nav className={styles.navPageBar}>
        <ul className={styles.navPageLinks}>
          <li>
            <NavLink
              to={`/forum?page=${currentPage - 1}`}
              className={({ isActive }) =>
                isActive ? styles.active : undefined
              }
            >
              <img src="left.svg" alt="prev" />
            </NavLink>
          </li>
          {pageList.map((page) => (
            <li key={page}>
              <NavLink
                to={`/forum?page=${page}`}
                className={({ isActive }) =>
                  isActive ? styles.active : undefined
                }
              >
                {page}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    );
  } else {
    return (
      <nav className={styles.navPageBar}>
        <ul className={styles.navPageLinks}>
          {pageList.map((page) => (
            <li key={page}>
              <NavLink
                to={`/forum?page=${page}`}
                className={({ isActive }) =>
                  isActive ? styles.active : undefined
                }
              >
                {page}
              </NavLink>
            </li>
          ))}
          <li>
            <NavLink
              to={`/forum?page=${currentPage + 1}`}
              className={({ isActive }) =>
                isActive ? styles.active : undefined
              }
            >
              <img src="right.svg" alt="next" />
            </NavLink>
          </li>
        </ul>
      </nav>
    );
  }
};

export default NavPage;
