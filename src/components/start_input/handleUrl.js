import React, { useState, useEffect } from 'react';
import { Credentials } from '../spotifyAPI/Credentials';
import axios from 'axios';

const HandleUrl = () => {

  const spotify = Credentials();  
  const style = "border-radius:12px";
  const playlistArray = [];

  const [token, setToken] = useState('');  
  const [playlistUrl, setPlaylistUrl] = useState('https://open.spotify.com/playlist/6i37SY1yWdDhzVHBUFX4Rq');
  const [src, setSrc] = useState('');
  const [results, setResults] = useState([]);

  const [newPlayListId, setNewPlayListId] = useState("");
  const [newPlayListSrc, setNewPlayListSrc] = useState("");

  const APIBASE = 'https://api.spotify.com/v1/playlists/';
  const playlistID = playlistUrl.split('/').pop()


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


  const handleSubmit = async (event) => {
    event.preventDefault();

    await fetch(APIBASE + playlistID + '/tracks', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        data.items.map((trackObj) => playlistArray.push(trackObj.track.name));
        console.log(`playlistArray: ${playlistArray}`);
        setSrc(["https://open.spotify.com/embed/playlist/" + playlistID + "?utm_source=generator"]);
      });
    
    const response = await fetch(`http://localhost:8000/recplaylist/`, {
      method: 'POST',
      body: JSON.stringify(playlistArray),
      headers: { 'Content-Type': 'application/json' },
    })
    .then((response) => response.json())
    .then((playlist_id) => {
      setNewPlayListId(playlist_id)
    });
  }


  useEffect(() => {
    axios(APIBASE + newPlayListId + '/tracks', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then((data) => {
        setNewPlayListSrc(["https://open.spotify.com/embed/playlist/" + newPlayListId + "?utm_source=generator"]);
      });
  },[newPlayListId])





  return (
    <div  id='handleurl_container'>
      <div className='hadleurl_contents'>
        <h4 className='input_url_text'>Enter a Spotify Playlist URL</h4>
        <form onSubmit={handleSubmit}>
          <input className="input_url" type="text" value={playlistUrl} placeholder="Enter Your URL" onChange={(event) => setPlaylistUrl(event.target.value)} />
          <button type='submit' className="submit_button"> START </button>
        </form>
      </div>
      <div className="output_playlist">
          <div className="playlist_cls">
            <div className='playlist_content_div'>
              <iframe className="iframe_embed" style={{style}} src={src}
                  width="50%" height="100%" frameBorder="0" allowFullScreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
            </div>
            <div className='playlist_content_div2'>
              <button type='submit' className="submit_button"> GET RECOMMAND </button>
            </div>
          </div>
          
      </div>

      <div className='recommand_result_playlist'>
        <div className="playlist_cls">
  
              <iframe className="iframe_embed" style={{style}} src={newPlayListSrc}
                  width="50%" height="352" frameBorder="0" allowFullScreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
            </div>
        </div>
    </div>
  );
};

export default HandleUrl;