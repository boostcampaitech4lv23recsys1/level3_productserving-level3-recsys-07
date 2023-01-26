import React, { useEffect, useState } from "react";
import axios from 'axios';

const Search = () => {
    const [searchInput, setSearchInpput] = useState("");
    const [showTrackList, setShowTrackList] = useState([]);
    const [itemList, setItemList] = useState({track:[], artist:[]})

    useEffect(() => {
        setShowTrackList([]);

        if (searchInput != []){
            axios("http://localhost:8000/searchSong/"+searchInput, {
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

    const clicked = e => {
        e.preventDefault();
        
        if(e.target.value !== undefined){
            const new_track = e.target.value.split(",")[0]
            const new_artist = e.target.value.split(",")[1]

            setItemList(prevItemList => {
                return {
                    ...prevItemList, 
                    track: [...prevItemList.track, new_track],
                    artist: [...prevItemList.artist, new_artist]
                }
            });
        }
    }

    const handleRemove = (index) => {
        setItemList(prevItemList => {
            return {
              track: prevItemList.track.filter((_, i) => i !== index),
              artist: prevItemList.artist.filter((_, i) => i !== index)
            }
          });
      }


    const handleSubmit = async (e) => {
        e.preventDefault();
        await fetch(`http://localhost:30001/recplaylist/`, {
            method: 'POST',
            body: JSON.stringify(itemList['track']),
            headers: { 'Content-Type': 'application/json' }
          })
    }

    

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
                                        value={[track.track_name, track.artist_name]}
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
                        <div className="submit_btn_div">
                            <button type='submit' className="submit_button">Get Recommend</button>
                        </div>
                    </form>
                    
                </div>
            </div>
        </div>
    );
}

export default Search