const express = require('express');
const { io } = require('socket.io-client');
const { cities } = require('../city/cityConfig')
const getRouteInCity = require('../routePlaning');
const axios = require('axios');
const turf = require('@turf/turf');


const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5001';

const socket = io(BACKEND_URL);
const app = express();
const port = 4000;

let trips = [];
let routes = {};

app.use(express.json());

const initTrips = async (cityName, tripsCount) => {
  try {
    console.log(`Lägger till ${tripsCount} resor 1 ${cityName}...`);
    const newTrips = Array.from({ length: tripsCount }, (_, index) => ({
      trip_id: `${trips.length + index + 1}`,
      user: {
        user_id: `${trips.length + index + 1}`,
        account_balance: 10000
      },
      bike: {
        _id: `${trips.length + index + 1}`,
        bike_id: `${trips.length + index + 1}`,
        location: { coordinates: [0, 0] },
        battery_level: Math.floor(Math.random() * (100 - 20 + 1)) + 20,
        speed: Math.random() * (20 - 5) + 5,
        status: 'available',
        message: '',
      },
      routeIndex: 0,
      city: cityName,
      cost: 10,
      message: '',
      hasCharged: false,
      isOutsideCity: false,
    }));

    for (const trip of newTrips) {
      const route = await getRouteInCity(cityName);
      if (!route || route.length === 0) {
        console.warn(`Hittade ingen resa för ${trip.trip_id}`);
        continue;
      }

      routes[trip.trip_id] = route;
      trip.bike.location.coordinates = [route[0][1], route[0][0]];
      trip.bike.status = 'in-use';
      trips.push(trip);
      socket.emit('join-trip-room', trip.trip_id);
      socket.emit('update-position', trip);
    }

    console.log(`La till ${newTrips.length} resor.`);
  } catch (error) {
    console.error('Misslyckades me att skapa resor:', error.message);
  }
};

// API endpoint to dynamically add trips
app.post('/add-trips', async (req, res) => {
  const { city, trips: tripsCount } = req.body;
  if (!city || !tripsCount) {
    return res.status(400).send("Stad och antal resor");
  }

  console.log(`La till ${tripsCount} resor för ${city}...`);
  await initTrips(city, tripsCount);
  res.status(200).send(`La till ${tripsCount} resor.`);
});

async function updateTrip() {
  const tripsToRemove = [];
  const promises = trips.map(async (trip) => {
    const route = routes[trip.trip_id];
    if (route && route.length > 0) {

      let isOutsideCity = trip.isOutsideCity;

      if (trip.bike.status === 'in-use') {
        trip.bike.battery_level -= 0.25;
        trip.bike.speed += (Math.random() - 0.5) * 1;
        if (trip.bike.speed < 5) trip.bike.speed = 5;
        if (trip.bike.speed > 20) trip.bike.speed = 20;
      }

      if (trip.bike.status === 'in-use') {
        trip.cost += 1; 
      }
      const theCity = cities[trip.city];
      const cityBoundary = await axios
        .get(`${BACKEND_URL}/api/v1/city/${theCity.id}`)
        .then((response) => response.data.boundary.coordinates[0])
        .catch((err) => {
          console.error(`Kunde inte hämta gränser ${trip.city}:`, err.message);
          return null;
        });

      if (cityBoundary) {
        const polygon = turf.polygon([cityBoundary]);
        const [lat, lng] = route[trip.routeIndex];
        const point = turf.point([lng, lat]);
        isOutsideCity = !turf.booleanPointInPolygon(point, polygon);
        
        trip.isOutsideCity = isOutsideCity;

        if (isOutsideCity) {
          trip.bike.message = 'Varning: Du är utanför standens gränser!';
        } else {
          trip.bike.message = '';
        }
      }

      if (trip.bike.battery_level <= 0 || trip.routeIndex === route.length - 1) {

        if (trip.isOutsideCity) {
          trip.cost += 1500
          trip.message = '+ 1500 pga av att cykeln är utanför gränser'
        }

        if (!trip.hasCharged) {
          trip.user.account_balance -= trip.cost;
          trip.hasCharged = true; 
        }

        if (trip.bike.battery_level <= 0) {
          trip.bike.status = 'maintenance'
          trip.bike.speed = 0;
          trip.bike.message = 'Cykeln är död'
          tripsToRemove.push(trip.trip_id);
        } else {
          trip.bike.status = 'available';
          trip.bike.speed = 0;
          trip.bike.message = 'Resa klar!';
          tripsToRemove.push(trip.trip_id);
        }
        
        socket.emit('update-position', trip);
        return;
      }

      trip.routeIndex = (trip.routeIndex + 1) % route.length;
      const [lat, lng] = route[trip.routeIndex];
      trip.bike.location.coordinates = [lng, lat];

      trip.bike.status = 'in-use';
      socket.emit('update-position', trip);
    }
  });

  await Promise.all(promises);

  for (const tripId of tripsToRemove) {
    trips = trips.filter((trip) => trip.trip_id !== tripId);
    delete routes[tripId];
  }
}

app.listen(port, () => {
  console.log(`Simulation server running http://localhost:${port}`);
});

setInterval(updateTrip, 1000 + Math.random() * 500);
