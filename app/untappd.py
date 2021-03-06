"""Module with functions to call Untappd API and return data for user."""
import os

import requests

BASE_QUERY = 'https://api.untappd.com/v4/'

KEY = os.environ.get('CLIENT_KEY')

ID = os.environ.get('CLIENT_ID')


def user_info(username):
    """Get basic bio information about user and return data."""
    endpoint = 'user/info/{}?client_id={}&client_secret={}'.format(username,
                                                                   ID,
                                                                   KEY)
    r = requests.get(BASE_QUERY + endpoint)
    response = r.json()

    base_resp = response['response']['user']
    location = base_resp['location']
    if location == '':
        location = 'No location provided'
    beers = base_resp['stats']['total_beers']
    checkins = base_resp['stats']['total_checkins']
    friends = base_resp['stats']['total_friends']
    avatar = base_resp['user_avatar']
    return {'username': username,
            'location': location,
            'total_beers': beers,
            'total_checkins': checkins,
            'friends': friends,
            'avatar': avatar,
            }


def user_badges(username):
    """Get badge information for user and return data."""
    endpoint = 'user/badges/{}?compact=true&client_id={}&client_secret={}'.format(username,
                                                                                  ID,
                                                                                  KEY)
    r = requests.get(BASE_QUERY + endpoint)
    response = r.json()

    recent_badge = response['response']['items'][0]['badge_name']
    recent_date = response['response']['items'][0]['earned_at']

    return {'recent_badge': recent_badge,
            'recent_date': recent_date
            }


def user_beers(username):
    """Get unique beer information for user and return data."""
    offset = 0
    all_beers = {}
    while True:
        endpoint = 'user/beers/{}?limit=50&offset={}&client_id={}&client_secret={}'.format(username,
                                                                                           offset,
                                                                                           ID,
                                                                                           KEY)
        r = requests.get(BASE_QUERY + endpoint)
        response = r.json()

        for item in response['response']['beers']['items']:
            all_beers.setdefault(item['beer']['bid'], item)
        if len(response['response']['beers']['items']) < 50 or len(all_beers) >= 500:
            break
        offset += 50
        print(len(all_beers))
    return all_beers
