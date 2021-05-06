from geopy.geocoders import Nominatim
from geopy.distance import geodesic
from flask import json
import pandas as pd
import numpy as np
import os

class StationService:
	def __init__(self, app):
		# Load all relevant information once in the beginning
		self.station_information = self.load_stations(app) # Holds the location of all stations
		self.providers = self.load_providers(app) # Holds information about a provider including its vehicle types etc.

		# Join all relevant information in one big dataframe to allow searching more easily...
		self.df = self.station_information.set_index('station_id').join(self.providers.set_index('provider_id'), lsuffix='_station', rsuffix='_provider', on='provider_id')

		# Setup geolocator
		self.geolocator = Nominatim(user_agent="shared_mobility_compass")

	def load_stations(self, app):
		station_information_path = os.path.join(
			app.static_folder, 'shared_mobility', 'station_information.json')
		with open(station_information_path, encoding='utf-8') as json_file:
			json_data = json.load(json_file)
		return pd.json_normalize(json_data["data"]["stations"])

	def load_providers(self, app):
		providers_path = os.path.join(
			app.static_folder, 'shared_mobility', 'providers.json')
		with open(providers_path, encoding='utf-8') as json_file:
			json_data = json.load(json_file)
		return pd.json_normalize(json_data["data"]["providers"])


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

	def query_stations(self, address, radius, vehicle_types = [], price = None):
		location = self.geolocator.geocode(address)
		empty_result = pd.DataFrame({'A' : []})
		if location == None:
			# In case we found no location we return an empty dataframe...
			return empty_result
		# Optimization for querying stations in range, implemented with reference to: https://engineering.upside.com/a-beginners-guide-to-optimizing-pandas-code-for-speed-c09ef2c6a4d6#:~:text=Vectorization%20is%20the%20process%20of,check%20out%20the%20Pandas%20docs)
		result = self.df[self.haversine(location.latitude, location.longitude, self.df['lat'], self.df['lon']) <= radius]

		# Check if we need to match by vehicle_types, ignore if empty...
		if len(vehicle_types) > 0:
			result = result[result['vehicle_type'].isin(vehicle_types)]
		return result