let map = {};
let markers = [];

function _initMapBox() {
  let latitude = 47.3769;
  let longitude = 8.5417;
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
        (position) =>  {
            latitude = position.coords.latitude;
            longitude = position.coords.longitude;
            map.flyTo({center: [longitude, latitude]});
        });
  }
  mapboxgl.accessToken =
    "pk.eyJ1IjoieWFubmlja2h1dHRlciIsImEiOiJja24wamRwa3QwZGQyMnVscm4zOGIxN2V0In0.978_7epIiz2f4Wd26ABpwg";
  map = new mapboxgl.Map({
    container: "mapContainer", // container ID
    style: "mapbox://styles/mapbox/dark-v10", // style URL
    center: [longitude, latitude], // starting position [lng, lat]
    zoom: 12, // starting zoom
  });
}

function _clearMarkers (markers) {
  markers.forEach(marker => {
    // Remove from map.
    marker.remove();
  });
  markers = [];
}


function _createMarkersFromStations(stations) {
  const markers = stations.map(station => {
      const marker = new mapboxgl.Marker({ color: 'black', rotation: 45 }).setLngLat([station.lon, station.lat]);
      return marker;
  });
  return markers;
}


function _handleSearch() {
  // Get relevant information the user has entered
  const address = $("#searchValue").val().trim();

  if (!address) {
    return;
  }

  // TODO: Find fancy formula to determine radius from zoom level.
  const radius = 2;
  $.get( `stations_from_address?address=${address}&radius=${radius}`, (response) =>  {
    if (response.stations) {
      // We need to convert the stringify json into actual data
      response.stations = JSON.parse(response.stations);

      // Clear all previous markers
      _clearMarkers(markers);

      // Create new markers depending on the response
      markers = _createMarkersFromStations(response.stations);

      // Add each one to the map
      markers.forEach(marker => {
        marker.addTo(map);
      });

    }
    else {
      // TODO: Probably have some logic in check to notify the user if nothing was found, e.g stations is empty.      
    }
  }).fail(function(error) {
    alert( error);
  });

}

// Get reference to elements and register click handlers
const filterForm = $("#filterForm");
filterForm.submit((event) => {
  // Prevent the default behaviour and handle the request ourselves.
  event.preventDefault();
  _handleSearch();
})


_initMapBox();
