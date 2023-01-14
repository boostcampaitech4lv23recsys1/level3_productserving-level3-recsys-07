import React from "react";
import Header from "./header";
import Navigation from "./nav";
import MiniPlayer from "./miniPlayer";
import Player from "./player";
import Background from "./background"

import Home from "./home";
import Curator from "./curator";
import Search from "./search";

import CuratorPlayList from "./curatorPlayList";

import ResultPage from "./resultPage";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

  const Body = (e) => {
  return (
    <Router>
      <div>
        <header>
          <div>
            <title>Music Recommendation Recsys 07</title>
            <meta charSet="UTF-8" />
            <link
              rel="stylesheet"
              href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.css"
            />
            {/* <link rel="stylesheet" href="./style.css" /> */}
          </div>
        </header>

        <div className="wrapper">
          {/* 기초 세팅 */}
          <Header />
          <Navigation />
          <Search/>
          <MiniPlayer />
          <div className='dim'></div>
          <Player />
          <Background />

          {/* 홈페이지 */}
          <Home />
          
          {/* 큐레이터 전환 */}
          <Curator />
          <CuratorPlayList />

          {/* Search 결과 페이지 */}
          {/* <ResultPage /> */}

         </div>
       </div>
     </Router>
  );
};

export default Body;
