 const { isPointOusideCity, fetchCity, boundsFromPolygon} = require('../cityModules/cityBound')
 const turf = require('@turf/turf');
 const axios = require('axios');
 
 jest.mock('axios');
 
 const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5001';


describe('City Modules Tests', () => {
  test('boundsFromPolygon should return correct bounds', () => {
    const polygon = turf.polygon([
      [
        [-10, -10],
        [-10, 10],
        [10, 10],
        [10, -10],
        [-10, -10],
      ],
    ]);
    const bounds = boundsFromPolygon(polygon);

    expect(bounds).toEqual({
      latMin: -10,
      latMax: 10,
      lngMin: -10,
      lngMax: 10,
    });
  });

  test('fetchCity should return city data', async () => {
    const cityId = '123';
    const mockCityData = { data: { name: 'Mock City', id: cityId } };
    axios.get.mockResolvedValueOnce(mockCityData);

    const city = await fetchCity(cityId);

    expect(axios.get).toHaveBeenCalledWith(`${BACKEND_URL}/api/v1/city/${cityId}`);
    expect(city).toEqual(mockCityData);
  });

  test('fetchCity should return null for errors', async () => {
    const cityId = '123';
    axios.get.mockRejectedValueOnce(new Error('Network Error'));

    const city = await fetchCity(cityId);

    expect(axios.get).toHaveBeenCalledWith(`${BACKEND_URL}/api/v1/city/${cityId}`);
    expect(city).toBeNull();
  });

  test('isPointOusideCity should detect points outside the city', () => {
    const cityBoundary = [
      [-10, -10],
      [-10, 10],
      [10, 10],
      [10, -10],
      [-10, -10],
    ];
    const insidePoint = [0, 0];
    const outsidePoint = [15, 15];

    expect(isPointOusideCity(cityBoundary, insidePoint)).toBe(false);
    expect(isPointOusideCity(cityBoundary, outsidePoint)).toBe(true);
  });
});