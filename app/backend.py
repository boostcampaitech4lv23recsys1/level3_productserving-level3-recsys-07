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
    print(f'items: {items}')
    return {"items": items}



@app.post("/recplaylist", description="추천을 요청합니다.")
async def make_track(request: Request, model: EASE=Depends(get_model_rec)):
    
    try:
        inputs = await request.json()
    except JSONDecodeError as e:
        raise HTTPException(status_code=400, detail=str(e))

    tracks = []

    inference_result = get_model_rec(model=model)
    track = InferenceTrackRec(result=inference_result)
    tracks.append(track)

    new_playlist = Playlist(trackss=tracks)
    orders.append(new_playlist)
    return new_playlist

    

orders = []
# 실무에서는 보통 이 경우에 데이터베이스를 이용해서 주문을 저장하지만, 데이터베이스를 따로 학습하지 않았으므로 In Memory인 리스트에 저장


if __name__=="__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
