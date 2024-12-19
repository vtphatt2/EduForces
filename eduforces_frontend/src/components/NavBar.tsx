// NavBar.tsx
import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FaLock } from 'react-icons/fa'; 
import { useAuth } from '../context/AuthContext';
import './NavBar.css';

const NavBar: React.FC = () => {
  const { user } = useAuth();
  
  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">
          <p className='app-name-p'>EduForces</p>
        </Link>
      </div>
      <ul className="nav-links">
        <li>
          <NavLink
            to="/login"
            className={({ isActive }) => (isActive ? 'active' : undefined)}
          >
            Login
          </NavLink>
        </li>
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
        {user ? (
          <span style={{ fontSize: '16px' }}>{user.name}</span>
        ) : (
          <>
            <FaLock size={16}/> 
            <span style={{ fontSize: '16px', marginLeft: '5px' }}>Login</span>
          </>
        )}
      </div>

    </nav>
  );
};

export default NavBar;
