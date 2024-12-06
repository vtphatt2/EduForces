import { useState } from 'react'
import appLogo from '../../assets/logo.webp'
import './Login.css'

function App() {
  return (
    <>
      <div className="logo-text-container">
        <div className='intro-text'>
          <p className="text-main">EduForces</p>
          <p className="text-sub">Choose EduForces − choose the success!</p>
          <button className="btn-signin">Sign in</button>
        </div>

        <img src={appLogo} alt="EduForces logo" className="logo" />
      </div>
    </>
  )
}

export default App
