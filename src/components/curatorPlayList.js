import React from "react"
import Iframe from 'react-iframe'


const CuratorPlayList = () =>{
    return(
        <div className="playList" id="playList">
            <div className="play_list_cls">
                <div className="iframe playlist">
                    <Iframe style="border-radius:12px" src="https://open.spotify.com/embed/playlist/45iVWyXlQJp87zrwlX1j2M?utm_source=generator" 
                    width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></Iframe>
                </div>
            </div>
        </div>
    )
}

export default CuratorPlayList;