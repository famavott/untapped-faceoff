"""Flask configuration file."""
import os


class Config(object):
    """Config class object with key from env and debug bool."""

    SECRET_KEY = os.environ.get('SECRET_KEY', '')
    DEBUG = True
