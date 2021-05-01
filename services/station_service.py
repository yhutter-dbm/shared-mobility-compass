from geopy.geocoders import Nominatim
from geopy.distance import geodesic
from flask import json
import pandas as pd
import numpy as np
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


	# Vectorized haversine function from: https://stackoverflow.com/questions/29545704/fast-haversine-approximation-python-pandas
	def haversine(self, lon1, lat1, lon2, lat2):
		"""
		Calculate the great circle distance between two points
		on the earth (specified in decimal degrees)

		All args must be of equal length.    

		"""
		lon1, lat1, lon2, lat2 = map(np.radians, [lon1, lat1, lon2, lat2])

		dlon = lon2 - lon1
		dlat = lat2 - lat1

		a = np.sin(dlat/2.0)**2 + np.cos(lat1) * np.cos(lat2) * np.sin(dlon/2.0)**2

		c = 2 * np.arcsin(np.sqrt(a))
		km = 6367 * c
		return km

	def stations_from_location(self, address, radius):
		location = self.geolocator.geocode(address)
		# Optimization for querying stations in range, implemented with reference to: https://engineering.upside.com/a-beginners-guide-to-optimizing-pandas-code-for-speed-c09ef2c6a4d6#:~:text=Vectorization%20is%20the%20process%20of,check%20out%20the%20Pandas%20docs)
		return self.station_information[self.haversine(location.latitude, location.longitude, self.station_information['lat'], self.station_information['lon']) <= radius]