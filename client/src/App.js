import React from 'react';
import './App.css';

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
        console.log(data);
        setPlaylists(data.items)
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
      <a href="http://localhost:8080/login">
        <button>Hit me!</button>
      </a>
      <button onClick={getPlaylists}>Get my Playlists</button>

      <br /><br /><br /><br /><br />
      <div className="playlists">
        {playlists.map((playlist, index) => {
          return (<button key={index} onClick={() => getPlaylistTracks(playlist.id)}>{playlist.name}</button>)
        })}
      </div>
      <br /><br /><br /><br /><br />
      {trackUris.map((uri, index) => {
          return (<button key={index}>{uri.uri}</button>)
        })}
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
