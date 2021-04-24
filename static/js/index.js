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

// Get reference to button elements and register click handlers
const searchButton = $("#searchButton");
const searchContainer = $("#searchContainer");
searchButton.click(() => _openSearch());

const filterButton = $("#filterButton");
const filterContainer = $("#filterContainer");
filterButton.click(() => _openFilter());

_initMapBox();
