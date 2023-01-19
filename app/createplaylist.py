import os
import requests
from urllib.parse import urlencode
import base64
import json
import undetected_chromedriver as uc
from selenium.webdriver.common.by import By
from selenium import webdriver
import subprocess, re

class myPlayList: 
    def __init__(self):
        # 현재 내 크롬 버전 찾아서 드라이버 설치
        try: 
            chrome_path = subprocess.check_output(
                r'wmic datafile where name="C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe" get Version /value',
                shell=True
            )
        except:
            chrome_path = subprocess.check_output(
                r'wmic datafile where name="C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe" get Version /value',
                shell=True
            )

        chrome_path = chrome_path.decode('utf-8').strip()

        chrome_version = re.split('=', chrome_path)[1]
        chrome_version = chrome_version.split(".")[0]
        print("chrome_version : " ,chrome_version)

        self.client_id = "14ec68df0e4c4bb78ff3bd6554cbf7b5"
        self.client_secret = "275babf9fd9c43e2aed63bb4d7d38ebd"
        self.spotify_user_id = "31rzm4yi3fqvvfe236mr2ylmmhje" 
        self.headers = {}


        # 딱 한번 실행 (열리는 web url에서 code? 뒷 부분 가져오기)
        auth_headers = {
            "client_id": self.client_id,
            "response_type": "code",
            "redirect_uri": "http://localhost:3000",
            "scope": "playlist-modify-public"
        }

        try: 
            # 옵션 생성
            options = webdriver.ChromeOptions()
            # 창 숨기는 옵션 추가
            options.add_argument("headless")

            uc.TARGET_VERSION = chrome_version
            driver = uc.Chrome(options=options)

            key = "jq3210@naver.com"
            password = "wjdtmddus1!"
            driver.get("https://accounts.spotify.com/authorize?" + urlencode(auth_headers))
            driver.find_element(By.XPATH, "/html/body/div[1]/div/div[2]/div/div/div[1]/div[1]/input").send_keys(key)
            driver.find_element(By.XPATH, "/html/body/div[1]/div/div[2]/div/div/div[1]/div[2]/input").send_keys(password)
            driver.find_element(By.XPATH, "/html/body/div[1]/div/div[2]/div/div/div[1]/div[3]/div[2]/button/div[1]/span").click()
            driver.implicitly_wait(3)

            flag = True
            while flag:
                current_url = driver.current_url
                if 'code=' in current_url:
                    flag = False
            print("assess token code : ", current_url)
            sindex = current_url.rfind("code=")
            # 실질적인 scope가 지정된 token 가져오기
            code = current_url[sindex + 5:]
        except Exception as e:
            print("error : ", e)
        finally:
            driver.quit()

        encoded_credentials = base64.b64encode(self.client_id.encode() + b':' + self.client_secret.encode()).decode("utf-8")

        token_headers = {
            "Authorization": "Basic " + encoded_credentials,
            "Content-Type": "application/x-www-form-urlencoded"
        }

        token_data = {
            "grant_type": "authorization_code",
            "code": code,
            "redirect_uri": "http://localhost:3000"
        }

        r = requests.post("https://accounts.spotify.com/api/token", data=token_data, headers=token_headers)
        token = r.json()["access_token"]
        self.headers = {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": "Bearer {}".format(token)
        }


    # 플레이 리스트를 생성하고 안에 노래는 하나씩 추가해주는 방식
    def createCustomPlayList(self, new_playlist:list=[]):
        CREATEPLAYLIST_URL  = f"https://api.spotify.com/v1/users/{self.spotify_user_id}/playlists"
        
        body = {
            "name": "New Playlist in vscode final",
            "description": "New playlist Our Ease model recommendation",
            "public": True
        }
        body = json.dumps(body)
        
        try:
            response = requests.post(CREATEPLAYLIST_URL, headers=self.headers, data=body)
        except:
            raise ValueError("CREATE PLAYLIST ERROR")

        # playlist id 저장
        playlist_id = response.json()['id']
        print("playlist_id : " ,playlist_id)



        ADDTRACK_URL = f"https://api.spotify.com/v1/playlists/{playlist_id}/tracks"
        uris = ["spotify:track:"+str(track_uri)+"," for track_uri in new_playlist]
        uris = "".join(uris)
        print("uris : ",uris)

        try:
            response = requests.post(f"{ADDTRACK_URL}?uris={uris}", headers=self.headers)
        except:
            raise ValueError("ADD TRACK ERROR")
        
        return playlist_id