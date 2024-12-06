const axios = require('axios');

// Konfigurera antalet cyklar och backend-API-url
const NUMBER_OF_BIKES = 1000;
const API_BASE_URL = 'http://localhost:5001/api/bikes';
const UPDATE_INTERVAL = 5000;

// Skapa en array av simulerade cyklar som GeoJSON-features
const bikes = Array.from({ length: NUMBER_OF_BIKES }, (_, index) => ({
  type: 'Feature',
  properties: {
    id: `bike-${index + 1}`,
    status: 'available' // Status: 'available', 'rented', 'maintenance'
  },
  geometry: {
    type: 'Point',
    coordinates: [randomCoordinate(17.9, 18.2), randomCoordinate(59.3, 60.0)] // [longitude, latitude]
  }
}));

// Slumpmässig koordinat inom ett intervall
function randomCoordinate(min, max) {
  return (Math.random() * (max - min) + min).toFixed(6);
}

// Simulera uppdatering av cyklarnas positioner och status
function updateBikes() {
  bikes.forEach((bike) => {
    // Uppdatera cykelns position (geometry.coordinates)
    bike.geometry.coordinates[0] = (parseFloat(bike.geometry.coordinates[0]) + randomDrift()).toFixed(6);
    bike.geometry.coordinates[1] = (parseFloat(bike.geometry.coordinates[1]) + randomDrift()).toFixed(6);

    // Möjlighet att ändra status
    if (Math.random() < 0.01) {
      bike.properties.status = bike.properties.status === 'available' ? 'rented' : 'available';
    }

    // Skicka uppdatering till backend
    sendBikeUpdate(bike);
  });
}

// Skicka en cykels GeoJSON-data till backend
async function sendBikeUpdate(bike) {
  try {
    await axios.post(API_BASE_URL, bike);
    console.log(`Uppdaterade GeoJSON-data för ${bike.properties.id}`);
  } catch (error) {
    console.error(`Fel vid uppdatering av ${bike.properties.id}:`, error.message);
  }
}

// Slumpmässig liten förändring för simulering av rörelse
function randomDrift() {
  return (Math.random() - 0.5) * 0.01;
}

// Starta simuleringen
console.log(`Startar GeoJSON-simulering för ${NUMBER_OF_BIKES} cyklar...`);
setInterval(updateBikes, UPDATE_INTERVAL);
