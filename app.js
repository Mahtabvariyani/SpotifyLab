require('dotenv').config();
let path=require('path')
const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');
require('dotenv').config();

const app = express();

app.use(express.static(__dirname + '/public'));
// Set the view engine to HBS
app.set('view engine','hbs');
// Set the views directory to the "views" folder
app.set('views',path.join(__dirname,'views'));
// Register your layout file
hbs.registerPartials(path.join(__dirname,'views'));
// Specify the layout you want to use (layout.hbs)
app.set('views options',{layout:'layout'});
// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

app.get('/search', (req, res) => {
  const myQuery = req.query.artistQuery;

  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .then(() => spotifyApi.searchArtists(myQuery))
    .then(data => {
      console.log('The received data from the API: ', data.body);
      // Render the search results template with the data
      res.render("artist-search-results", { artists: data.body.artists.items });
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
});

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
