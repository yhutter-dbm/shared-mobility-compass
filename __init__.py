from flask import Flask
from flask import render_template
from flask import request
from flask import jsonify
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


    @app.route('/stations', methods=['POST'])
    def stations():
        address = request.form.get('address')
        radius = int(request.form.get('radius'))
        vehicle_types = request.form.getlist('vehicleTypes[]')
        location, stations = station_service.query_stations(address, radius, vehicle_types)
        longitude = None
        latitude = None
        if location != None:
            longitude = location.longitude
            latitude = location.latitude
        if stations.empty:
            return {'stations': [], 'longitude': longitude, 'latitude': latitude }
        return {'stations': stations.to_json(orient="records"), 'longitude': longitude, 'latitude': latitude }


    @app.route('/chartData', methods=['POST'])
    def charts():
        address = request.form.get('address')
        radius = int(request.form.get('radius'))
        location, stations = station_service.query_stations(address, radius)
        if stations.empty:
            return {'barChart': None, 'bubbleChart': None}

        stations = stations.sort_values(by='vehicle_type', ascending=True)

        # The bar chart as well as the bubble chart use the same data, they just show it in a different way.
        # We show how many stations (grouped by vehicle type) exists, e.g [E-Bike: 10, E-Scooter: 5] etc.
        labels = stations['vehicle_type'].unique().tolist()
        grouped_by_vehicle_type = station_service.group_by_vehicle_type(stations)

        return {'barChartData': { 'labels': labels, 'dataset': grouped_by_vehicle_type.to_json(orient="records") }, 'bubbleChartData': { 'labels': labels, 'dataset': grouped_by_vehicle_type.to_json(orient="records") } }

    return app