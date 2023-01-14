import React from "react"


const CuratorPlayList = () =>{
    const style = "border-radius:12px"

    return(
        <div className="playList" id="playList">
            <div className="play_list_cls">
                <iframe class="iframe-embed" style={{style}} src="https://open.spotify.com/embed/playlist/45iVWyXlQJp87zrwlX1j2M?utm_source=generator" 
                    width="50%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
            </div>
        </div>
    )
}

export default CuratorPlayList;