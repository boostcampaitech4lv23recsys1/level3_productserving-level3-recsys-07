import React, {useState, useEffect} from "react";

const Curator = (props) => {
  const [selectedCurator, setSelectedCurator] = useState('');

  const handleClick = (val) => {
    setSelectedCurator(val);
  }

  useEffect(() => {
    props.onClick(selectedCurator);
    console.log("selectedCurator : ", selectedCurator)
  },[selectedCurator])

  return (
    <div className="page" id="curator">
      <div className="curator_title_wrapper">
        <span>LP</span>
        <div className="curator_line"></div>
        <div className="curator_title">Listeners</div>
        <div className="curator_line"></div>
        <span>14</span>
      </div>
      <div className="curator_list">
        <div className="curator_list_content">
          <div className="connect_btn_wrapper item">
            <div className="connect_btn">
              <div className="connect_btn_text">
                Connect <br />
                SoundCloud
              </div>
            </div>
          </div>
          <div className="curator_list_content_desc">
            Or Select <br />a Listener of <br />
            L.P.
          </div>
          <div className="item" onClick={() => handleClick('Hyeon Wook')}>
            <div className="thumb"></div>
            <div className="info">
              <div className="name" >Hyeon Wook</div>
              <div className="desc">PlayList</div>
            </div>
          </div>
          <div className="item" onClick={() => handleClick('Bo Seong')}>
            <div className="thumb"></div>
            <div className="info">
              <div className="name" onClick={handleClick}>Bo Seong</div>
              <div className="desc">PlayList</div>
            </div>
          </div>
          <div className="item" onClick={() => handleClick('Moon Soon')}>
            <div className="thumb"></div>
            <div className="info">
              <div className="name" onClick={handleClick}>Moon Soon</div>
              <div className="desc">PlayList</div>
            </div>
          </div>
          <div className="item" onClick={() => handleClick('Jeong Ho')}>
            <div className="thumb"></div>
            <div className="info">
              <div className="name" onClick={handleClick}>Jeong Ho</div>
              <div className="desc">PlayList</div>
            </div>
          </div>
          <div className="item" onClick={() => handleClick('Seung Yeon')}>
            <div className="thumb"></div>
            <div className="info">
              <div className="name" onClick={handleClick}>Seung Yeon</div>
              <div className="desc">PlayList</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Curator;