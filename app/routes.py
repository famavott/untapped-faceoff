"""Routes with functions for untappd web app."""
import json

from app import app

from flask import render_template, request

from .untappd import user_badges, user_beers, user_info


@app.route('/')
@app.route('/index')
def index():
    """Return index template."""
    return render_template('index.html', title='home')


@app.route('/userinfo', methods=['POST'])
def userinfo():
    """Return basic user information for untappd account on btn click."""
    username = request.form['username'].strip('"')
    info_dict = user_info(username)
    info_dict['status'] = 'OK'
    return json.dumps(info_dict)

# @app.route('/')
# @app.route('/index')
# def index():
#     """Return index template."""
#     username = 'mfavoino'
#     total_beers = user_info(username)['total_beers']
#     location = user_info(username)['location']
#     total_checkins = user_info(username)['total_checkins']
#     friends = user_info(username)['friends']
#     recent_venue = user_info(username)['recent_venue']

#     return render_template('index.html',
#                            title='home',
#                            total_beers=total_beers,
#                            location=location,
#                            total_checkins=total_checkins,
#                            friends=friends,
#                            recent_venue=recent_venue
#                            )
