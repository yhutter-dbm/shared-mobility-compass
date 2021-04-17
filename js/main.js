function _openSearch() {
  searchContainer.classList.toggle("open");
}

function _openFilter() {
  filterContainer.classList.toggle("open");
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
const searchButton = document.getElementById("searchButton");
const searchContainer = document.getElementById("searchContainer");
searchButton?.addEventListener("click", () => _openSearch());

const filterButton = document.getElementById("filterButton");
const filterContainer = document.getElementById("filterContainer");
filterButton?.addEventListener("click", () => _openFilter());

// Only initialize mapbox when we are on index.html or simply the initial route without any .html in the url.
const mapRoute = window.location.href.indexOf('index.html') >= 0 || window.location.href.indexOf('.html') < 0;

if (mapRoute) {
  _initMapBox();
}
