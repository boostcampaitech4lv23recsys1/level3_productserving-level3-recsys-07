import requests
import json

# 플레이 리스트를 생성하고 안에 노래는 하나씩 추가해주는 방식
def createCustomPlayList(headers, new_playlist:list=[]):
    print("headers : ", headers)
    spotify_user_id = "31rzm4yi3fqvvfe236mr2ylmmhje" 
    CREATEPLAYLIST_URL  = f"https://api.spotify.com/v1/users/{spotify_user_id}/playlists"
    
    body = {
        "name": "New Playlist in vscode final",
        "description": "New playlist Our Ease model recommendation",
        "public": True
    }
    body = json.dumps(body)
    
    try:
        response = requests.post(CREATEPLAYLIST_URL, headers=headers, data=body)
    except:
        raise ValueError("CREATE PLAYLIST ERROR")

    # playlist id 저장
    playlist_id = response.json()['id']

    ADDTRACK_URL = f"https://api.spotify.com/v1/playlists/{playlist_id}/tracks"
    uris = ["spotify:track:"+str(track_uri)+"," for track_uri in new_playlist]
    uris = "".join(uris)

    try:
        response = requests.post(f"{ADDTRACK_URL}?uris={uris}", headers=headers)
    except:
        raise ValueError("ADD TRACK ERROR")
    
    return playlist_id