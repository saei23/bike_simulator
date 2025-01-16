const { io } = require('socket.io-client')
const getRouteInStockholm = require('./routePlaning')

const simulateTrip = async (bike_id, tripId, user_id) => {
  const socket = io('http://localhost:5001')


  const route = await getRouteInStockholm()
  if(route.length == 0) {
    console.error('Failed to generate a route')
    return;
  }

  socket.emit('join-trip-room', (tripId))
  // console.log(`Trip ${tripId}: Route generated with ${route.length} points.`)

  let currentIndex = 0
  
  const updatePosition = () => {
    if (currentIndex >= route.length) {
      // console.log(`Trip ${tripId} simulation completed`)
      clearInterval(intervalId)
      socket.disconnect()
      return
    }

    const currectPosition = route[currentIndex++]

    const data = {
      tripId,
      user_id,
      bike_id,
      location: {
        coordinates: [currectPosition[1], currectPosition[0]]
      },
      battery_level: 100
    }

    socket.emit('update-position', data)
    // console.log(data)
  }

  const intervalId = setInterval(updatePosition, 1000 + Math.random() * 500)

}

// simulateTrip(
//   'bike123',
//   'trip456'
// )

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const simulateMultipleBikes = async () => {
  const tripIds = Array.from({ length: 3000 }, (_, i) => `user${i + 1}`);
  const userIds = Array.from({ length: 3000 }, (_, i) => `trip${i + 1}`);
  const bikeIds = Array.from({ length: 3000 }, (_, i) => `bike${i + 1}`);

  for (let i = 0; i < bikeIds.length; i++) {
    await simulateTrip(tripIds[i], userIds[i], bikeIds[i]);
    await sleep(200);
  }
};


simulateMultipleBikes();

// const axios = require('axios');

// // Konfigurera antalet cyklar och backend-API-url
// const NUMBER_OF_BIKES = 1000;
// const API_BASE_URL = 'http://localhost:5001/api/bikes';
// const UPDATE_INTERVAL = 5000;

// // Skapa en array av simulerade cyklar som GeoJSON-features
// const bikes = Array.from({ length: NUMBER_OF_BIKES }, (_, index) => ({
//   type: 'Feature',
//   properties: {
//     id: `bike-${index + 1}`,
//     status: 'available' // Status: 'available', 'rented', 'maintenance'
//   },
//   geometry: {
//     type: 'Point',
//     coordinates: [randomCoordinate(17.9, 18.2), randomCoordinate(59.3, 60.0)] // [longitude, latitude]
//   }
// }));

// // Slumpmässig koordinat inom ett intervall
// function randomCoordinate(min, max) {
//   return (Math.random() * (max - min) + min).toFixed(6);
// }

// // Simulera uppdatering av cyklarnas positioner och status
// function updateBikes() {
//   bikes.forEach((bike) => {
//     // Uppdatera cykelns position (geometry.coordinates)
//     bike.geometry.coordinates[0] = (parseFloat(bike.geometry.coordinates[0]) + randomDrift()).toFixed(6);
//     bike.geometry.coordinates[1] = (parseFloat(bike.geometry.coordinates[1]) + randomDrift()).toFixed(6);

//     // Möjlighet att ändra status
//     if (Math.random() < 0.01) {
//       bike.properties.status = bike.properties.status === 'available' ? 'rented' : 'available';
//     }

//     // Skicka uppdatering till backend
//     sendBikeUpdate(bike);
//   });
// }

// // Skicka en cykels GeoJSON-data till backend
// async function sendBikeUpdate(bike) {
//   try {
//     await axios.post(API_BASE_URL, bike);
//     console.log(`Uppdaterade GeoJSON-data för ${bike.properties.id}`);
//   } catch (error) {
//     console.error(`Fel vid uppdatering av ${bike.properties.id}:`, error.message);
//   }
// }

// // Slumpmässig liten förändring för simulering av rörelse
// function randomDrift() {
//   return (Math.random() - 0.5) * 0.01;
// }

// // Starta simuleringen
// console.log(`Startar GeoJSON-simulering för ${NUMBER_OF_BIKES} cyklar...`);
// setInterval(updateBikes, UPDATE_INTERVAL);
