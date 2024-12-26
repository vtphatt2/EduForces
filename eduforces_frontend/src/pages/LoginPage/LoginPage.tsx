import React, { useEffect } from 'react';
import appLogo from '../../assets/logo_new.webp';
import './LoginPage.css';
import Button from '../../components/Button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// Environment variables for sensitive data
const clientId = "173187182094-lol8u5tku7e1bpi6br0tcfsqd4huqtag.apps.googleusercontent.com";
const backendAuthEndpoint = 'http://localhost:8080/api/v1/auth/google';
const redirectUri = 'http://localhost:5173/login';

// Function to handle the click event for Google OAuth2 login
const handleClick = () => {
  const scope = 'openid email profile';
  const responseType = 'code';

  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=${responseType}&scope=${scope}`;
  
  // Redirect the user to Google's login page
  window.location.href = googleAuthUrl;
};

const LoginPage: React.FC = () => {
  const { setIsLoggedIn, setUsername } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const authCode = urlParams.get('code');
    console.log('Auth code:', authCode);

    if (authCode) {
      // Send the authorization code to the backend
      fetch(backendAuthEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: authCode }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            console.log('Login successful:', data);

            // Store the session ID in local storage
            localStorage.setItem("session_id", data.session_id);
            localStorage.setItem("username", data.user.username);

            setIsLoggedIn(true);
            setUsername(data.user.username);
            // Redirect to the home page or dashboard
            navigate('/');
          } else {
            console.error('Login failed:', data.message);
          }
        })
        .catch((error) => console.error('Error during login:', error));
    }
  }, [navigate, setIsLoggedIn, setUsername]);

  return (
    <div className="logo-text-container">
      <div className="intro-text">
        <p className="text-main">EduForces</p>
        <p className="text-sub">Choose EduForces − choose the success!</p>
        <Button label="Sign In" onClick={handleClick}></Button>
      </div>

      <img src={appLogo} alt="EduForces logo" className="logo" />
    </div>
  );
};

export default LoginPage;