import uvicorn
import numpy as np
import pandas as pd
import re

from fastapi import FastAPI, HTTPException, Request
from json import JSONDecodeError
from fastapi.middleware.cors import CORSMiddleware
from model import EASE, get_model_rec, get_random_rec
from pydantic import BaseModel, Field
from typing import List, Union, Optional, Dict, Any
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
    id: UUID = Field(default_factory=uuid4)
    name: str
 
    
class InferenceTrack(Track):
    id: UUID = Field(default_factory=uuid4)
    name: str = "inference_track_id"
    result: Optional[List]


#== Baceknd Codes

@app.post("/items")
async def receive_items(request: Request):
    
    try:
        items = await request.json()
    except JSONDecodeError as e:
        raise HTTPException(status_code=400, detail=str(e))
    
    return {"items": items}


@app.post("/recplaylist/", description="추천을 요청합니다.")
async def make_inference_track(request: Request):
    global headers
    try:
        input_track_names = await request.json()
    except JSONDecodeError as e:
        raise HTTPException(status_code=400, detail=str(e))
    
    input_ids = set_prename2id(input_track_names, prename2id)
    print(input_ids)
    
    model = EASE()
    result_ids = get_model_rec(model=model, input_ids=input_ids, top_k=10)
    
    result = set_id2something(result_ids, id2track_name, id2artist, id2trackid, id2url)
    print(result)
    return result



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
    uvicorn.run("backend:app", host="0.0.0.0", port=30001, reload=True)