let map = {};

function _openSearch() {
  searchContainer.toggleClass("open");
}

function _openFilter() {
  filterContainer.toggleClass("open");
}



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

//Function Submit
//TODO: Wenn Submit geklickt wird, schick plz und zoom stufe an flask
//TODO2: Wenn Submit geklickt wird ganzes Formular mitschicken, damit liste anhand der Filter einstellungen erstellt werden kann

//Function Get Liste for Markers
//TODO rufe an endpoint liste mit standorten in der umgebung ab
let markierungen = [['markierung1', '7.731537', '47.063618'], ['markierung2', '8.6016', '46.52419'], ['markierung3', '9.54551', '47.3842'], ['markierung4', '9.409512', '47.328598'], ['markierung5', '8.290168', '47.589222']];


//Fuction Set Markers - SEJO
function _setmarkers (markierungen) {
  for (let i = 0; i < markierungen.length; i++) {
    console.log(markierungen[i][0]);
    var marker =  new mapboxgl.Marker({ color: 'red', rotation: 45 })
        .setLngLat([markierungen[i][1], markierungen[i][2]])
        .addTo(map);
    markers.push(marker);
  };
}
//TODO: Marker hoverable machen, damit zusatz Infos angezegit werden

//Fuction clear Markers - SEJO
function _clearmarkers (markers) {
  for (let i = 0; i < markers.length; i++) {
      markers[i].remove();
  };
  markers = [];
}


// Get reference to button elements and register click handlers
const searchButton = $("#searchButton");
const searchContainer = $("#searchContainer");
searchButton.click(() => _openSearch());

const filterButton = $("#filterButton");
const filterContainer = $("#filterContainer");
filterButton.click(() => _openFilter());

_initMapBox();

var markers = [];
_setmarkers(markierungen);
