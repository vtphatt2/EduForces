import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FaLock } from 'react-icons/fa'; 
import { useAuth } from "../context/AuthContext";
import './NavBar.css';

const NavBar: React.FC = () => {
  const { isLoggedIn, username, setIsLoggedIn, setUsername } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const handleDropdownToggle = () => {
    setIsDropdownOpen(prev => !prev);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername(null);
    localStorage.removeItem("authToken");
    localStorage.removeItem("username");
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">
          <p className='app-name-p'>EduForces</p>
        </Link>
      </div>
      <ul className="nav-links">
        {!isLoggedIn && (
          <li>
            <NavLink
              to="/login"
              className={({ isActive }) => (isActive ? 'active' : undefined)}
            >
              Login
            </NavLink>
          </li>
        )}
        <li>
          <NavLink
            to="/"
            end
            className={({ isActive }) => (isActive ? 'active' : undefined)}
          >
            Home
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/contest"
            className={({ isActive }) => (isActive ? 'active' : undefined)}
          >
            Contest
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/forum"
            className={({ isActive }) => (isActive ? 'active' : undefined)}
          >
            Forum
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/study-space"
            className={({ isActive }) => (isActive ? 'active' : undefined)}
          >
            Study Space
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/donate"
            className={({ isActive }) => (isActive ? 'active' : undefined)}
          >
            Donate
          </NavLink>
        </li>
      </ul>

      <div className="auth-icon">
        {isLoggedIn ? (
          <div
            className="auth-dropdown"
            onClick={handleDropdownToggle}
            ref={dropdownRef}
          >
            <span style={{ fontSize: '16px', marginLeft: '5px', cursor: 'pointer' }}>
              {username}
            </span>
            {isDropdownOpen && (
              <div className="dropdown-menu">
                <div onClick={() => alert('View Profile')}>View Profile</div>
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
