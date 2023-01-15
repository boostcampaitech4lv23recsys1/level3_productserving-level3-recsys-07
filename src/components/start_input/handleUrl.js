import React, { useState, useEffect } from 'react';
import { Credentials } from '../spotifyAPI/Credentials';
import axios from 'axios';

const HandleUrl = () => {

  const spotify = Credentials();  
  const style = "border-radius:12px";

  const [token, setToken] = useState('');  
  const [playlistUrl, setPlaylistUrl] = useState('');
  const [playlistData, setPlaylistData] = useState('');
  const [playlist, setPlaylist] = useState('');
  const [src, setSrc] = useState('');


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
  }, [token]);

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
        data.items.map((trackObj) => playlistArray.push(trackObj.track.name));
        setPlaylist([...playlistArray]);

        setSrc(["https://open.spotify.com/embed/playlist/" + playlistUrl + "?utm_source=generator"])
    
      });
    
    // playlistData가 setPlaylistData에서 안먹혀서 위에서 수정
    // playlistData.tracks.items.map((trackObj) => playlistArray.push(trackObj.track.name));
    // setPlaylist([...playlistArray]);
    // setIsButtonClick(!isButtonClick);

  }


  return (
    <div  id='handleurl_container'>
      <div className='hadleurl_contents'>
        <h4 className='input_url_text'>Enter a Spotify Playlist URL</h4>
        <form onSubmit={handleSubmit}>
          <input className="input_url" type="text" value={playlistUrl} placeholder="Enter Your URL" onChange={(event) => setPlaylistUrl(event.target.value)} />
          <button type='submit' id="playlist_submit_button"> START </button>
        </form>
      </div>
        <div className="output_playlist">
            <div className="playlist_cls">
              <iframe className="iframe_embed" style={{style}} src={src}
                  width="50%" height="352" frameBorder="0" allowFullScreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
            </div>
        </div>
      
    </div>
  );
};

export default HandleUrl;