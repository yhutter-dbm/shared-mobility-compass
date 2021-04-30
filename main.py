from flask import Flask
from flask import render_template
from flask import request
from flask import json
import pandas as pd
import logging
import os

# Setup application
app = Flask("Shared Mobility Compass")

# Debug flag for logging etc.
debug = True

# Only enable logger when not in debug mode...
app.logger.disabled = not debug

if debug:
    app.logger.setLevel(logging.DEBUG)


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
    station_information_path = os.path.join(
        app.static_folder, 'shared_mobility', 'station_information.json')
    with open(station_information_path, encoding='utf-8') as json_file:
        json_data = json.load(json_file)
    # Extract station information and match by post_code if one was provided, otherwise group data by post codes
    stations = pd.json_normalize(json_data["data"]["stations"])
    valid_stations = stations.dropna(subset=['post_code'])
    all_post_codes = valid_stations["post_code"]
    matched_stations = []
    result = {}
    if post_code:
        filtered_stations = valid_stations[valid_stations["post_code"] == str(
            post_code)]
        result = {
            str(post_code): filtered_stations.to_json(orient="records")
        }
    else:
        filtered_stations = valid_stations
        for code in all_post_codes:
            filtered_stations = valid_stations[valid_stations["post_code"] == str(
                code)]
            result[code] = filtered_stations.to_json(orient="records")
    return result


if __name__ == "__main__":
    app.run(debug=debug, port=5000)