import React from 'react'
// import { Link } from 'react-router-dom';
import './login.scss';

function login() {
  return (
    <div className="login">
          <h1>Login to get started</h1>

          <a href="http://localhost:8080/login">
            <button className="btn--login">Login to Spotify</button>
            </a>
    </div>
  )
}

export default login
