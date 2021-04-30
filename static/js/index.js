function _openSearch() {
  searchContainer.toggleClass("open");
}

function _openFilter() {
  filterContainer.toggleClass("open");
}

function _initMapBox() {
  mapboxgl.accessToken =
    "pk.eyJ1IjoieWFubmlja2h1dHRlciIsImEiOiJja24wamRwa3QwZGQyMnVscm4zOGIxN2V0In0.978_7epIiz2f4Wd26ABpwg";
  const map = new mapboxgl.Map({
    container: "mapContainer", // container ID
    style: "mapbox://styles/mapbox/dark-v9", // style URL
    center: [8.5417, 47.3769], // starting position [lng, lat]
    zoom: 12, // starting zoom
  });
}

//Fuction Submit
//TODO

//Function Get Liste for Markers
//TODO
let markierungen = [['markierung1', '7.731537', '47.063618'], ['markierung2', '8.6016', '46.52419'], ['markierung3', '9.54551', '47.3842'], ['markierung4', '9.409512', '47.328598'], ['markierung5', '8.290168', '47.589222']];


//Fuction Set Markers
function _setmarkers (markierungen) {
  for (let i = 0; i < markierungen.length; i++) {
    console.log(markierungen[i][0]);
    var marker =  new mapboxgl.Marker({ color: 'black', rotation: 45 })
        .setLngLat([markierungen[i][1], markierungen[i][2]])
        .addTo(map);
    markers.push(marker);
  };
}

//Fuction clear Markers
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
