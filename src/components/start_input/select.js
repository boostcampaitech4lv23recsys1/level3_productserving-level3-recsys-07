import React, { useState, useEffect } from 'react';
import Dropdown from '../spotifyAPI/Dropdown';
import Listbox from '../spotifyAPI/Listbox';
import Detail from '../spotifyAPI/Detail';
import { Credentials } from '../spotifyAPI/Credentials';
import axios from 'axios';

const Select = () => {
  
  const spotify = Credentials();  

  const [token, setToken] = useState('');  
  const [genres, setGenres] = useState({selectedGenre: '', listOfGenresFromAPI: []});
  const [playlist, setPlaylist] = useState({selectedPlaylist: '', listOfPlaylistFromAPI: []});
  const [tracks, setTracks] = useState({selectedTrack: '', listOfTracksFromAPI: []});
  const [trackDetail, setTrackDetail] = useState(null);

  const [trackList, setTrackList] = useState([]);

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

      axios('https://api.spotify.com/v1/browse/categories?locale=sv_US', {
        method: 'GET',
        headers: { 'Authorization' : 'Bearer ' + tokenResponse.data.access_token}
      })
      .then (genreResponse => {        
        setGenres({
          selectedGenre: genres.selectedGenre,
          listOfGenresFromAPI: genreResponse.data.categories.items
        })
      })
    });

  }, [genres.selectedGenre, spotify.ClientId, spotify.ClientSecret]); 

  const genreChanged = val => {
    setGenres({
      selectedGenre: val, 
      listOfGenresFromAPI: genres.listOfGenresFromAPI
    });

    axios(`https://api.spotify.com/v1/browse/categories/${val}/playlists?limit=10`, {
      method: 'GET',
      headers: { 'Authorization' : 'Bearer ' + token}
    })
    .then(playlistResponse => {
      setPlaylist({
        selectedPlaylist: playlist.selectedPlaylist,
        listOfPlaylistFromAPI: playlistResponse.data.playlists.items
      })
    });

  }

  const playlistChanged = val => {
    setPlaylist({
      selectedPlaylist: val,
      listOfPlaylistFromAPI: playlist.listOfPlaylistFromAPI
    });
  }

  const buttonClicked = e => {
    e.preventDefault();

    axios(`https://api.spotify.com/v1/playlists/${playlist.selectedPlaylist}/tracks?limit=10`, {
      method: 'GET',
      headers: {
        'Authorization' : 'Bearer ' + token
      }
    })
    .then(tracksResponse => {
      setTracks({
        selectedTrack: tracks.selectedTrack,
        listOfTracksFromAPI: tracksResponse.data.items
      })
    });
  }

  const listboxClicked = val => {
    const currentTracks = [...tracks.listOfTracksFromAPI];
    const trackInfo = currentTracks.filter(t => t.track.id === val);

    setTrackDetail(trackInfo[0].track);
    setTrackList(prevArray => [...prevArray, trackInfo[0].track.name]);
  }

  const resultButtonClicked = (trackList) => {
    if (trackList.length < 5){
      alert("Select More than 5");
    }
    else {
      fetch('http://localhost:8000/trackList', {
        method: "POST",
        body: JSON.stringify(trackList) ,
        headers: { "Content-Type": "application/json" }
      })
      .then(response => response.json())
      .then(data => {
          console.log(data)
      })
      .catch(error => {
          console.error('Error:', error)
      })
    }
  }

  return (
    <div className="select_container" id='select_container'>
      <form onSubmit={buttonClicked}>
        <div className='select_content'>
          <div className='drop_down_div'>
            <Dropdown label="Genre" options={genres.listOfGenresFromAPI} selectedValue={genres.selectedGenre} changed={genreChanged} />
            <Dropdown label="Playlist" options={playlist.listOfPlaylistFromAPI} selectedValue={playlist.selectedPlaylist} changed={playlistChanged} />
            <button type='submit' className="submit_button" id='select_search_submit_button'>
              Search
            </button>
          </div>
          <div className="track_detail_list">
            <Listbox items={tracks.listOfTracksFromAPI} clicked={listboxClicked} />
            {trackDetail && <Detail {...trackDetail}/>}
            {/* <button id="submit_result_on_select_item"><span>PlayList URL</span> RESULT </button> */}
          </div>
          <div className='submit_button_wrapper'>
            <button className='submit_button' onClick={() => resultButtonClicked(trackList)}> START </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Select;