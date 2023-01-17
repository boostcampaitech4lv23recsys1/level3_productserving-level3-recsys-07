import React, { useEffect, useState } from "react";
import axios from 'axios';

const Search = () => {
    const [searchInput, setSearchInpput] = useState("");
    const [showTrackList, setShowTrackList] = useState([]);

    const [trackList, setTrackList] = useState("")

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
                console.log(response);
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
        setTrackList(prevArray => [...prevArray, e.target.value]);
    }

    return(
        <div id="search_container">
            <div className="search_content">
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
                                    value={track.track_name}
                                    >
                                        {track.track_name}
                                </button>)
                            })
                        }
                    </div>
                </div>

            </div>
        </div>

    );
}

export default Search