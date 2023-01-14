import React, { useState } from 'react';

const HandleUrl = () => {
  const [playlistUrl, setPlaylistUrl] = useState('');
  const [playlistName, setPlaylistName] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    fetch(playlistUrl, {
      headers: {
        'Authorization': 'Bearer YOUR_ACCESS_TOKEN',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setPlaylistName(data.name);
      });
  }

  return (
    <div  id='handleurl_container'>
      <div className='hadleurl_contents'>
        <h4>Enter a Spotify Playlist URL</h4>
        <form onSubmit={handleSubmit}>
          <input type="text" value={playlistUrl} placeholder="Enter Your URL" onChange={(event) => setPlaylistUrl(event.target.value)} />
          <button type="submit">START</button>
        </form>
        <h2>{playlistName}</h2>
      </div>
    </div>
  );
};

export default HandleUrl;