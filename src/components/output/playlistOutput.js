import React from "react"


const PlayListOutput = url =>{
    const style = "border-radius:12px"
    const src = "https://open.spotify.com/embed/playlist/" + url['src'] + "?utm_source=generator"

    console.log("url : ", url)
    console.log("src : ",src)

    return(
        <div className="output_playList">
            <div className="play_list_cls">
                <iframe className="iframe-embed" style={{style}} src={{src}}
                    width="50%" height="352" frameBorder="0" allowFullScreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
            </div>
        </div>
    )
}

export default PlayListOutput;