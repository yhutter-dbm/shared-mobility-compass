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


@app.route('/station_information', methods=['GET'])
def station_information():
    # TODO: Cache these results otherwise performance will not be ideal...
    post_code = request.args.get('post_code')
    stations = load_stations(True)
    all_post_codes = stations["post_code"]
    result = {}
    if post_code:
        filtered_stations = stations[stations["post_code"] == str(
            post_code)]
        result = {
            str(post_code): filtered_stations.to_json(orient="records")
        }
    else:
        filtered_stations = stations
        for code in all_post_codes:
            filtered_stations = stations[stations["post_code"] == str(
                code)]
            result[code] = filtered_stations.to_json(orient="records")
    return result

@app.route('/markers', methods=['GET'])
def markers():
    address = request.args.get('address')
    radius = int(request.args.get('radius'))
    valid_radius = radius != None and radius > 0
    location = geolocator.geocode(address)

    if location == None or not valid_radius:
        # No valid location or radius was given...
        return []
    else:
        print(location.address)
        # Check all locations and determine if they are within the given radius
        # Implemented with reference to: https://geopy.readthedocs.io/en/latest/#module-geopy.distance
        result = {'result': []}
        stations = load_stations()

        for index, station in stations.iterrows():
            # It takes (lat, lon)
            lat = station.lat
            lon = station.lon
            station_position = (lat, lon)
            location_position = (location.latitude, location.longitude)
            distance = geodesic(location_position, station_position)
            if distance.km <= radius:
                result['result'].append(station.to_json())
        return result


if __name__ == "__main__":
    app.run(debug=debug, port=5000)
