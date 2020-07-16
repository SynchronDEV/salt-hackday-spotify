import React from 'react';
import Playlist from './components/playlist/playlist';
import Navbar from './components/navbar/navbar';
import Footer from './components/footer/footer';
import Login from './components/login/login';
import './App.scss';

function App() {
  const [playlists, setPlaylists] = React.useState([]);
  const [accessCookie, setAccessCookie] = React.useState('');
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  React.useEffect(() => {
    console.log('FIRST!');
    const cookie = document.cookie.split('=')[1];
    
    setAccessCookie(cookie);
    const regex = RegExp('access_token');
    const testRegex = regex.test(window.location.hash);
    setIsLoggedIn(testRegex)
    if(testRegex && cookie) {
      getPlaylists(cookie);
    }
  }, [])

  const getPlaylists = (cookie) => {
    console.log('GOT HERE');
    const accessObject = { token: cookie }
    console.log('OBJ', accessObject)
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
        sendUrisToBackendForRemoval(accessObject.token, accessObject.playlistId, trackUris);
      })
      .catch(e => console.error(e));
  }

  
  return (
    <div className="App">
      <Navbar />
      <section className="body">
        {isLoggedIn ? <div className="playlists">
        <h3>Select Your Playlist:</h3>
        <div className="playlists--wrapper">
          <div className="playlists--container">
          {playlists.map((playlist, index) => {
            console.log(playlist);
            return (<Playlist key={index} playlist={playlist} getPlaylistTracks={getPlaylistTracks}/>)
          })}
          </div>
        </div>
        </div> : <Login /> }

      </section>
      <Footer/>
    </div>
  );
}
export default App;
