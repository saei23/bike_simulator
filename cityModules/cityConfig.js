const cities = require('./cities')
const {fetchCity, boundsFromPolygon} = require('./cityBound')

const getRandomPointInCity = async (cityName) => {
  try {
    const theCity = cities[cityName];
    if (!theCity) {
      console.log(`Hittade ingen stad med namn ${cityName}`);
      return null;
    }

    const city = await fetchCity(theCity.id)
    if (!city) {
      console.log(`Hittade ingen stad med id ${theCity.id}`);
      return null;
    }

    const boundary = city.data.boundary;
    if (!boundary || !boundary.coordinates || boundary.coordinates.length === 0) {
      console.log(`Stadens gränser är ogiltiga för ${cityName}`);
      return null;
    }

    const { latMin, latMax, lngMin, lngMax } = boundsFromPolygon(boundary);

    return {
      lat: Math.random() * (latMax - latMin) + latMin,
      lng: Math.random() * (lngMax - lngMin) + lngMin,
    };
  } catch (error) {
    console.error('kunde ej hämta route', error.message);
    return null;
  }
};

module.exports = getRandomPointInCity
