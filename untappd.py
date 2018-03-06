"""Module to call Untappd API and return data for user."""
import requests

BASE_QUERY = 'https://api.untappd.com/v4/'


def user_info(username):
    """Get basic bio information about user and return data."""
    endpoint = 'user/info/{}?compact=true&client_id={}&client_secret={}'.format(username,
                                                                                CLIENT_ID,
                                                                                CLIENT_KEY)
    r = requests.get(BASE_QUERY + endpoint)
    response = r.json()

    base_resp = response['response']['user']
    location = base_resp['location']
    if location == '':
        location = 'No location provided'
    beers = base_resp['stats']['total_beers']
    checkins = base_resp['stats']['total_checkins']
    friends = base_resp['stats']['total_friends']
    return {'username': username,
            'location': location,
            'total_beers': beers,
            'total_checkins': checkins,
            'friends': friends
            }


def user_badges(username):
    """Get badge information for user and return data."""
    endpoint = 'user/badges/{}?compact=true&client_id={}&client_secret={}'.format(username,
                                                                                  CLIENT_ID,
                                                                                  CLIENT_KEY)
    r = requests.get(BASE_QUERY + endpoint)
    response = r.json()

    recent_badge = response['response']['items'][0]['badge_name']
    recent_date = response['response']['items'][0]['earned_at']

    return {'recent_badge': recent_badge,
            'recent_date': recent_date
            }


def user_beers(username):
    """Get beer information for user and return data."""
    endpoint = 'user/beers/{}?compact=true&client_id={}&client_secret={}'.format(username,
                                                                                 CLIENT_ID,
                                                                                 CLIENT_KEY)
    r = requests.get(BASE_QUERY + endpoint)
    response = r.json()

    base_resp = response['response']['beers']['items']
    recent_beer_name = base_resp[0]['beer']['beer_name'] + ' ' + base_resp[0]['brewery']['brewery_name']
    return recent_beer_name
