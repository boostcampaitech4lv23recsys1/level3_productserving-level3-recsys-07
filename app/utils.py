# import requests
import base64
import pandas as pd
import pymysql 
# import undetected_chromedriver as uc
import subprocess, re
import json
# from selenium.webdriver.common.by import By
# from selenium import webdriver
from urllib.parse import urlencode
from typing import List, Union, Optional, Dict, Any


# def get_user_access_token_with_scope():    
#     # 현재 내 크롬 버전 찾아서 드라이버 설치
#     try: 
#         chrome_path = subprocess.check_output(
#             r'wmic datafile where name="C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe" get Version /value',
#             shell=True
#         )
#     except:
#         chrome_path = subprocess.check_output(
#             r'wmic datafile where name="C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe" get Version /value',
#             shell=True
#         )

#     chrome_path = chrome_path.decode('utf-8').strip()

#     chrome_version = re.split('=', chrome_path)[1]
#     chrome_version = chrome_version.split(".")[0]
#     # print("chrome_version : " ,chrome_version)

#     client_id = "14ec68df0e4c4bb78ff3bd6554cbf7b5"
#     client_secret = "275babf9fd9c43e2aed63bb4d7d38ebd"

#     # 딱 한번 실행 (열리는 web url에서 code? 뒷 부분 가져오기)
#     auth_headers = {
#         "client_id": client_id,
#         "response_type": "code",
#         "redirect_uri": "http://localhost:3000",
#         "scope": "playlist-modify-public"
#     }

#     try: 
#         # 옵션 생성
#         options = webdriver.ChromeOptions()
#         # 창 숨기는 옵션 추가
#         options.add_argument("headless")

#         uc.TARGET_VERSION = chrome_version
#         driver = uc.Chrome(options=options)

        
#         key = "jq3210@naver.com"    #나중에 env에서 받아오는 걸로 설정
#         password = "wjdtmddus1!"    #나중에 env에서 받아오는 걸로 설정
#         driver.get("https://accounts.spotify.com/authorize?" + urlencode(auth_headers))
#         driver.find_element(By.XPATH, "/html/body/div[1]/div/div[2]/div/div/div[1]/div[1]/input").send_keys(key)
#         driver.find_element(By.XPATH, "/html/body/div[1]/div/div[2]/div/div/div[1]/div[2]/input").send_keys(password)
#         driver.find_element(By.XPATH, "/html/body/div[1]/div/div[2]/div/div/div[1]/div[3]/div[2]/button/div[1]/span").click()
#         driver.implicitly_wait(3)

#         flag = True
#         while flag:
#             current_url = driver.current_url
#             if 'code=' in current_url:
#                 flag = False
#         sindex = current_url.rfind("code=")
#         # 실질적인 scope가 지정된 token 가져오기
#         code = current_url[sindex + 5:]
#     except Exception as e:
#         print("error : ", e)
#     finally:
#         driver.quit()

#     encoded_credentials = base64.b64encode(client_id.encode() + b':' + client_secret.encode()).decode("utf-8")

#     token_headers = {
#         "Authorization": "Basic " + encoded_credentials,
#         "Content-Type": "application/x-www-form-urlencoded"
#     }

#     token_data = {
#         "grant_type": "authorization_code",
#         "code": code,
#         "redirect_uri": "http://localhost:3000"
#     }

#     r = requests.post("https://accounts.spotify.com/api/token", data=token_data, headers=token_headers)
#     token = r.json()["access_token"]
#     headers = {
#         "Accept": "application/json",
#         "Content-Type": "application/json",
#         "Authorization": "Bearer {}".format(token)
#     }


#     return headers


# # 플레이 리스트를 생성하고 안에 노래는 하나씩 추가해주는 방식
# def createCustomPlayList(headers, new_playlist:list=[]):
#     print("headers : ", headers)
#     spotify_user_id = "31rzm4yi3fqvvfe236mr2ylmmhje" 
#     CREATEPLAYLIST_URL  = f"https://api.spotify.com/v1/users/{spotify_user_id}/playlists"
    
#     body = {
#         "name": "New Playlist in vscode final",
#         "description": "New playlist Our Ease model recommendation",
#         "public": True
#     }
#     body = json.dumps(body)
    
#     try:
#         response = requests.post(CREATEPLAYLIST_URL, headers=headers, data=body)
#     except:
#         raise ValueError("CREATE PLAYLIST ERROR")

#     # playlist id 저장
#     playlist_id = response.json()['id']

#     ADDTRACK_URL = f"https://api.spotify.com/v1/playlists/{playlist_id}/tracks"
#     uris = ["spotify:track:"+str(track_uri)+"," for track_uri in new_playlist]
#     uris = "".join(uris)

#     try:
#         response = requests.post(f"{ADDTRACK_URL}?uris={uris}", headers=headers)
#     except:
#         raise ValueError("ADD TRACK ERROR")
    
#     return playlist_id
    
    
def set_local_database():
    
    song_meta_data = pd.read_csv("../data/song_meta.csv", sep=';', engine="pyarrow")
    
    prename2id, id2track_name, id2url, id2artist, id2trackid = {}, {}, {}, {}, {}
    for track_name, url, id, artist, track_id in zip(song_meta_data.song_name, 
                                           song_meta_data.preview_url, 
                                           song_meta_data.id,
                                           song_meta_data.searched_artist_name,
                                           song_meta_data.song_id):
        
        prename = re.sub("[^\w]", '', track_name).strip().lower()
        prename2id[prename] = id
        id2track_name[id] = track_name 
        id2url[id] = url
        id2artist[id] = artist
        id2trackid[id] = track_id
        
    return song_meta_data, prename2id, id2track_name, id2url, id2artist, id2trackid


def set_cloud_database():
    
    # database connection
    conn = pymysql.connect(
        host='database-2.csf4gv44uzg9.ap-northeast-2.rds.amazonaws.com',
        port=3306,
        charset='utf8',
        user='',
        passwd='',
        db='test_final'
    )
    
    # database cursor
    cursor = conn.cursor()
    
    return cursor


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
                     ):
    
    track_info_lists = []
    for id in input_ids:
        track_info_lists.append((id2track_name[id], 
                                 id2artist[id], 
                                 id2trackid[id],
                                 id2url[id]))
        
    return track_info_lists




