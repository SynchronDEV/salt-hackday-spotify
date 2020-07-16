const express = require("express");
const axios = require("axios");
const cors = require("cors");
const querystring = require("querystring");
const cookieParser = require("cookie-parser");
const bodyParser = require('body-parser')

const client_id = "a715c856c2a34af8a909afa11ee5776a"; // Client id
const client_secret = "cc857b696ba34860b34dab4ad3725d82"; // Secret
const redirect_uri = "http://localhost:8080/callback"; // Redirect uri

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
const generateRandomString = function(length) {
  let text = "";
  let possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

const stateKey = "spotify_auth_state";

const app = express();

app
  .use(express.static(__dirname + "/public"))
  .use(cors())
  .use(cookieParser())
  .use(bodyParser.json());

app.get("/", (req, res) => {
  res.redirect("http://localhost:3000/")
});

app.get("/login", function(req, res) {
  let state = generateRandomString(16);
  res.cookie(stateKey, state);

  // application requests authorization
  let scope = "user-read-private user-read-email playlist-read-private playlist-read-collaborative playlist-modify-public playlist-modify-private user-top-read";
  res.redirect(
    "https://accounts.spotify.com/authorize?" +
      querystring.stringify({
        response_type: "code",
        client_id: client_id,
        scope: scope,
        redirect_uri: redirect_uri,
        state: state
      })
  );
});

app.get("/callback", function(req, res) {
  // application requests refresh and access tokens after checking the state parameter
  let code = req.query.code || null;
  let state = req.query.state || null;
  let storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== storedState) {
    res.redirect("/#" + querystring.stringify({ error: "state_mismatch" }));
  } else {
    res.clearCookie(stateKey);
    // application requests authorization
    const params = {
      client_id,
      client_secret,
      redirect_uri,
      code,
      grant_type: "authorization_code"
    };
    axios({
      method: "post",
      url: "https://accounts.spotify.com/api/token",
      params,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    })
      .then(response => {
        const access_token = response.data.access_token;
        const refresh_token = response.data.refresh_token;
        axios({
          method: "get",
          url: "https://api.spotify.com/v1/me",
          headers: { Authorization: "Bearer " + access_token }
        })
          .then(() => {
            res.cookie('Access_token', access_token);
            res.redirect(
              "/#" + querystring.stringify({ access_token, refresh_token })
            );
          })
          .catch(e => {
            res.redirect(
              "/#" + querystring.stringify({ error: e.response.data })
            );
          });
      })
      .catch(e => {
        console.error(e.response.data)
        res.redirect(
          "/#" + querystring.stringify({ error: e.response.data.error })
        );
      });
  }
});

app.get("/refresh_token", function(req, res) {
  // requesting access token from refresh token
  const refresh_token = req.query.refresh_token;
  const params = {
    client_id,
    client_secret,
    grant_type: "refresh_token",
    refresh_token: refresh_token
  };
  axios({
    method: "post",
    url: "https://accounts.spotify.com/api/token",
    params,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  })
    .then(response => {
      access_token = response.data.access_token;
      res.send({
        access_token: access_token
      });
    })
    .catch(e => {
      console.error(e.response.data);
    });
});

app.post("/playlists", (req, res) => { // REFACTOR TO GET https://stackoverflow.com/questions/34543622/how-can-i-send-data-through-fetch-api-by-get-request
  const access_token = req.body.token;
  let currentUser = '';
  axios.get('https://api.spotify.com/v1/me/', { headers: { Authorization: `Bearer ${access_token}` } })
  .then(response => {

    currentUser = response.data.uri
    console.log('CURRENTUSER', currentUser);
  })
  .catch(e => console.error(e));
  
  axios.get('https://api.spotify.com/v1/me/playlists?limit=50', { headers: { Authorization: `Bearer ${access_token}` } })
  .then(response => {
    const playlistsOwnedByCurrentUser = response.data.items.filter(playlist => playlist.owner.uri === currentUser)
    res.send([playlistsOwnedByCurrentUser])
  })
  .catch(e => console.error(e));
})

app.post("/playlists/tracks", (req, res) => { // REFACTOR TO GET

  const { token, playlistId } = req.body;
  axios.get(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, { headers: { Authorization: `Bearer ${token}` } })
  .then(response => res.send(response.data))
  .catch(e => console.error(e));
})

app.delete("/playlists/tracks", (req, res) => {

  const { token, tracks, playlistId } = req.body;
  axios.delete(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json charset=utf-8"
    }, data: { "tracks": tracks}
  })
  .then(response => res.send(response.data))
  .catch(e => console.error(e));
})

app.post("/playlists/tracks/add", (req, res) => { //REFACTOR TO /playlists/tracks
  const { token, tracks, playlistId } = req.body;
  const newUriArrayForAdding = tracks.map(({uri}) => uri)
  axios.post(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, { "uris": newUriArrayForAdding },
  {
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json charset=utf-8"
    }
  })
  .then(response => res.send(response.data))
  .catch(e => console.error(e));
})

console.log("Listening on 8080");
app.listen(8080);