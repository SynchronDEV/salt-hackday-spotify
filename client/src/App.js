import React from 'react';
import Playlist from './components/playlist/playlist';
import Navbar from './components/navbar/navbar';
import Footer from './components/footer/footer';
import './App.scss';

function App() {
  const [playlists, setPlaylists] = React.useState([]);
  const [accessCookie, setAccessCookie] = React.useState('');
  const [trackUris, setTrackUris] = React.useState([]);
  const [refreshCompleted, setRefreshCompleted] = React.useState(false);

  React.useEffect(() => {
    const cookie = document.cookie.split('=')[1];
    setAccessCookie(cookie);
  }, [])

  const getPlaylists = () => {
    
    const accessObject = { token: accessCookie }
    fetch('/playlists', { method: 'POST', 
                          headers: { 'Content-Type': 'application/json' }, 
                          body: JSON.stringify(accessObject)
                        })
      .then(res => res.json())
      .then(data => {
        console.log(data[0]);
        setPlaylists(data[0])
      })
      .catch(e => console.error(e));
  }

  const addSameTracksBackToPlaylist = (token, playlistId, trackUris) => {
    const addObject = { token, tracks: trackUris, playlistId };
    fetch('/playlists/tracks/add', { method: 'POST', 
                          headers: { 'Content-Type': 'application/json' }, 
                          body: JSON.stringify(addObject)
                        })
      .then(res => res.json())
      .then(() => {
        setRefreshCompleted(true);
      })
      .catch(e => console.error(e));
  }
  const sendUrisToBackendForRemoval = (token, playlistId, trackUris) => {
    const deleteObject = { token, tracks: trackUris, playlistId };
    fetch('/playlists/tracks', { method: 'DELETE', 
                          headers: { 'Content-Type': 'application/json' }, 
                          body: JSON.stringify(deleteObject)
                        })
      .then(res => res.json())
      .then(() => {
        addSameTracksBackToPlaylist(deleteObject.token, deleteObject.playlistId, trackUris);
      })
      .catch(e => console.error(e));

      // send playlistId & arrayOfUris to back-end
  }
  const getPlaylistTracks = (playlistId) => {
    const accessObject = { token: accessCookie, playlistId }
    fetch('/playlists/tracks', { method: 'POST', 
                          headers: { 'Content-Type': 'application/json' }, 
                          body: JSON.stringify(accessObject)
                        })
      .then(res => res.json())
      .then(songData => {
        const trackUris = songData.items.map(song => {
          const uriObject = {uri: song.track.uri};
          return uriObject;
        });
        console.log('SONGDATA', songData);
        setTrackUris(trackUris);
        sendUrisToBackendForRemoval(accessObject.token, accessObject.playlistId, trackUris);
      })
      .catch(e => console.error(e));
  }

  
  return (
    <div className="App">
      <Navbar />
      <section className="body">
        <a href="http://localhost:8080/login">
          <button className="btn--login">Login to Spotify</button>
        </a>
        <div className="playlists">
        <h3>Select Your Playlist:</h3>
        <button onClick={getPlaylists}>Get my Playlists</button><br/>
        <div className="playlists--wrapper">
          <div className="playlists--container">
          {playlists.map((playlist, index) => {
            // return (<button key={index} onClick={() => getPlaylistTracks(playlist.id)}>{playlist.name}</button>)
            console.log(playlist);
            return (<Playlist key={index} playlist={playlist} getPlaylistTracks={getPlaylistTracks}/>)
          })}
          </div>
        </div>
        </div>
        
      </section>
      <Footer/>
    </div>
  );
}
//Remove format
// { "banana": [
// { "uri": "spotify:track:4iV5W9uYEdYUVa79Axb7Rh" },
// { "uri": "spotify:track:1301WleyT98MSxVHPZCA6M" }, 
// { "uri": "spotify:episode:512ojhOuo1ktJprKbVcKyQ" }
// ]}

// Add format
// {"pancake": [
// "spotify:track:4iV5W9uYEdYUVa79Axb7Rh",
// "spotify:track:1301WleyT98MSxVHPZCA6M", 
// "spotify:episode:512ojhOuo1ktJprKbVcKyQ"
// ]}
export default App;
