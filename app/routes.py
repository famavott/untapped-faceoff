"""Routes with functions for untappd web app."""
from app import app

from flask import render_template

from .handler import untappd_handler

from .untappd import user_badges, user_beers, user_info


@app.route('/')
@app.route('/index')
def index():
    """Return index template."""
    username = 'mfavoino'
    total_beers = user_info(username)['total_beers']
    return render_template('index.html',
                           title='home',
                           total_beers=total_beers,
                           )
