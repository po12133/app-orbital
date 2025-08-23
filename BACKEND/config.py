import os

class Config:
    DEBUG = False
    TESTING = False
    SECRET_KEY = os.environ.get('SECRET_KEY', 'clave_super_secreta')
    SWAGGER = {
        'title': 'Orbit API',
        'uiversion': 3,
        'openapi': '3.0.0'
    }


class DevelopmentConfig(Config):
    DEBUG = True
    FLASK_ENV = 'development'


class ProductionConfig(Config):
    FLASK_ENV = 'production'


class TestingConfig(Config):
    TESTING = True
    FLASK_ENV = 'testing'
