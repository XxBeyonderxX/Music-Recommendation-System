const spotifyWebApi = require("spotify-web-api-node");
const express = require("express");

// access token 
//BQCpJNHcxUOk5EiUNomCdVQD2twyS5wL5Dr6pH--ErVVNR2Mj85m3bAlXP8fV4YCE3B9v6sV2B9PZ3zwfBt_RhArxo02tyIZp6NlNMezmK1JCbV2hM5cPXZhdQdyLkyzi9HeNEKuLXkoupDt1kGKO_AbhMKBj-HGZEc8OmtfVQrckOmra8ggG83J_gNrRbnd3INdGMSJbrdkkFgzXxjcyfDRqvClPKuZROOSMmAzscb3qd4fZvZ_lct7vWy70ROUqcTGwVzbqr76VhYTpoclECASO-MmnFA_D2-ngUDVEWdz-4oAndgtBN2z_0wZTnDfBnQ4vtqD8VJRianOHaAA8Q

// refresh token 
//AQCB999UOFRjbhYK7q_38-pv7RWh2cBenZcoZgivc1e5Mx6J59O8NhMt8acMM99CYcV3mdDkvDFTNIy6P_4z5lpXGePACW_srM9Klpd8huYg_3wb2tTYHRMK6AOISezcNw8

const scopes = [
  "ugc-image-upload",
  "user-read-playback-state",
  "user-modify-playback-state",
  "user-read-currently-playing",
  "streaming",
  "app-remote-control",
  "user-read-email",
  "user-read-private",
  "playlist-read-collaborative",
  "playlist-modify-public",
  "playlist-read-private",
  "playlist-modify-private",
  "user-library-modify",
  "user-library-read",
  "user-top-read",
  "user-read-playback-position",
  "user-read-recently-played",
  "user-follow-read",
  "user-follow-modify",
];

const spotifyApi = new spotifyWebApi({
    clientId: '9ed4a8b834b247f9a165d84a2ecb63d1',
    clientSecret: 'c9da736b9135452584a9845c82e4d33f',
    redirectUri: 'http://localhost:3000/callback'
});

const app = express();

app.get('/login', (req, res)=>{
    res.redirect(spotifyApi.createAuthorizeURL(scopes));
});

app.get('/callback', (req, res)=>{
    const error = req.query.error;
    const code = req.query.code;
    const state = req.query.state;

    if (error) {
        console.log(`callback error : ${error}`);
        res.send(`callback error : ${error}`);
        return;
    }

    spotifyApi
      .authorizationCodeGrant(code)
      .then(data => {
        const access_token = data.body['access_token'];
        const refresh_token = data.body['refresh_token'];
        const expires_in = data.body['expires_in'];
  
        spotifyApi.setAccessToken(access_token);
        spotifyApi.setRefreshToken(refresh_token);
  
        console.log('access_token:', access_token);
        console.log('refresh_token:', refresh_token);
  
        console.log(
          `Sucessfully retreived access token. Expires in ${expires_in} s.`
        );

        res.send('Success! You can now close the window.');
  
        setInterval(async () => {
          const data = await spotifyApi.refreshAccessToken();
          const access_token = data.body['access_token'];
  
          console.log('The access token has been refreshed!');
          console.log('access_token:', access_token);
          spotifyApi.setAccessToken(access_token);
        }, expires_in / 2 * 1000);
      })
      .catch(error => {
        console.error('Error getting Tokens:', error);
        res.send(`Error getting Tokens: ${error}`);
      });
});

app.listen(3000, ()=>{
    console.log(`Listening on port:3000`);
});
// https://github.com/tombaranowicz/SpotifyPlaylistExport/blob/master/getMe.js