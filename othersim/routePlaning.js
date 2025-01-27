const axios = require('axios')
const dns = require('dns')

dns.setDefaultResultOrder('ipv4first');

// const key = '5b3ce3597851110001cf6248e905afefb5cd474eb599d1ca52d165a7'
// const url = `https://api.openrouteservice.org/v2/directions/cycling-regular?api_key=${key}&start=${start.lng},${start.lat}&end=${end.lng},${end.lat}`
// AIzaSyD6lXlQDGjcmVWqIpWLCEdgqNQPgbqWAsA
// const startPoint = { lat: 59.314720, lng: 17.995990}
// const endPoint = { lat: 59.276821, lng: 18.005871}

// const getRandomPoint = () => {
//   const latMin = 59.229
//   const latMax = 59.405
//   const lngMin = 17.803
//   const lngMax = 18.118

//   return {
//     lat: Math.random() * (latMax - latMin) + latMin,
//     lng: Math.random() * (lngMax - lngMin) + lngMin
//   }
// }

const getRandomPoint = () => {
  // Coordinates for Jönköping, Umeå, and Karlskrona with a small margin for randomness
  const locations = [
    {
      name: 'Jönköping',
      latMin: 57.7, latMax: 57.9, lngMin: 14.0, lngMax: 14.3,
    },
    {
      name: 'Umeå',
      latMin: 63.7, latMax: 64.0, lngMin: 20.1, lngMax: 20.5,
    },
    {
      name: 'Karlskrona',
      latMin: 56.1, latMax: 56.2, lngMin: 15.5, lngMax: 15.7,
    }
  ];


  const randomLocation = locations[Math.floor(Math.random() * locations.length)];

  return {
    lat: Math.random() * (randomLocation.latMax - randomLocation.latMin) + randomLocation.latMin,
    lng: Math.random() * (randomLocation.lngMax - randomLocation.lngMin) + randomLocation.lngMin
  };
}

const getRoute = async (start, end) => {
    const baseUrl = 'https://router.project-osrm.org/route/v1/bike'
    const coordinates = `${start.lng},${start.lat};${end.lng},${end.lat}`
    const url = `${baseUrl}/${coordinates}?overview=full&geometries=geojson&steps=false`

    try {
        const response = await axios.get(url)
        const coordinates = response.data.routes[0].geometry.coordinates

        return coordinates.map(([lng, lat]) => [lat, lng]);
    } catch (error) {
        console.error('error', error)
        return []
    }
}

const getRouteInSockholm = async () => {
  const startPoint = getRandomPoint()
  const endPoint = getRandomPoint()

  return await getRoute(startPoint, endPoint)
}

module.exports = getRouteInSockholm

// getRouteInSockholm().then(route => {
//   console.log('random Route', route)
// })