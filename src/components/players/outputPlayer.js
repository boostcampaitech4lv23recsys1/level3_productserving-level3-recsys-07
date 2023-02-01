import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const OutputPlayer = ({ results, goodRec }) => {
  // State to keep track of the playback state
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [currentTrackName, setCurrentTrackName] = useState('');
  const [currentTrackArtist, setCurrentTrackArtist] = useState('');
  const [currentTrackImgUrl, setCurrentImgUrl] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(new Audio());

  const clickGoodButton = (goodRec) =>{
    axios.post("http://27.96.130.130:30001/" + "getGood", {
        good: goodRec
    })
}

  useEffect(() => {
    if (results.length) {
      setAudioSource(results[currentTrackIndex].source);
      setCurrentTrackName(results[currentTrackIndex].name);
      setCurrentTrackArtist(results[currentTrackIndex].artist);
      setCurrentImgUrl(results[currentTrackIndex].imgurl);
    }
  }, [results, currentTrackIndex]);

  // Function to toggle playback
  const togglePlayback = () => {
    if (!isPlaying) {
      audioRef.current.play();
      setIsPlaying(true);
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const togglePlayConsist = () => {
    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }    
  }

  // Function to change the source of the audio element
  const setAudioSource = (newSource) => {
    audioRef.current.src = newSource;
    setIsPlaying(false);
  };

  const prevTrack = () => {
    let prevTrackIndex = currentTrackIndex - 1;
    if (prevTrackIndex < 0) {
      prevTrackIndex = results.length - 1;
    }
    setCurrentTrackIndex(prevTrackIndex);
    togglePlayConsist();
  };

  const nextTrack = () => {
    let nextTrackIndex = currentTrackIndex + 1;
    if (nextTrackIndex === results.length) {
      nextTrackIndex = 0;
    }
    setCurrentTrackIndex(nextTrackIndex);
    togglePlayConsist()
  };

  const clickTrack = (index) => {
    let curTrackIndex = index;
    setCurrentTrackIndex(curTrackIndex);
    audioRef.current.play();
    setIsPlaying(true);
  };

  

  //...
  return (
    <div className="output-player-container">
      <div className="output-player" id="output-player">
        <div className="output-playback_wrapper">
          <div className="playback_blur"></div>
          <div className="playback_thumb" style={{backgroundImage: 'url(' + currentTrackImgUrl + ')'}}></div>

          <div className="playback_info">
            <div className="title">{currentTrackName}</div>
            <div className="artist">{currentTrackArtist}</div>
          

          <div className="playback_btn_wrapper">
            <i
              className="btn-prev fa fa-step-backward"
              onClick={prevTrack}
              aria-hidden="true"
            ></i>
            <div className="btn-switch" onClick={togglePlayback}>
              <i
                className="btn-play fa fa-play"
                id="play"
                aria-hidden="true"
              ></i>
              <i
                className="btn-pause fa fa-pause"
                id="pause"
                aria-hidden="true"
              ></i>
            </div>
            <i
              className="btn-next fa fa-step-forward"
              onClick={nextTrack}
              aria-hidden="true"
              id='btn-next '
            ></i>
          </div>

          {/* <div className="playback_timeline">
            <div className="playback_timeline_start-time">00:31</div>
            <div className="playback_timeline_slider">
              <div className="slider_base"></div>
              <div className="slider_progress"></div>
              <div className="slider_handle"></div>
            </div>
            <div className="playback_timeline_end-time">03:11</div>
          </div> */}
          </div>
        </div>

        <div className="list_wrapper" id="list_wrapper">
          <ul className="list">
            {results.map((result, index) => (
              <li key={(result.name, result.artist, index)} className="list_item" onClick={() => clickTrack(index)}>
                <div className="thumb" style={{backgroundImage: 'url(' + results[index].imgurl + ')'}}></div>
                <div className="info">
                  <div className="title">{result.name}</div>
                  <div className="artist">{result.artist}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <button className="submit_button" onClick={() => clickGoodButton(goodRec)}>Good</button>
    </div>
  );
};


export default OutputPlayer;
