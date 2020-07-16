import React from 'react'
import * as _ from 'lodash';
import './playlist.scss'

const playlist = ({ playlist, getPlaylistTracks }) => {



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
      <a href={playlist.external_urls.spotify} target="_blank"><button type="button" className="btn btn-view">View Playlist</button></a>
      <button type="button" className="btn btn-refresh" onClick={() => getPlaylistTracks(playlist.id)}>Refresh Playlist</button>
      </div>
    </div>
  )
}

export default playlist;

// <Card style={{ width: '18rem' }}>
    //   <Card.Img variant="top" src="holder.js/100px180" />
    //   <Card.Body>
    //     <Card.Title>Card Title</Card.Title>
    //     <Card.Text>
    //       Some quick example text to build on the card title and make up the bulk of
    //       the card's content.
    //     </Card.Text>
    //     <Button variant="primary">Go somewhere</Button>
    //   </Card.Body>
    // </Card>
    // ----------------------------------
    // <div classNameName="playlist">
    //   <div classNameName="playlist--header">
    //   <h6>Playlist</h6>
    //   <h4>{playlist.name}</h4>
    //   </div>

    //   <h5>{playlist.tracks.total} Tracks</h5>
      
    //   <img src={src} alt="playlist_image" />
    //   <div classNameName="actions">
    //     <a href={playlist.external_urls.spotify}><button>View Playlist (On Spotify)</button></a>
    //     <button onClick={() => getPlaylistTracks(playlist.id)}>Refresh Playlist</button>
    //     {/* <div className="btn-group" role="group" aria-label="...">
    //       <button type="button" className="btn btn-default">Left</button>
    //       <button type="button" className="btn btn-default">Middle</button>
    //       <button type="button" className="btn btn-default">Right</button>
    //     </div> */}
    //   </div>
    // </div>
    // ----