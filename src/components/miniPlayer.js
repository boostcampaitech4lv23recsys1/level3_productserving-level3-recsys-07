import React from "react";

const MiniPlayer = (e) => {
  return (
    <div className="mini-player">
      <div className="track_info_wrapper">
        <div className="track_info">
          <div className="thumb"></div>
          <div className="info">
            <div className="title">Friday Comes</div>
            <div className="artist">Early</div>
          </div>
        </div>
      </div>
      <div className="mini-player_btn_wrapper">
        <i className="btn-prev fa fa-step-backward" aria-hidden="true"></i>
        <div className="btn-switch">
          <i
            id="btn-play"
            className="btn-play fa fa-play"
            aria-hidden="true"
          ></i>
          <i
            id="btn-pause"
            className="btn-pause fa fa-pause"
            aria-hidden="true"
          ></i>
        </div>
        <i className="btn-next fa fa-step-forward" aria-hidden="true"></i>
        <i className="btn-open-player fa fa-list" aria-hidden="true"></i>
      </div>
    </div>
  );
};

export default MiniPlayer;
