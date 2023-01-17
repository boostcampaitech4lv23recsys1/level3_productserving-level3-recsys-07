from fastapi import FastAPI, HTTPException, Request
from json import JSONDecodeError
from fastapi.middleware.cors import CORSMiddleware

from fastapi.param_functions import Depends
from pydantic import BaseModel, Field
from uuid import UUID, uuid4
from typing import List, Union, Optional, Dict, Any

from model import EASE, get_model_rec, get_random_rec

from datetime import datetime
import uvicorn

import pymysql

app = FastAPI()

origins =['*']

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],    
    allow_headers=["*"],
    )

class Track(BaseModel):
    id: UUID = Field(default_factory=uuid4)
    name: str


class Playlist(BaseModel):
    id: UUID = Field(default_factory=uuid4)
    tracks: List[Track] = Field(default_factory=list)
    # 최초에 빈 list를 만들어서 저장한다
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)

    @property
    def show(self):
        return sum([track.name for track in self.tracks])

    def add_track(self, track: Track):
        # add_product는 Product를 인자로 받아서, 해당 id가 이미 존재하는지 체크 => 없다면 products 필드에 추가
        # 업데이트할 때 updated_at을 현재 시각으로 업데이트
        if track.id in [existing_track.id for existing_track in self.tracks]:
            return self

        self.tracks.append(track)
        self.updated_at = datetime.now()
        return self
    
    
class InferenceTrackRec(Track):
    name: str = "inference_track_rec"
    price: float = 100.0
    result: Optional[List]


playlists = []


@app.get("/")
async def hello_world():
    print("hello")
    return {"hello": "world"}


@app.get("/playlist", description='입력 Playlist 정보를 가져옵니다.')
async def get_playlist(playlist_id: UUID)-> Union[Playlist, dict]:

    playlist = get_playlist_by_id(playlist_id=playlist_id)

    if not playlist:
        return{"message": "정보를 찾을 수 없습니다."}

    return playlist


def get_playlist_by_id(playlist_id: UUID) -> Optional[Playlist]:
    return next((playlist for playlist in playlists if playlist.id == playlist_id), None)


@app.post("/items")
async def receive_items(request: Request):
    try:
        items = await request.json()
    except JSONDecodeError as e:
        raise HTTPException(status_code=400, detail=str(e))
    
    return {"items": items}



@app.post("/recinfer", description="추천을 요청합니다.")
async def make_track(request: Request, model: EASE=Depends(get_model_rec)):
    
    try:
        input_tracks = await request.json()
    except JSONDecodeError as e:
        raise HTTPException(status_code=400, detail=str(e))

    input_tracks = [track for track in input_tracks]
    tmp = [525514, 562083, 297861]

    rec_tracks = []

    print("inference start")
    inference_result = get_model_rec(model=model,input_ids=tmp, top_k=10)
    rec_track = InferenceTrackRec(result=inference_result)
    rec_tracks.append(rec_track)

    new_playlist = Playlist(trackss=rec_tracks)
    orders.append(new_playlist)
    return new_playlist

    

orders = []
# 실무에서는 보통 이 경우에 데이터베이스를 이용해서 주문을 저장하지만, 데이터베이스를 따로 학습하지 않았으므로 In Memory인 리스트에 저장

# database connection
conn = pymysql.connect(
    host='database-2.csf4gv44uzg9.ap-northeast-2.rds.amazonaws.com',
    port=3306,
    charset='utf8',
    user='admin',
    passwd='wjdtmddus1!',
    db='test_final'
)

# database cursor
cursor = conn.cursor()

# 노래를 클릭으로 받아올 경우 (모델에 들어갈 인풋)
@app.post("/trackList")
async def songList(trackList:list):
    print(trackList)
    return trackList


# search song (노래 검색을 위함)
@app.post("/searchSong/{song}")
async def songList(song: str):
    sql = f"""
            SELECT JSON_OBJECT('track_name', searched_track_name, 'track_id', searched_track_id)
            FROM test 
            WHERE searched_track_name 
            LIKE '%{song}%' 
            LIMIT 10
            """
    cursor.execute(sql)
    res = cursor.fetchall()

    return res


if __name__=="__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
