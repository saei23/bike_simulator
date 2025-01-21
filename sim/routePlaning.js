const axios = require('axios')
const dns = require('dns')
const { getRandomPointInCity } = require('./cityConfig')
dns.setDefaultResultOrder('ipv4first');

const getRoute = async (start, end) => {
  try {
    const baseUrl = 'https://router.project-osrm.org/route/v1/bike';
    const coordinates = `${start.lng},${start.lat};${end.lng},${end.lat}`;
    const url = `${baseUrl}/${coordinates}?overview=full&geometries=geojson&steps=false`;

    const response = await axios.get(url);
    const result = response.data.routes?.[0]?.geometry?.coordinates;

    if (!result) {
      console.warn('Inga route hittad');
      return [];
    }

    return result.map(([lng, lat]) => [lat, lng]);
  } catch (error) {
    console.error('Kunde inte hämta route', error.message);
    return [];
  }
};

const getRouteInCity = async (city) => {
  const startPoint = await getRandomPointInCity(city)
  const endPoint = await getRandomPointInCity(city)

  return await getRoute(startPoint, endPoint)
}

module.exports = getRouteInCity
