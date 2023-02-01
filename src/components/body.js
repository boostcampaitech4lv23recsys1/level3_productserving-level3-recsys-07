import React, { useState } from "react";
import Header from "./header";
import Navigation from "./nav";
import MiniPlayer from "./miniPlayer";
import Player from "./player";
import Background from "./background"
import Home from "./home";
import Curator from "./curator";
// import Search from "./search";
import Input from "./start_input/input"
import HandleUrl from "./start_input/handleUrl"
// import Select from "./start_input/select"
import Search from "./start_input/search";

import CuratorPlayList from "./curatorPlayList";
import axios from "axios";
import GoogleButton from "./googlebutton";

const Body = (e) => {
  const [selectedCurator, setSelectedCurator] = useState("")

  const handleCuratorClick = (val) => {
    setSelectedCurator(val);
  }

  window.userEmail = 'NOT_LOGINED'

  return (
      <div>
        <header>
          <div>
            <title>Music Recommendation Recsys 07</title>
            <meta charSet="UTF-8" />
            <link
              rel="stylesheet"
              href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.css"
            />
            <div className="application">
        </div>
            {/* <link rel="stylesheet" href="./style.css" /> */}
          </div>
        </header>

        <div className="wrapper">
          {/* 기초 세팅 */}
          <Header />
          <Navigation />
          <GoogleButton />
          {/* <MiniPlayer /> */}
          <div className='dim'></div>
          <Player />
          <Background />

          {/* 홈페이지 */}
          <Home />

          {/* Start Input 페이지 */}
          <Input />
          <HandleUrl />
          <Search />
          {/* <Select /> */}
      
          {/* 큐레이터 전환 */}
          <Curator onClick={handleCuratorClick}/>
          <CuratorPlayList selectedCurator={selectedCurator}/>


         </div>
       </div>
  );
};

export default Body;
