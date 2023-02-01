import React, { useState, useEffect } from "react";
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
import Login from "./login";
import { Credentials } from "./spotifyAPI/Credentials";

import CuratorPlayList from "./curatorPlayList";
import axios from "axios";
import GoogleButton from "./googlebutton";

const Body = (e) => {
  const [selectedCurator, setSelectedCurator] = useState("")
  const [token, setToken] = useState('');

  const spotify = Credentials();
  useEffect(() => {
    const fetchData = async () => {
      const tokenResponse = await axios('https://accounts.spotify.com/api/token', {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization:
            'Basic ' + btoa(spotify.ClientId + ':' + spotify.ClientSecret),
        },
        data: 'grant_type=client_credentials',
        method: 'POST',
      });

      setToken(tokenResponse.data.access_token);
    };

    fetchData();
    setInterval(fetchData, 3600 * 1000);  // run the code every hour
  }, []);

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
          {/* <GoogleButton /> */}
          <Login />
          
          {/* <MiniPlayer /> */}
          <div className='dim'></div>
          <Player />
          <Background />

          {/* 홈페이지 */}
          <Home />

          {/* Start Input 페이지 */}
          <Input />
          <HandleUrl token={token}/>
          <Search token={token}/>
          {/* <Select /> */}
      
          {/* 큐레이터 전환 */}
          <Curator onClick={handleCuratorClick}/>
          <CuratorPlayList selectedCurator={selectedCurator}/>


         </div>
       </div>
  );
};

export default Body;
