import React, { useState, useEffect } from 'react';
import { Credentials } from '../spotifyAPI/Credentials';
import axios from 'axios';
import PlayListOutput from '../output/playlistOutput';

const HandleUrl = () => {

  const spotify = Credentials();  

  const [token, setToken] = useState('');  
  const [playlistUrl, setPlaylistUrl] = useState('');
  const [playlistData, setPlaylistData] = useState('');
  const [playlist, setPlaylist] = useState('');

  const [isButtonClick, setIsButtonClick] = useState(false);

  useEffect(() => {
    axios('https://accounts.spotify.com/api/token', {
      headers: {
        'Content-Type' : 'application/x-www-form-urlencoded',
        'Authorization' : 'Basic ' + btoa(spotify.ClientId + ':' + spotify.ClientSecret)      
      },
      data: 'grant_type=client_credentials',
      method: 'POST'
    })
    .then(tokenResponse => {      
      setToken(tokenResponse.data.access_token);
    });
  });  

  const handleSubmit = (event) => {
    event.preventDefault();
    
    const APIBASE = 'https://api.spotify.com/v1/playlists/';
    const playlistID = playlistUrl.split('/').pop();
    const playlistArray = [];


    fetch(APIBASE + playlistID + '/tracks', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setPlaylistData(data);
      });

    playlistData.tracks.items.map((trackObj) => playlistArray.push(trackObj.track.name));
    console.log(playlistArray);
    setPlaylist([...playlistArray]);

  }

  useEffect(() => {
    console.log('MyComponent re-rendered');
  }, [isButtonClick]);


  const clickHandler = e => {
    e.preventDefault();
    setIsButtonClick(!isButtonClick);
  };



  return (
    <div  id='handleurl_container'>
      <div className='hadleurl_contents'>
        <h4 className='input_url_text'>Enter a Spotify Playlist URL</h4>
        <form onSubmit={handleSubmit}>
          <input className="input_url" type="text" value={playlistUrl} placeholder="Enter Your URL" onChange={(event) => setPlaylistUrl(event.target.value)} />
          <button id="playlist_submit_button" onClick={clickHandler}> START </button>
          {/* {isButtonClick && <PlayListOutput src={playlistUrl}/>} */}
        </form>
        <h2>{playlist}</h2>
      </div>
      
    </div>
  );
};

export default HandleUrl;