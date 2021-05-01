from flask import Flask
from flask import render_template
from flask import request
from flask import json
import pandas as pd
import logging
import os
from geopy.geocoders import Nominatim
from geopy.distance import geodesic

# Setup application
app = Flask("Shared Mobility Compass")

# Debug flag for logging etc.
debug = True

# Only enable logger when not in debug mode...
app.logger.disabled = not debug

if debug:
    app.logger.setLevel(logging.DEBUG)

# Setup geopy
geolocator = Nominatim(user_agent="shared_mobility_compass")

def load_stations(drop_if_no_post_code = False):
    station_information_path = os.path.join(
        app.static_folder, 'shared_mobility', 'station_information.json')
    with open(station_information_path, encoding='utf-8') as json_file:
        json_data = json.load(json_file)
    # Extract station information and match by post_code if one was provided, otherwise group data by post codes
    stations = pd.json_normalize(json_data["data"]["stations"])
    if (drop_if_no_post_code):
        return stations.dropna(subset=['post_code'])
    else:
        return stations


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
    location = geolocator.geocode(address)

    if location == None or not valid_radius:
        # No valid location or radius was given therefore no result can be determined.
        return {'stations': []}
    else:
        # Check all locations and determine if they are within the given radius
        # Implemented with reference to: https://geopy.readthedocs.io/en/latest/#module-geopy.distance
        result = {'stations': []}
        stations = load_stations()

        # Optimization for querying stations in range, implemented with reference to: https://engineering.upside.com/a-beginners-guide-to-optimizing-pandas-code-for-speed-c09ef2c6a4d6#:~:text=Vectorization%20is%20the%20process%20of,check%20out%20the%20Pandas%20docs)
        # Sadly a vectorization approach is not possible as the geodesic function does not seem to support arrays of tubles...
        stations_in_range = stations[stations.apply(lambda row: geodesic((row['lat'], row['lon']), (location.latitude, location.longitude)).km <= radius, axis=1)]
        return {'stations': stations_in_range.to_json(orient="records")}


if __name__ == "__main__":
    app.run(debug=debug, port=5000)
