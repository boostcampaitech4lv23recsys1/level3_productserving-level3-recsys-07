import uvicorn
from fastapi import FastAPI, HTTPException, Request
from json import JSONDecodeError
from fastapi.middleware.cors import CORSMiddleware
from model import EASE, get_model_rec, get_random_rec
from pydantic import BaseModel, Field
from typing import List, Dict, Any
from uuid import UUID, uuid4
from datetime import datetime
from utils import set_local_database, set_cloud_database, set_prename2id, set_id2something




#== Initial Setting

#==== Set database from gpu server local csv on RAM for fast model run
song_meta_data, prename2id, id2track_name, id2url, id2artist, id2trackid = set_local_database()

#==== Set database from cloud db for search
cursor = set_cloud_database()

#==== Creaat app and CORS setting
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=["*"],    
    allow_headers=["*"],
    )


#==== Classes for logging

class Track(BaseModel):
    name: str
    artist: str
    track_id: str
    source: str
 
    
class Playlist(BaseModel):
    id: UUID = Field(default_factory=uuid4)
    playlist: List[Track] = Field(default_factory=list)


#== Baceknd Codes

@app.post("/items")
async def receive_items(request: Request):
    
    try:
        items = await request.json()
    except JSONDecodeError as e:
        raise HTTPException(status_code=400, detail=str(e))
    
    return {"items": items}


@app.post("/recplaylist", description="추천을 요청합니다.")
async def make_inference_track(request: Request, test: List):
    global headers
    print("request : ", request)
    try:
        input_track_names = await request.json()
    except JSONDecodeError as e:
        raise HTTPException(status_code=400, detail=str(e))
    
    print("input_track_names : ", input_track_names)
    input_ids = set_prename2id(input_track_names, prename2id)
    print(input_ids)
    
    model = EASE()
    result_ids = get_model_rec(model=model, input_ids=input_ids, top_k=10)
    
    track_info_lists = set_id2something(result_ids, id2track_name, id2artist, id2trackid, id2url)
    
    tracks = []
    [tracks.append(Track(name=track_name, artist=track_artist, track_id=trackid, source=url)) for track_name, track_artist, trackid, url in track_info_lists]
    
    new_playlist = Playlist(playlist = tracks)
    print(new_playlist)
    return new_playlist



# 노래를 클릭으로 받아올 경우 (모델에 들어갈 인풋)
@app.post("/trackList")
async def songList(trackList:list):
    print(trackList)
    return trackList


# search song (노래 검색을 위함)
@app.post("/searchSong/{song}")
async def songList(song: str):
    sql = f"""
            SELECT DISTINCT JSON_OBJECT('track_name', searched_song_name, 'track_id', song_id, 'artist_name', searched_artist_name)
            FROM song_meta 
            WHERE searched_song_name 
            LIKE '{song}%'
            LIMIT 20;
            """
    cursor.execute(sql)
    res = cursor.fetchall()

    return res


if __name__=="__main__":
    uvicorn.run("backend:app", host="0.0.0.0", port=30001, reload=True)