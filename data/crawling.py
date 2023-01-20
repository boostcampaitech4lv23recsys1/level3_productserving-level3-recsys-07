import requests
import json
import argparse
import pandas as pd
from urllib.parse import quote
from tqdm import tqdm
import re
import math


def paser_args():
    parser = argparse.ArgumentParser()
    parser.add_argument("--id", default='6b9dab94cd04470fbe8086626bdd230b', type=str, help="client_id")
    parser.add_argument("--secret", default="615cf34912b74d44a45986937c5c0a91", type=str, help="client_secret")
    parser.add_argument("--base_df", default="song_artist_v2/song_artist_part2.csv", type=str, help="csv name") # ./data/song_artist_part_2.csv
    parser.add_argument("--end_df", default="searched_df_v2/searched_df_part2_1.csv", type=str, help="csv name") # ./data/searched_df_part_2.csv
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
    market:str = 'kr',):

    import re
    
    APIBASE = "https://api.spotify.com/v1/search"
    # pattern = r'\([^)]*\)'
    # artist_q = re.sub(pattern=pattern, repl='', string=artist_name).replace(" ", "")
    # track_q = re.sub(pattern=pattern, repl='', string=track_name).replace(" ", "")
    # query_and = f"{artist_q}{track_q}"
    query_or = f"{artist_name} {track_name}"
    
    try:
        response = requests.get(
            f"{APIBASE}?q={query_or}&type=track&market={market}",
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


def name_check(name:str, type:str):
    if type == "track":
        pattern = r'\([^)]*\)'
        new_name = re.sub(pattern=pattern, repl='', string=name).replace(" ", "").lower()
    elif type == "artist":
        new_name = name.replace(" ", "").lower()
    return new_name


def create_df(headers, base_df):
    searched_df = pd.DataFrame(columns=[
        "searched_track_artist",
        "searched_track_name",
        "searched_track_id",
        "searched_preview_url",
        ])
    excpt_cnt = 0

    for track_name, artist_name, track_id, preview_url \
    in zip(tqdm(base_df.song_name), base_df.artist_name_basket, base_df.searched_track_id, base_df.searched_preview_url):
        # if track_id != None:
        #     searched_df.loc[len(searched_df)] = pd.Series(
        #     {
        #         "searched_track_name": track_name, 
        #         "searched_track_artist": artist_name, 
        #         "searched_track_id": track_id, 
        #         "searched_preview_url": preview_url,
        #         }
        #     )
        #     continue
        response = search_with_query(headers, track_name, artist_name)
        
        if response.status_code == 400:
            searched_df.loc[len(searched_df)] = search_except(track_name=track_name, artist_name=artist_name, search_except='code 400')
            continue

        try:searched_tracks = response.json()["tracks"]["items"]
        except json.decoder.JSONDecodeError:
            excpt_cnt +=1
            print(f"JSONDecodeError: {response.text}")
            break
        except KeyError:
            excpt_cnt +=1
            print(f"First KeyError | count: {excpt_cnt}")
            searched_df.loc[len(searched_df)] = search_except(track_name=track_name, artist_name=artist_name, search_except='KeyError')
            continue
        
        if searched_tracks == []:
            searched_df.loc[len(searched_df)] = search_except(track_name=track_name, artist_name=artist_name, search_except='vacant item')
            continue
        
        try:
            searched_track_name = pd.json_normalize(searched_tracks)['name']
            searched_track_artist = pd.json_normalize(searched_tracks, record_path='artists')['name']
            searched_track_id = pd.json_normalize(searched_tracks)['id']
            searched_preview_url = pd.json_normalize(searched_tracks)['preview_url']
        except KeyError:
            excpt_cnt +=1
            print(f"Second KeyError | count: {excpt_cnt}")
            continue

        index_list = []
        idx = 0
        for searched_track_name, searched_track_artist, searched_track_id, searched_preview_url \
        in zip(searched_track_name, searched_track_artist, searched_track_id, searched_preview_url):
            if (name_check(searched_track_name, type="track") == name_check(track_name, type="track"))\
            and ((name_check(searched_track_artist,type="artist") in name_check(artist_name,type="artist")) or (name_check(artist_name,type="artist") in name_check(searched_track_artist,type="artist"))):
                if searched_track_id is not None and searched_preview_url is not None:
                    index_list.append(idx)
                    continue
                index_list.append(idx)
            idx += 1
        
        if len(index_list) > 0:
            searched_track_name = track_name
            searched_track_artist = artist_name
            searched_track_id = pd.json_normalize(searched_tracks)['id'][index_list[-1]]
            searched_preview_url = pd.json_normalize(searched_tracks)['preview_url'][index_list[-1]]
        elif len(index_list) == 0:
            searched_df.loc[len(searched_df)] = search_except(track_name=track_name, artist_name=artist_name, search_except='no result')
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
    searched_df = create_df(headers, song_artist_df[:])
    searched_df.to_csv(args.end_df, index=False)

