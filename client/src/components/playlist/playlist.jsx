import React from 'react'
import * as _ from 'lodash';
import './playlist.scss';

const Playlist = ({ playlist, getPlaylistTracks }) => {


  const src = _.get(playlist, 'images[0].url', '');
  return (
    <div className="card">
      <div className="card__image-container">
        <img className="card__image" src={src} alt="" />
      </div>
        
        <svg className="card__svg" viewBox="0 0 750 500">

          <path d="M 0 100 Q 50 200 100 250 Q 250 400 350 300 C 400 250 550 150 650 300 Q 750 450 800 400 L 800 500 L 0 500" stroke="transparent" fill="#333"/>
          <path className="card__line" d="M 0 100 Q 50 200 100 250 Q 250 400 350 300 C 400 250 550 150 650 300 Q 750 450 800 400" stroke="pink" strokeWidth="3" fill="transparent"/>
        </svg>
      
      <div className="card__content">
        <h1 className="card__title">{playlist.name}</h1>
      <p>{playlist.tracks.total} Tracks</p>
      
    </div>
    <div className="btn-group" role="group" aria-label="...">
      <a href={playlist.external_urls.spotify} target="_blank" rel="noopener noreferrer"><button type="button" className="btn btn-view">View Playlist</button></a>
      <button type="button" className="btn btn-refresh" onClick={() => 
        getPlaylistTracks(playlist.id)
        }>Refresh Playlist</button>
      </div>
    </div>

  )
}

export default Playlist;