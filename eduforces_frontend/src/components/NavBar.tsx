import React, { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FaLock } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import "./NavBar.css";

const baseUrl = "http://localhost:8080/api/v1";

const NavBar: React.FC = () => {
  const navigate = useNavigate();
  const { isLoggedIn, username, setIsLoggedIn, setUsername } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const handleDropdownToggle = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const sendLogoutRequest = async () => {
    try {
      const response = await fetch(`${baseUrl}/auth/logout`, {
        method: "POST",
        headers: {
          Authorization: localStorage.getItem("session_id") || "",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to logout");
      }
    } catch (error) {
      alert(`Error: ${error}`);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername(null);
    setIsDropdownOpen(false);
    sendLogoutRequest();
    localStorage.removeItem("session_id");
    localStorage.removeItem("username");
    navigate("/");
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const signIn = () => {
    if (isLoggedIn) {
      return;
    }
    navigate("/login", { state: { fromLockIcon: true } });
  };
  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">
          <p className="app-name-p">EduForces</p>
        </Link>
      </div>
      <ul className="nav-links">
        {!isLoggedIn && (
          <li>
            <NavLink
              to="/login"
              className={({ isActive }) => (isActive ? "active" : undefined)}
            >
              Login
            </NavLink>
          </li>
        )}
        <li>
          <NavLink
            to="/"
            end
            className={({ isActive }) => (isActive ? "active" : undefined)}
          >
            Home
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/contest"
            className={({ isActive }) => (isActive ? "active" : undefined)}
          >
            Contest
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/forum"
            className={({ isActive }) => (isActive ? "active" : undefined)}
          >
            Forum
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/study-space"
            className={({ isActive }) => (isActive ? "active" : undefined)}
          >
            Study Space
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/donate"
            className={({ isActive }) => (isActive ? "active" : undefined)}
          >
            Donate
          </NavLink>
        </li>
      </ul>

      <div className="auth-icon" onClick={signIn}>
        {isLoggedIn ? (
          <div
            className="auth-dropdown"
            onClick={handleDropdownToggle}
            ref={dropdownRef}
          >
            <span
              style={{ fontSize: "16px", marginLeft: "5px", cursor: "pointer" }}
            >
              {username}
            </span>
            {isDropdownOpen && (
              <div className="dropdown-menu">
                <div onClick={() => navigate(`/user`)}>View Profile</div>
                <div onClick={handleLogout}>Logout</div>
              </div>
            )}
          </div>
        ) : (
          <FaLock size={16} />
        )}
      </div>
    </nav>
  );
};

export default NavBar;
