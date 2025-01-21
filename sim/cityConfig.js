const axios = require('axios')
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5001';

const cities = {
  umea: { id: 5 },
  jonkoping: { id: 1 },
  karlskrona: { id: 2 },
};

const boundsFromPolygon = (polygon) => {
  let latMin = Infinity, latMax = -Infinity, lngMin = Infinity, lngMax = -Infinity;

  polygon.forEach(([lng, lat]) => {
    if (lat < latMin) latMin = lat;
    if (lat > latMax) latMax = lat;
    if (lng < lngMin) lngMin = lng;
    if (lng > lngMax) lngMax = lng;
  });

  return { latMin, latMax, lngMin, lngMax };
};

const getRandomPointInCity = async (city) => {
  try {
    const theCity = cities[city];
    if (!theCity) {
      console.log('Hittade inge stad');
      return null;
    }

    const response = await axios.get(`${BACKEND_URL}/api/city/${theCity.id}`);
    const polygon = response.data.boundary.coordinates[0];

    const { latMin, latMax, lngMin, lngMax } = boundsFromPolygon(polygon);

    return {
      lat: Math.random() * (latMax - latMin) + latMin,
      lng: Math.random() * (lngMax - lngMin) + lngMin,
    };
  } catch (error) {
    console.error('kunde ej hämta route', error.message);
    return null;
  }
};

module.exports = { cities, getRandomPointInCity };
