import React from 'react';
import appLogo from '../../assets/logo_new.webp';
import './LoginPage.css';
import Button from '../../components/Button';

const handleClick = () => {
  alert("Button clicked!");
};

const LoginPage: React.FC = () => {
  return (
    <div className="logo-text-container">
      <div className='intro-text'>
        <p className="text-main">EduForces</p>
        <p className="text-sub">Choose EduForces − choose the success!</p>
        <Button label="Sign In" onClick={handleClick}></Button>
      </div>

      <img src={appLogo} alt="EduForces logo" className="logo" />
    </div>
  )
}

export default LoginPage;
