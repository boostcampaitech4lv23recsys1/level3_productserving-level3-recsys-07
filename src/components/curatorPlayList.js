import React from "react"


const CuratorPlayList = () =>{
    const style = "border-radius:12px";

    return(
        <div className="playList">
            <div className="playList_cls">
                <iframe class="iframe_embed" style={{style}} src="https://open.spotify.com/embed/playlist/45iVWyXlQJp87zrwlX1j2M?utm_source=generator" 
                    width="50%" height="352" frameBorder="0" allowFullScreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
            </div>
        </div>
    )
}

export default CuratorPlayList;