import React from 'react'
import './navbar.scss';

function navbar() {
  return (
    <div className="navbar">
      <a href="/">
        <div className="navbar--top">
          <span className="navbar--logo">Spotify</span>
          <span className="navbar--title">Freshlist</span>
        </div>

      </a>
      <span className="navbar--desc">Update your Spotify Playlists to have the freshest 'Date Added' time.</span>


    </div>
  )
}

export default navbar;
