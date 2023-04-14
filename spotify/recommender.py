from dotenv import load_dotenv
import os
import base64
from requests import post, get
import json

load_dotenv()

client_id = os.getenv("CLIENT_ID")
client_secret = os.getenv("CLIENT_SECRET")

# print(client_id, client_secret)

def get_token():
    auth_string = f"{client_id}:{client_secret}"
    auth_bytes = auth_string.encode("utf-8")
    auth_base64 = str(base64.b64encode(auth_bytes), "utf-8")
    # print(auth_string)
    # print(auth_bytes)
    # print(auth_base64)

    url = "https://accounts.spotify.com/api/token"
    headers = {
        "Authorization": f"Basic {auth_base64}",
        "Content-Type": "application/x-www-form-urlencoded"
    }
    data = {"grant_type":"client_credentials"}
    result = post(url, headers=headers, data=data)
    json_result = json.loads(result.content)
    # print(json_result)
    token = json_result["access_token"]
    return token

def get_header(token):
    return {"Authorization":"Bearer " + token}


def search_artist(token, artist_name):
    url = "https://api.spotify.com/v1/search"
    headers = get_header(token)
    query = f"?q={artist_name}&type=artist&market=IN&limit=1"

    query_url = url+query
    result = get(query_url, headers=headers)
    json_result = json.loads(result.content)["artists"]["items"]
    if len(json_result)==0:
        print("No artist of such name exits...")
        return None
    
    
    print("\nThe artist's data : ")
    print("id: " + json_result[0]["id"])
    print("name: " + json_result[0]["name"])
    print("genres: " + ", ".join(json_result[0]["genres"]))
    print("followers: " + str(json_result[0]["followers"]["total"]))
    print("\n")
    return json_result[0]["id"]

def get_related_artists(token, artist_id):
    url = f"https://api.spotify.com/v1/artists/{artist_id}/related-artists"
    headers = get_header(token)

    result = get(url, headers=headers)
    json_result = json.loads(result.content)["artists"]
    return json_result


def get_top_songs_by_artist(token, artist_id):
    url = f"https://api.spotify.com/v1/artists/{artist_id}/top-tracks?market=IN"
    headers = get_header(token)

    result = get(url, headers=headers)
    json_result = json.loads(result.content)["tracks"]
    return json_result    

def get_albums_by_artist(token, artist_id):
    url = f"https://api.spotify.com/v1/artists/{artist_id}/albums?include_groups=album,appears_on,single&market=IN&limit=10"
    headers = get_header(token)
    
    result = get(url, headers=headers)
    json_result = json.loads(result.content)["items"]
    return json_result 

def get_album(token, album_id):
    url = f"https://api.spotify.com/v1/albums/{album_id}?market=IN"
    headers = get_header(token)

    result = get(url, headers=headers)
    json_result = json.loads(result.content)["tracks"]["items"]
    return json_result


# To get the access token
token = get_token()

# To get the id of an artist by just typing the name of the artist
artist_id = search_artist(token, "the local train")

"""
# To get the top tracks of an artist
songs = get_top_songs_by_artist(token, artist_id)
for idx, song in enumerate(songs):
    print(f"{idx+1}, {song['name']}")
"""

"""
# To check the similar artists
related_artists = get_related_artists(token, artist_id)
print("List of related artists : ")
for idx, artist in enumerate(related_artists):
    print(f"id : {artist['id']}, name : {artist['name']}")
    
    # To get the top tracks of an artist
    songs = get_top_songs_by_artist(token, artist['id'])
    for idx, song in enumerate(songs):
        print(f"{idx+1}, {song['name']}")
    print("\n\n")
"""

albums = get_albums_by_artist(token, artist_id)
for idx, album in enumerate(albums):
    print(f"{idx+1}. {album['id']} , {album['name']} , {album['total_tracks']} tracks")
        
    # To get album details
    album_details = get_album(token, album['id'])       
    for idx, song in enumerate(album_details):
        print(f"Track number {song['track_number']}, {song['id']} , {song['name']}")
    print("\n\n")