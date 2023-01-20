import requests
from urllib.parse import urlencode
import base64
import undetected_chromedriver as uc
from selenium.webdriver.common.by import By
from selenium import webdriver
import subprocess, re

def get_user_access_token_with_scope():    
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
    # print("chrome_version : " ,chrome_version)

    client_id = "14ec68df0e4c4bb78ff3bd6554cbf7b5"
    client_secret = "275babf9fd9c43e2aed63bb4d7d38ebd"

    # 딱 한번 실행 (열리는 web url에서 code? 뒷 부분 가져오기)
    auth_headers = {
        "client_id": client_id,
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

        
        key = "jq3210@naver.com"    #나중에 env에서 받아오는 걸로 설정
        password = "wjdtmddus1!"    #나중에 env에서 받아오는 걸로 설정
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
        sindex = current_url.rfind("code=")
        # 실질적인 scope가 지정된 token 가져오기
        code = current_url[sindex + 5:]
    except Exception as e:
        print("error : ", e)
    finally:
        driver.quit()

    encoded_credentials = base64.b64encode(client_id.encode() + b':' + client_secret.encode()).decode("utf-8")

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
    headers = {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": "Bearer {}".format(token)
    }


    return headers