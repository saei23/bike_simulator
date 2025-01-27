const turf = require('@turf/turf')
const axios = require('axios')
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5001';


const fetchCity = async (id) => {
  try {
    const city = await axios.get(`${BACKEND_URL}/api/v1/city/${id}`)
    if (!city) {
      console.log('Hittade inge stad');
      return null
    }
    return city
  } catch (e) {
    console.log('Kunde inte hämta', e.message);
    return null;
  }
}

const boundsFromPolygon = (boundary) => {
  const [lngMin, latMin, lngMax, latMax] = turf.bbox(boundary)

  return { latMin, latMax, lngMin, lngMax };
};

const isPointOusideCity = (cityBoundary, bikePoint) => {
  const [lat, lng] = bikePoint
  const polygon = turf.polygon([cityBoundary])
  const point = turf.point([lng, lat])

  return !turf.booleanPointInPolygon(point, polygon);
}


module.exports = {boundsFromPolygon, fetchCity, isPointOusideCity}