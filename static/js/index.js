let map = {};
let markers = [];
const searchField = $("#searchField");
const applyFilterButton = $("#applyFilterButton");
const vehicleTypeBadges = $(".uk-badge");


function _initMapBox() {
    let latitude = 47.3769;
    let longitude = 8.5417;
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                latitude = position.coords.latitude;
                longitude = position.coords.longitude;
                map.flyTo({ center: [longitude, latitude] });
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

function _clearMarkers(markers) {
    markers.forEach(marker => {
        // Remove from map.
        marker.remove();
    });
    markers = [];
}


function _createMarkersFromStations(stations) {
    const markers = stations.map(station => {
        const marker = new mapboxgl
            .Marker({ color: 'black', rotation: 45 })
            .setLngLat([station.lon, station.lat])
            .setPopup(new mapboxgl.Popup().setHTML(
                `
                <b>Station Name</b></br>
                <p>${station.name}</p></br>
                <b>Provider: </b><p>${station.provider}</p></br>
                <b>Vehicle Typ: </b><p>${station.vehicle_type}</p></br>
                <b>URL: </b><p>${station.url ? station.url : 'n/a'}</p></br>
                `
            ));
        return marker;
    });
    return markers;
}

function _doStationsRequest(address, radius, flyTo, vehicleTypes = [], ) {
    NProgress.start();
    $.post('stations', { 'address': address, 'radius': radius, 'vehicleTypes[]': vehicleTypes }, (response) => {
        // Clear all previous markers
        _clearMarkers(markers);
        if (response.stations && response.stations.length > 0) {
            // We need to convert the stringify json into actual data
            response.stations = JSON.parse(response.stations);

            // Create new markers depending on the response
            markers = _createMarkersFromStations(response.stations);

            // Add each one to the map
            markers.forEach(marker => {
                marker.addTo(map);
            });

        } else {
            _sendNotification("No results were found...");
        }

        // Move to new location if we get a valid result back
        if (!!response.longitude && !!response.latitude && flyTo) {
            map.flyTo({ center: [response.longitude, response.latitude] });
        }
        NProgress.done();
    }).fail(function(error) {
        NProgress.done();
        _sendNotification("An error occurred...");
    });
}

function _calculateRadius() {
    return Math.floor(66 / map.getZoom());;
}


function _handleSearch() {
    // Get relevant information the user has entered
    const address = searchField.val().trim();

    if (!address) {
        _sendNotification("No address was entered");
        return;
    }

    _clearFilters();

    const radius = _calculateRadius();
    _doStationsRequest(address, radius, true);
}

function _clearFilters() {
    // Unselect all badges...
    vehicleTypeBadges.removeClass('selected')
}

function _handleFilters() {
    const selectedVehicleTypeBadges = $(".uk-badge.selected")

    // Create a list containing the HTML Text of each selected badge
    const vehicleTypes = $.isEmptyObject(selectedVehicleTypeBadges) ? [] : selectedVehicleTypeBadges.toArray().map((v) => v.innerHTML);
    const address = searchField.val().trim();

    if (!address) {
        _sendNotification("No address was entered");
        return;
    }

    const radius = _calculateRadius();
    _doStationsRequest(address, radius, false, vehicleTypes);
}

// Register event handlers
searchField.on('keyup', (event) => {
    if (event.key === 'Enter' || event.keyCode === 13) {
        event.preventDefault();
        _handleSearch();
    }
});

// Handle filtering
applyFilterButton.click((event) => {
    // Prevent the default behaviour and handle the request ourselves.
    event.preventDefault();
    _handleFilters();
});


// Apply selected class on badges when they are clicked...
vehicleTypeBadges.click((event) => {
    $(event.target).toggleClass("selected")
});

_initMapBox();