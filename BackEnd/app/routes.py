from flask import Flask, request, jsonify
from app import app
from datetime import datetime
from .db import mongo

@app.route('/register', methods=['POST'])
def register_event():
    data = request.json
    try:
        if 'event_type' in data and 'description' in data:
            events = mongo.db.eventlogs
            event = {
                'event_type': data['event_type'],
                'event_date': datetime.now(),
                'description': data['description']
            }
            events.insert_one(event)
            return jsonify({'message': 'Event registered successfully'}), 201
        else:
            return jsonify({'error': 'Incomplete data'}), 400
    except:
        return jsonify({'error': 'Internal Server Error)'}), 500

@app.route('/query', methods=['GET'])
def query_events():
    filters = {}    
    try:
        event_type = request.args.get('event_type')
        if event_type:
            filters['event_type'] = event_type

        start_date = request.args.get('start_date')
        if start_date:
            filters['event_date'] = {'$gte': datetime.strptime(start_date, '%Y-%m-%d')}

        end_date = request.args.get('end_date')
        if end_date:
            filters.setdefault('event_date', {})['$lte'] = datetime.strptime(end_date, '%Y-%m-%d')

        events = mongo.db.eventlogs.find(filters)
        event_list = [
            {
                'event_type': event['event_type'],
                'event_date': event['event_date'],
                'description': event['description']
            }
            for event in events
        ]
        return jsonify(event_list)
    except:
        return jsonify({'error': 'Internal Server Error)'}), 500