# import requests
import pandas as pd
import pymysql 
# import undetected_chromedriver as uc
import re
# from selenium.webdriver.common.by import By
# from selenium import webdriver
from urllib.parse import urlencode
from typing import List, Union, Optional, Dict, Any
    
    
def set_local_database():
    
    song_meta_data = pd.read_csv("../data/song_meta.csv", sep=';')
    
    prename2id, id2track_name, id2url, id2artist, id2trackid, id2imgurl = {}, {}, {}, {}, {}, {}
    for track_name, url, id, artist, track_id, img_url in zip(song_meta_data.song_name, 
                                           song_meta_data.preview_url, 
                                           song_meta_data.song_id,
                                           song_meta_data.searched_artist_name,
                                           song_meta_data.searched_song_id,
                                           song_meta_data.img_url):
        
        prename = re.sub("[^\w]", '', track_name).strip().lower()
        prename2id[prename] = id
        id2track_name[id] = track_name 
        id2url[id] = url
        id2artist[id] = artist
        id2trackid[id] = track_id
        id2imgurl[id] = img_url
        
    return song_meta_data, prename2id, id2track_name, id2url, id2artist, id2trackid, id2imgurl


def set_cloud_database():
    
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
    
    return cursor, conn


def set_prename2id(input_names: List[str], prename2id: Dict):
    
    track_id_list = []
    for track_name in input_names:
        pre_track_name = re.sub("[^\w]", '', track_name).strip().lower()
        track_id_list.append(prename2id[pre_track_name])
        
    return track_id_list

def set_id2something(input_ids: List[int], 
                     id2track_name: Dict, 
                     id2artist: Dict, 
                     id2trackid: Dict,
                     id2url: Dict,
                     id2imgurl: Dict
                     ):
    
    track_info_lists = []
    for id in input_ids:
        track_info_lists.append((id2track_name[id], 
                                 id2artist[id], 
                                 id2trackid[id],
                                 id2url[id],
                                 id2imgurl[id]))
        
    return track_info_lists




