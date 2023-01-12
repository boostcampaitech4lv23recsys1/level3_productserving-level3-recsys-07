import requests
import json
import argparse
import pandas as pd
from urllib.parse import quote
from tqdm import tqdm



def paser_args():
    parser = argparse.ArgumentParser()
    parser.add_argument("--id", default='4ba6df38cb5d43569bf14bee24682c9f', type=str, help="client_id")
    parser.add_argument("--secret", default="67499f1d094e4e3bb3d920b100c0189d", type=str, help="client_secret")
    parser.add_argument("--base_df", default="./data/song_artist.csv", type=str, help="csv name")
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
    searched_tracks = None
    
    try:
        response = requests.get(
            f"{APIBASE}?q={query_and}&type=track&market={market}",
        headers=headers)
    except:
        print("API limit Error")
        raise ValueError("API limit Error")

    # Extract the search results from the response
    searched_tracks = response.json()["tracks"]["items"]
    return searched_tracks


def create_df(headers, base_df):
    searched_df = pd.DataFrame(columns=[
        "searched_track_artist",
        "searched_track_name",
        "searched_track_id",
        "searched_preview_url",
        "is_searched",
        ])
    for track_name, artist_name in tqdm(zip(base_df.song, base_df.kakao_artist)):
        searched_tracks = search_with_query(headers, track_name, artist_name)
        
        searched_track_name = track_name
        searched_track_artist = artist_name
        searched_track_id = "None"
        searched_preview_url = "None"
        
        # 검색결과가 없거나, 다른 음원이 의심될 때 예외 처리
        if ( searched_track_artist.lower() != artist_name.lower() \
            and searched_track_name.lower() != track_name.lower() 
            ) \
                or searched_tracks == []:
            is_searched = False
        else:
            is_searched = True
            searched_track_name = searched_tracks[0]["name"]
            searched_track_artist = searched_tracks[0]["artists"][0]["name"]
            searched_track_id = searched_tracks[0]["id"]
            searched_preview_url = searched_tracks[0]["preview_url"]
        

        searched_df.loc[len(searched_df)] = pd.Series(
            {
                "searched_track_name": searched_track_name, 
                "searched_track_artist": searched_track_artist, 
                "searched_track_id": searched_track_id, 
                "searched_preview_url": searched_preview_url,
                "is_searched": is_searched,
                }
            )
    return searched_df
    

if __name__ == '__main__':
    args = paser_args()
    headers = set_headers(args)
    song_artist_df = pd.read_csv(args.base_df)
    searched_df = create_df(headers, song_artist_df[:100])
    searched_df.to_csv("./data/searched_df.csv")

