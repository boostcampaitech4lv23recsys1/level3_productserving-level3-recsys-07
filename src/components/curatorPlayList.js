import React from "react"


const CuratorPlayList = ({selectedCurator}) =>{
    const style = "border-radius:12px";
    var src = ""
    if (selectedCurator === 'Hyunwook Ko') {
        src = 'https://open.spotify.com/embed/playlist/46VjhWQI5BrkE1FEh4Wx51?utm_source=generator';
      } else if (selectedCurator === 'Bo Seong') {
        src = 'https://open.spotify.com/embed/playlist/6i37SY1yWdDhzVHBUFX4Rq?utm_source=generator'; // 아직
      } else if (selectedCurator === "Jung Ho"){
        src = "https://open.spotify.com/embed/playlist/0C0neYjfv39BDREAuGGh7G?utm_source=generator";
      } else if (selectedCurator === "Moon sun Park"){
        src = "https://open.spotify.com/embed/playlist/5lXlNQwooyOpm9Xcal1zkQ?utm_source=generator"; // 아직
      } else if (selectedCurator === "Seung Yeon"){
        src = "https://open.spotify.com/embed/playlist/45iVWyXlQJp87zrwlX1j2M?utm_source=generator";
      }

    console.log("selectedCurator : ", selectedCurator)

    return(
        <div className="curator_playlist">
            <div className="playlist_cls">
                <iframe className="iframe_embed" style={{style}} src={src}
                    width="50%" height="352" frameBorder="0" allowFullScreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
            </div>
        </div>
    )
}

export default CuratorPlayList;