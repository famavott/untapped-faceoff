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
def user_info_view():
    """Return basic user information for untappd account on inital btn click."""
    username = request.form['username'].strip('"')
    context = {}
    info_dict = user_info(username)
    badge_dict = user_badges(username)
    context.update(info_dict)
    context.update(badge_dict)
    context['status'] = 'OK'
    return json.dumps(context)


@app.route('/userbeers', methods=['POST'])
def user_beers_view():
    """Return all distinct beers for the current user."""
    username = request.form['username'].strip('"')
    context = user_beers(username)
    context['status'] = 'OK'
    return json.dumps(context)
