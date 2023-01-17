import React from "react";
import { Link } from "react-router-dom";

const Navigation = (e) => {
  return (
    <div className="nav">
      <ul className="nav_main">
        <li>
          <a className="nav_link" id="home_page">
            Home
          </a>
        </li>
        <li>
          <a className="nav_link" id="search_music_page">
            Search Music
          </a>
        </li>
        <li>
          <a className="nav_link" id="start_input_page">
            Start
          </a>
        </li>

        <li>{/* <Link className="nav_link">LP. Mix</Link> */}</li>
      </ul>
      <div className="nav_divider"></div>
      <ul className="nav_sub">
        {/* 기존코드 */}
        <li>{/* <Link className="nav_link" href="">About</Link> */}</li>
        <li>{/* <Link className="nav_link" href="">Contact</Link> */}</li>
      </ul>
    </div>
  );
};

export default Navigation;
