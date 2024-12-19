import React from 'react';
import appLogo from '../../assets/logo_new.webp';
import './LoginPage.css';
import Button from '../../components/Button';

const handleClick = () => {
  // alert("Button clicked!");
  // Redirect to Google's OAuth2 Authorization Endpoint
  const clientId = '173187182094-78jo2v9mdfo220t0es0ktnfojsr08koj.apps.googleusercontent.com';
  const redirectUri = 'http://localhost:8080/callback'; // Backend endpoint
  const scope = 'openid email profile';
  const responseType = 'code';

  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=${responseType}&scope=${scope}`;

  window.location.href = googleAuthUrl; // Redirect user
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
