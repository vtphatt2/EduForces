// src/pages/Login/LoginPage.tsx
import React from 'react';
import appLogo from '../../assets/logo_new.webp';
import './LoginPage.css';
import { Link } from 'react-router-dom';

const LoginPage: React.FC = () => {
  return (
    <div className="logo-text-container">
      <div className='intro-text'>
        <p className="text-main">EduForces</p>
        <p className="text-sub">Choose EduForces − choose the success!</p>
        <Link to="/login">
          <button className="btn-signin">Sign in</button>
        </Link>
      </div>

      <img src={appLogo} alt="EduForces logo" className="logo" />
    </div>
  )
}

export default LoginPage;
