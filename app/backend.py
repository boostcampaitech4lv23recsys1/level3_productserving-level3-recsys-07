from fastapi import FastAPI, HTTPException, Request
from json import JSONDecodeError
from fastapi.middleware.cors import CORSMiddleware
from model import EASE, get_model_rec, get_random_rec
from pydantic import BaseModel, Field
from typing import List, Union, Optional, Dict, Any
from uuid import UUID, uuid4
from datetime import datetime

import uvicorn
import pymysql
import numpy as np

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
    
class InferenceTrack(Track):
    id: UUID = Field(default_factory=uuid4)
    name: str = "inference_track_id"
    result: Optional[List]
    
    

@app.post("/items")
async def receive_items(request: Request):
    
    try:
        items = await request.json()
    except JSONDecodeError as e:
        raise HTTPException(status_code=400, detail=str(e))
    print(f'items: {items}')
    return {"items": items}



@app.post("/recplaylist", description="추천을 요청합니다.", response_model=InferenceTrack)
async def make_track(request: Request):
    try:
        inputs = await request.json()
    except JSONDecodeError as e:
        raise HTTPException(status_code=400, detail=str(e))
    
    model = EASE()
    tmp = [525514, 562083, 297861]
    
    print('inferece start')
    
    inference_result = get_model_rec(model=model, input_ids=tmp, top_k=10)
    inference_result = np.array(inference_result).tolist()
    inference_track = InferenceTrack(result = inference_result)
    print(inference_track)
    return inference_track


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
    uvicorn.run("backend:app", host="0.0.0.0", port=8000, reload=True)
