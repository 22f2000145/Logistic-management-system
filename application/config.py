class Config():
    DEBUG = False
    SQLALCHEMY_TRACK_MODIFICATIONS = True

class LocalDevelopmentConfig(Config):
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///db.sqlite3'

    #config for security
    SECRET_KEY = 'my_precious'
    SECURITY_PASSWORD_HASH = 'bcrypt' #encryption algorithm
    SECURITY_PASSWORD_SALT = 'my_precious_two'
    
    WTF_CSRF_ENABLED = False
    SECURITY_CSRF_PROTECT_MECHANISMS = []
    SECURITY_CSRF_IGNORE_UNAUTH_ENDPOINTS = True
    
    SECURITY_TOKEN_AUTHENTICATION_HEADER = 'Authentication-Token'

