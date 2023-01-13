import requests
import json
import argparse
import pandas as pd
from urllib.parse import quote
from tqdm import tqdm



def paser_args():
    parser = argparse.ArgumentParser()
    parser.add_argument("--id", default='063ea4e006334d1bb7beb69bb9855ff0', type=str, help="client_id") #7fd16ed6bc6646e689486e3d43af2b91
    parser.add_argument("--secret", default="8a66fbb488004ed0bdcac9704600af42", type=str, help="client_secret")#8e86948aff20452c87706cc6100686af
    parser.add_argument("--base_df", default="song_artist_part_0.csv", type=str, help="csv name") # ./data/song_artist_part_2.csv
    parser.add_argument("--end_df", default="searched_df_part_0.csv", type=str, help="csv name") # ./data/searched_df_part_2.csv
    args = parser.parse_args()
    return args


# Replace YOUR_CLIENT_ID and YOUR_CLIENT_SECRET with your actual Spotify API credentials
def set_headers(args):
    # Request an access token from Spotify
    response = requests.post("https://accounts.spotify.com/api/token",
                            data={
                                "grant_type": "client_credentials"
                            },
                            auth=(args.id, args.secret)
                            )

    # Extract the access token from the response
    access_token = response.json()['access_token']

    # Send the search request to the Spotify API
    headers = {
        "Authorization": f"Bearer {access_token}"
    }

    return headers


def search_with_query(
    headers:dict={}, 
    track_name:str = "기다린 만큼 더", 
    artist_name:str = "카더가든", 
    market:str = 'kr'):
    
    APIBASE = "https://api.spotify.com/v1/search"
    query_and = quote(f"{artist_name} {track_name} ")
    query_or = quote(f"{artist_name}|{track_name} ")
    
    try:
        response = requests.get(
            f"{APIBASE}?q={query_and}&type=track&market={market}",
        headers=headers)
            
    except requests.exceptions.Timeout as timeout:
        print("Timeout Error : ", timeout)
        
    except requests.exceptions.ConnectionError as connect:
        print("Error Connecting : ", connect)
           
    except requests.exceptions.HTTPError as http:
        print("Http Error : ", http)
        
    except requests.exceptions.InvalidURL as url:
        print("Http Error : ", url)

    # Any Error except upper exception
    except requests.exceptions.RequestException as re:
        print("AnyException : ", re)
        
    except:
        print("API limit Error")
        raise ValueError("API limit Error")
    
    return response


def search_except(track_name, artist_name, search_except):

    searched_sr = pd.Series(
            {
                "searched_track_name": track_name, 
                "searched_track_artist": artist_name, 
                "searched_track_id": search_except, 
                "searched_preview_url": search_except,
                }
            )

    return searched_sr


def create_df(headers, base_df):
    searched_df = pd.DataFrame(columns=[
        "searched_track_artist",
        "searched_track_name",
        "searched_track_id",
        "searched_preview_url",
        ])
    for track_name, artist_name in zip(tqdm(base_df.song), base_df.kakao_artist):
        response = search_with_query(headers, track_name, artist_name)
        
        # 검색결과가 없거나, 다른 음원이 의심될 때 예외 처리
        if response.status_code == 400:
            searched_df.loc[len(searched_df)] = search_except(track_name=track_name, artist_name=artist_name, search_except='code 400')
            continue
    
        if response.status_code == 429:
            print('JSONDecodeError: "Too many requests"')
            break
        
        searched_tracks = response.json()["tracks"]["items"]
        
        if searched_tracks == []:
            searched_df.loc[len(searched_df)] = search_except(track_name=track_name, artist_name=artist_name, search_except='vacant item')
            continue
        
        searched_track_name = searched_tracks[0]["name"]
        searched_track_artist = searched_tracks[0]["artists"][0]["name"]
        searched_track_id = searched_tracks[0]["id"]
        searched_preview_url = searched_tracks[0]["preview_url"]
        
        if searched_track_artist.lower() != artist_name.lower() and searched_track_name.lower() != track_name.lower():
            searched_df.loc[len(searched_df)] = search_except(track_name=track_name, artist_name=artist_name, search_except='not matched')
            continue
        
        searched_df.loc[len(searched_df)] = pd.Series(
            {
                "searched_track_name": searched_track_name, 
                "searched_track_artist": searched_track_artist, 
                "searched_track_id": searched_track_id, 
                "searched_preview_url": searched_preview_url,
                }
            )
    return searched_df
    

if __name__ == '__main__':
    args = paser_args()
    headers = set_headers(args)
    song_artist_df = pd.read_csv(args.base_df)
    searched_df = create_df(headers, song_artist_df)
    searched_df.to_csv(args.end_df, index=False)

