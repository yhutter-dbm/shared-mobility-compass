from flask import Flask
from flask import render_template
from flask import request
from .services.station_service import StationService 
#import services.station_service

def create_app():
    # Setup application
    app = Flask("shared-mobility-compass")

    app.config.from_pyfile('config.py', silent=False)


    # Initialize station service
    station_service = StationService(app)


    @app.route('/')
    def index():
        return render_template('index.html')


    @app.route('/data')
    def data():
        return render_template('data.html')


    @app.route('/route')
    def route():
        return render_template('route.html')


    @app.route('/shared_mobility_data')
    def shared_mobility_data():
        return render_template('shared-mobility-data.html')


    @app.route('/stations', methods=['POST'])
    def stations():
        address = request.form.get('address')
        radius = int(request.form.get('radius'))
        vehicle_types = request.form.getlist('vehicleTypes[]')
        price = request.form.get('price')
        location, stations = station_service.query_stations(address, radius, vehicle_types, price)
        longitude = None
        latitude = None
        if location != None:
            longitude = location.longitude
            latitude = location.latitude
        if stations.empty:
            return {'stations': [], 'longitude': longitude, 'latitude': latitude }
        return {'stations': stations.to_json(orient="records"), 'longitude': longitude, 'latitude': latitude }
    return app