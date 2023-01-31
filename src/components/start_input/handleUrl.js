import React, { useState, useEffect } from 'react';
import { Credentials } from '../spotifyAPI/Credentials';
import axios from 'axios';
import OutputPlayer from '../players/outputPlayer';

const HandleUrl = () => {

  // Set initial variable
  const spotify = Credentials();
  const style = 'border-radius:12px';
  const [token, setToken] = useState('');
  const [playlistUrl, setPlaylistUrl] = useState(
    'https://open.spotify.com/playlist/6yS3dqEDGALDpEukkgRlds'
  );
  const [src, setSrc] = useState('');
  const [results, setResults] = useState([]);

  const [loading, setLoading] = useState(null);   

  const [itemList, setItemList] = useState({track:[], artist:[], track_id:[], artist_id:[]});
  const [spotifyRec, setSpotifyRec] = useState({artist:[], imgurl:[], name:[], source:[], track_id:[]});

  useEffect(() => {
    axios('https://accounts.spotify.com/api/token', {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization:
          'Basic ' + btoa(spotify.ClientId + ':' + spotify.ClientSecret),
      },
      data: 'grant_type=client_credentials',
      method: 'POST',
    }).then((tokenResponse) => {
      setToken(tokenResponse.data.access_token);
    });
  }, [token]);

  
  // Define handle function
  const APIBASE = 'https://api.spotify.com/v1/playlists/';
  const playlistID = playlistUrl.split('/').pop();
  const playlistArray = [];
  const [playListItem, setPlayListItem] = useState([]);
  const [itemfinsih, setItemFinish] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    await fetch(APIBASE + playlistID + '/tracks', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        data.items.map((trackObj, index) => {
          playlistArray.push(trackObj.track.name);
          if(data.items.length-1 === index){
            setItemFinish(true);
          }
          setPlayListItem(prevPlayListItem => [
            ...prevPlayListItem,
            [
              trackObj.track.name,
              trackObj.track.artists[0]['name'],
              trackObj.track.id,
              trackObj.track.artists[0]['id']
            ]
          ]);
        })
        setSrc(['https://open.spotify.com/embed/playlist/' + playlistID]);
      });

    const response = await fetch(`http://27.96.130.130:30001/recplaylist/`, {
      method: 'POST',
      body: JSON.stringify(playlistArray),
      headers: { 'Content-Type': 'application/json' },
    });

    await response.json().then((data) => {
      setResults(data.playlist);
      setLoading(false);
    });
  };

  const [itemListSetFinish, setItemListSetFinish] = useState(false);

  useEffect(() => {
    if(itemfinsih){
      playListItem.map(item => {
        let new_track    = item[0]
        let new_artist    = item[1]
        let new_track_id  = item[2]
        let new_artist_id = item[3]
  
        setItemList(prevItemList => {
          return {
              ...prevItemList, 
              track: [...prevItemList.track, new_track],
              artist: [...prevItemList.artist, new_artist],
              track_id: [...prevItemList.track_id, new_track_id],
              artist_id: [...prevItemList.artist_id, new_artist_id]
          }
      })
      })
        setItemListSetFinish(true)
    }
  }, [playListItem])

  useEffect(() => {
    if(itemListSetFinish){
      let track_id_str, artist_id_str
  
      track_id_str = itemList.track_id[0];
      artist_id_str = itemList.artist_id[0];
      console.log("itemList", itemList);
      console.log("track_id_str , artist_id_str", track_id_str,artist_id_str);
  
      let query = `limit=10&market=kr&seed_artists=${artist_id_str}&seed_genres=kpop&seed_tracks=${track_id_str}`;
      fetch("https://api.spotify.com/v1/recommendations?" + query, {
          method: 'GET',
          headers: {
              "Accept": "application/json",
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
          }
      }).then(response => response.json())
      .then(data => data.tracks.map(result => {
          let new_artist = result.artists[0]['name'];
          let new_imgurl = result.album.images[0]['url']
          let new_name = result.name
          let new_source = result.preview_url
          let new_track_id = result.id
          setSpotifyRec(prevItemList => {
              return {
                  ...prevItemList, 
                  artist: [...prevItemList.artist, new_artist],
                  imgurl: [...prevItemList.imgurl, new_imgurl],
                  name: [...prevItemList.name, new_name],
                  source: [...prevItemList.source, new_source],
                  track_id: [...prevItemList.track_id, new_track_id]
                }
            })
        })
      )
      // back으로 작동시 기존에 남아있는게 있어서 다 끝나면 한번 초기화
      setItemList({track:[], artist:[], track_id:[], artist_id:[]});
      setSpotifyRec({artist:[], imgurl:[], name:[], source:[], track_id:[]});
    }
  }, [itemListSetFinish])



  const newData = []
  const [spotifyResult, setSpotifyResult] = useState([])
  useEffect(()=>{
      if (spotifyRec.name.length === 10){
          for (let i = 0; i < spotifyRec.name.length; i++) {
              newData.push({
                artist: spotifyRec.artist[i],
                imgurl: spotifyRec.imgurl[i],
                name: spotifyRec.name[i],
                source: spotifyRec.source[i],
                track_id: spotifyRec.track_id[i],
              });
          }
          setSpotifyResult(newData);
      }
  }, [spotifyRec])


return (
  <div  id='handleurl_container'>
    <div className='hadleurl_contents'>
      <h4 className='input_url_text'>Enter a Spotify Playlist URL</h4>
      <p> spotify 플레이리스트 url을 넣으세요</p>
      <form onSubmit={handleSubmit}>
        <input className="input_url" type="text" value={playlistUrl} placeholder="Enter Your URL" onChange={(event) => setPlaylistUrl(event.target.value)} />
        <button type='submit' className="submit_button"> START </button>
      </form>
    </div>

    <div className="output_playlist">
      <div className="playlist_cls">
        <div className='playlist_content_div'>
          <h2> Check my playlist </h2>
          <iframe className="iframe_embed" style={{style}} src={src}
              width="50%" height="100%" frameBorder="0" allowFullScreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
        </div>
        <div className='playlist_content_div2'>
          <button type='submit' className="submit_button"> GET RECOMMAND </button>
        </div>
      </div>
    </div>

    {/* <OutputPlayer results={results} /> */}
    {loading ? (
                <div className="loader_wrapper">
                    <div className="loader"/>
                </div>
            ) : (
                <div className="result_output_player_wrapper">
                    <div className="our_output_player_wrapper">
                        <OutputPlayer results={results} goodRec="ourRecGood"/>
                    </div>
                    <div className="spotify_output_player_wrapper">
                        <OutputPlayer results={spotifyResult} goodRec="spotifyRecGood"/>
                    </div>
                </div>
            )}
  </div>
);
};

export default HandleUrl;