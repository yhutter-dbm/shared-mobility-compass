from geopy.geocoders import Nominatim
from geopy.distance import geodesic
from flask import json
import pandas as pd
import os

class StationService:
	def __init__(self, app):
		# Load all station information once in the beginning
		self.station_information = self.load_stations(app)

		# Setup geolocator
		self.geolocator = Nominatim(user_agent="shared_mobility_compass")

	def load_stations(self, app):
		station_information_path = os.path.join(
			app.static_folder, 'shared_mobility', 'station_information.json')
		with open(station_information_path, encoding='utf-8') as json_file:
			json_data = json.load(json_file)
		return pd.json_normalize(json_data["data"]["stations"])

	def stations_from_location(self, address, radius):
		location = self.geolocator.geocode(address)
		# Optimization for querying stations in range, implemented with reference to: https://engineering.upside.com/a-beginners-guide-to-optimizing-pandas-code-for-speed-c09ef2c6a4d6#:~:text=Vectorization%20is%20the%20process%20of,check%20out%20the%20Pandas%20docs)
		# Sadly a vectorization approach is not possible as the geodesic function does not seem to support arrays of tubles...
		return self.station_information[self.station_information.apply(lambda row: geodesic((row['lat'], row['lon']), (location.latitude, location.longitude)).km <= radius, axis=1)]