import React from "react";

const Player = (e) => {
  return (
    <div className="player" id="player">
      <div className="playback_wrapper">
        <div className="playback_blur"></div>
        <div className="playback_thumb"></div>
        <div className="playback_info">
          <div className="title">Friday Comes</div>
          <div className="artist">Early</div>
        </div>
        <div className="playback_btn_wrapper">
          <i className="btn-prev fa fa-step-backward" aria-hidden="true"></i>
          <div className="btn-switch">
            <i className="btn-play fa fa-play" aria-hidden="true"></i>
            <i className="btn-pause fa fa-pause" aria-hidden="true"></i>
          </div>
          <i className="btn-next fa fa-step-forward" aria-hidden="true"></i>
        </div>
        <div className="playback_timeline">
          <div className="playback_timeline_start-time">00:31</div>
          <div className="playback_timeline_slider">
            <div className="slider_base"></div>
            <div className="slider_progress"></div>
            <div className="slider_handle"></div>
          </div>
          <div className="playback_timeline_end-time">03:11</div>
        </div>
      </div>
      <div className="list_wrapper">
        <ul className="list">
          <li className="list_item selected">
            <div className="thumb"> </div>
            <div className="info">
              <div className="title">Friday Comes</div>
              <div className="artist">Early</div>
            </div>
          </li>
          <li className="list_item">
            <div className="thumb"> </div>
            <div className="info">
              <div className="title">Friday Comes</div>
              <div className="artist">Early</div>
            </div>
          </li>
          <li className="list_item">
            <div className="thumb"> </div>
            <div className="info">
              <div className="title">Friday Comes</div>
              <div className="artist">Early</div>
            </div>
          </li>
          <li className="list_item">
            <div className="thumb"> </div>
            <div className="info">
              <div className="title">Friday Comes</div>
              <div className="artist">Early</div>
            </div>
          </li>
          <li className="list_item">
            <div className="thumb"> </div>
            <div className="info">
              <div className="title">Friday Comes</div>
              <div className="artist">Early</div>
            </div>
          </li>
          <li className="list_item">
            <div className="thumb"> </div>
            <div className="info">
              <div className="title">Friday Comes</div>
              <div className="artist">Early</div>
            </div>
          </li>
          <li className="list_item">
            <div className="thumb"> </div>
            <div className="info">
              <div className="title">Friday Comes</div>
              <div className="artist">Early</div>
            </div>
          </li>
          <li className="list_item">
            <div className="thumb"> </div>
            <div className="info">
              <div className="title">Friday Comes</div>
              <div className="artist">Early</div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Player;
