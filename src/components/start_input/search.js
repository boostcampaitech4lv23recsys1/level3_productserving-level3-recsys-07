import React, { useEffect, useState } from "react";
import axios from 'axios';
import OutputPlayer from "../players/outputPlayer";

const Search = () => {
    const [searchInput, setSearchInpput] = useState("");
    const [showTrackList, setShowTrackList] = useState([]);
    const [itemList, setItemList] = useState({track:[], artist:[]})
    const [results, setResults] = useState([]);
    const [buttonBool, setButtonBool] = useState(false);

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

    // result결과 클릭시 item 삭제
    const handleRemove = (index) => {
        setItemList(prevItemList => {
            return {
              track: prevItemList.track.filter((_, i) => i !== index),
              artist: prevItemList.artist.filter((_, i) => i !== index)
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
            const response = await fetch(`http://27.96.130.130:30001/recplaylist/`, {
                method: 'POST',
                body: JSON.stringify(itemList['track']),
                headers: { 'Content-Type': 'application/json' }
            })
          
            await response.json().then((data) => {
                setResults(data.playlist);
            });
        }       
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
                        <div className="submit_btn" >
                            <button type='submit' value={buttonBool} className="submit_button">Get Recommend</button>
                        </div>
                    </form>
                    
                </div>
            </div>
            <OutputPlayer results={results} />
        </div>
    );
}

export default Search