from flask_pymongo import PyMongo
from app import app

app.config['MONGO_URI'] = 'mongodb://localhost/Registration'
mongo = PyMongo(app)