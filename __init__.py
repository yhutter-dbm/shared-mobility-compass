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


    @app.route('/stations_from_address', methods=['GET'])
    def stations_from_address():
        address = request.args.get('address')
        radius = int(request.args.get('radius'))
        valid_radius = radius != None and radius > 0

        if not valid_radius:
            # No valid radius was given therefore no result can be determined.
            return {'stations': []}
        else:
            result = {'stations': []}
            stations_in_range = station_service.stations_from_location(address, radius)
            return {'stations': stations_in_range.to_json(orient="records")}

    return app