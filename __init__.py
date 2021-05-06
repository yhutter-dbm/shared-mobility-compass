from flask import Flask
from flask import render_template
from flask import request
from .services.station_service import StationService 

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
        vehicle_types = request.form.get('vehicleTypes')
        price = request.form.get('price')
        valid_radius = radius != None and radius > 0
        empty_response = {'stations': []}
        if not valid_radius:
            # No valid radius was given therefore no result can be determined.
            return empty_response
        else:
            stations_in_range = station_service.query_stations(address, radius, vehicle_types, price)
            if stations_in_range.empty:
                return empty_response
            return {'stations': stations_in_range.to_json(orient="records")}

    return app