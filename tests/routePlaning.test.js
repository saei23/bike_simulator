// const axios = require('axios');
// const MockAdapter = require('axios-mock-adapter');
// const getRouteInCity = require('../routePlaning/routePlaning'); // Assuming routePlanning.js is in this location

// // Create an instance of axios-mock-adapter
// const mock = new MockAdapter(axios);

// describe('Route Planning Tests', () => {
//   afterEach(() => {
//     // Reset the mock after each test to clear any previous mock setups
//     mock.reset();
//   });

//   it('should return a valid route from the start point to the end point', async () => {
//     const start = { lat: 59.3293, lng: 18.0686 }; // Coordinates for Stockholm
//     const end = { lat: 59.3341, lng: 18.0634 }; // Another location in Stockholm

//     // Mock the axios.get response for the route API
//     mock.onGet('https://router.project-osrm.org/route/v1/bike/18.0686,59.3293;18.0634,59.3341?overview=full&geometries=geojson&steps=false').reply(200, {
//       routes: [{
//         geometry: {
//           coordinates: [
//             [18.0686, 59.3293],
//             [18.0634, 59.3341],
//           ],
//         },
//       }],
//     });

//     // Call the function that fetches the route
//     const route = await getRouteInCity('stockholm');

//     // Assert that the route is returned correctly
//     expect(route).toEqual([
//       [59.3293, 18.0686],
//       [59.3341, 18.0634],
//     ]);
//   });

//   it('should handle no route found and return an empty array', async () => {
//     const start = { lat: 59.3293, lng: 18.0686 };
//     const end = { lat: 59.3341, lng: 18.0634 };

//     // Mock the axios.get response with no route found
//     mock.onGet('https://router.project-osrm.org/route/v1/bike/18.0686,59.3293;18.0634,59.3341?overview=full&geometries=geojson&steps=false').reply(200, {
//       routes: [],
//     });

//     const route = await getRouteInCity('stockholm');
    
//     // Assert that no route was found and an empty array is returned
//     expect(route).toEqual([]);
//   });

//   it('should handle errors in the route fetching process', async () => {
//     const start = { lat: 59.3293, lng: 18.0686 };
//     const end = { lat: 59.3341, lng: 18.0634 };

//     // Mock the axios.get to simulate an error response
//     mock.onGet('https://router.project-osrm.org/route/v1/bike/18.0686,59.3293;18.0634,59.3341?overview=full&geometries=geojson&steps=false').reply(500);

//     const route = await getRouteInCity('stockholm');
    
//     // Assert that the route fetching failed and returned an empty array
//     expect(route).toEqual([]);
//   });

//   it('should fetch random points in the city and return a valid route', async () => {
//     // Mock getRandomPointInCity to return predefined points
//     const mockGetRandomPointInCity = jest.fn()
//       .mockResolvedValueOnce({ lat: 59.3293, lng: 18.0686 }) // Start point
//       .mockResolvedValueOnce({ lat: 59.3341, lng: 18.0634 }); // End point

//     // Use a mock function for getRandomPointInCity inside the routePlanning.js
//     jest.mock('../cityModules/cityConfig', () => ({
//       getRandomPointInCity: mockGetRandomPointInCity,
//     }));

//     const route = await getRouteInCity('stockholm');

//     // Assert the route is returned correctly
//     expect(route).toEqual([
//       [59.3293, 18.0686],
//       [59.3341, 18.0634],
//     ]);
//   });
// });
