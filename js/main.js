function initMap() {
  const map = new google.maps.Map(document.getElementById("mapContainer"), {
    center: { lat: 47.3769, lng: 8.5417 },
    zoom: 12,
    mapId: "533f9f6f21762ace",
  });
}

function _openSearch() {
  searchContainer.classList.toggle("open");
}

function _openFilter() {
  filterContainer.classList.toggle("open");
}

// Get reference to button elements and register click handler
const searchButton = document.getElementById("searchButton");
const searchContainer = document.getElementById("searchContainer");
searchButton.addEventListener("click", () => _openSearch());

const filterButton = document.getElementById("filterButton");
const filterContainer = document.getElementById("filterContainer");
filterButton.addEventListener("click", () => _openFilter());
