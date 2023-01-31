import React, { useEffect, useState } from "react";
import axios from 'axios';
import OutputPlayer from "../players/outputPlayer";
import { Credentials } from '../spotifyAPI/Credentials';

const Search = () => {
    const [searchInput, setSearchInpput] = useState("");
    const [showTrackList, setShowTrackList] = useState([]);
    const [itemList, setItemList] = useState({track:[], artist:[], track_id:[], artist_id:[]});
    const [results, setResults] = useState([]);

    const [buttonBool, setButtonBool] = useState(false);
    const [loading, setLoading] = useState(null);    

    const [token, setToken] = useState('');
    const [spotifyRec, setSpotifyRec] = useState({artist:[], imgurl:[], name:[], source:[], track_id:[]});

    const spotify = Credentials();


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


    useEffect(() => {
        setShowTrackList([]);
        if (searchInput != []){
            axios("http://27.96.130.130:30001/searchSong/"+searchInput, {
                headers: { 
                    "Content-Type": "application/json",
                    withCredentials:true 
                },
                method: 'POST',
            })
            .then(response => {
                response.data.map(val => {
                    setShowTrackList(prevArray => [...prevArray, val]);
                })
            })
            .catch(e => {
                    console.log(e);
            })
        }
    }, [searchInput])

    //search 결과 클릭시 result에 아이템 추가
    const clicked = e => {
        e.preventDefault();
        if(e.target.value !== undefined){
            let new_track = e.target.value.split(",")[0]
            let new_artist = e.target.value.split(",")[1]
            let new_track_id = e.target.value.split(",")[2]
            let new_artist_id = e.target.value.split(",")[3]

            setItemList(prevItemList => {
                return {
                    ...prevItemList, 
                    track: [...prevItemList.track, new_track],
                    artist: [...prevItemList.artist, new_artist],
                    track_id: [...prevItemList.track_id, new_track_id],
                    artist_id: [...prevItemList.artist_id, new_artist_id]
                }
            });
        }
    }

    // result결과 클릭시 item 삭제
    const handleRemove = (index) => {
        setItemList(prevItemList => {
            return {
              track: prevItemList.track.filter((_, i) => i !== index),
              artist: prevItemList.artist.filter((_, i) => i !== index),
              track_id: prevItemList.track_id.filter((_, i) => i !== index),
              artist_id: prevItemList.artist_id.filter((_, i) => i !== index)
            }
          });
      }

    // 추천 받기
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (itemList['track'].length < 5){
            alert("노래를 5개 이상 골라주세요");
            setButtonBool(false);
        }
        else{
            setButtonBool(true);
            setLoading(true);
            const response = await fetch(`http://27.96.130.130:30001/recplaylist/`, {
                method: 'POST',
                body: JSON.stringify(itemList['track']),
                headers: { 'Content-Type': 'application/json' }
            })
          
            await response.json().then((data) => {
                setResults(data.playlist);
                setLoading(false);
            });

            let track_id_str, artist_id_str

            // track_id_str = itemList.track_id.join(",");
            // artist_id_str = itemList.artist_id.join(",");

            track_id_str = itemList.track_id[0];
            artist_id_str = itemList.artist_id[0];

            let query = `limit=10&market=kr&seed_artists=${artist_id_str}&seed_genres=kpop&seed_tracks=${track_id_str}`;
            await fetch("https://api.spotify.com/v1/recommendations?" + query, {
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
        }
        // back으로 작동시 기존에 남아있는게 있어서 다 끝나면 한번 초기화
        setItemList({track:[], artist:[], track_id:[], artist_id:[]});
        setSpotifyRec({artist:[], imgurl:[], name:[], source:[], track_id:[]});
    }

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


    return(
        <div id="search_container">
            <div className="search_content">
                <div className="search_content_input">
                    <input placeholder="Input Search Songs" className="search_input" onChange={(event) => setSearchInpput(event.target.value)}></input>

                    <div className="list-box" id='search_list_box_wrapper'>
                        <div className="list-group">
                            {
                                showTrackList.map((element, idx) => {
                                    const track = JSON.parse(element[0]);
                                    return (
                                        <button key={idx}
                                        onClick={clicked}
                                        className="list-group-item list-group-item-light"
                                        id={track.track_id}
                                        value={[track.track_name, track.artist_name, track.track_id, track.artist_id]}
                                        >
                                        {track.track_name}
                                        <p style={{ fontSize: '10px', color: 'gray' }}>{track.artist_name}</p>
                                        </button>
                                        )
                                })
                            }
                        </div>
                    </div>
                </div>
                <div className="search_content_output">
                    <span className="s1"> Song List</span>
                    <div className="search_result_save">
                        {itemList.track.map((track, index) => (
                            <li key={index} onClick={() => handleRemove(index)}>
                                {track}
                                <p style={{ fontSize: '10px', color: 'gray' }}>{itemList.artist[index]}</p>
                            </li>
                        ))}
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="submit_btn" >
                            <button type='submit' value={buttonBool} className="submit_button">Get Recommend
                            </button>
                        </div>
                    </form>
                    
                </div>
            </div>
            {loading ? (
                <div className="loader_wrapper">
                    <div className="loader"/>
                    <p> 추천 결과를 가져오고 있습니다 </p>
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
}

export default Search