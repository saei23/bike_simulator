const getRandomPointInCity = require('../cityModules/cityConfig')
const { fetchCity, boundsFromPolygon } = require('../cityModules/cityBound')
const cities = require('../cityModules/cities')

jest.mock('../cityModules/cities', () => ({
  stockholm: { id: 1 },
  malmo: { id: 2 }
}))

jest.mock('../cityModules/cityBound', () => ({
  fetchCity: jest.fn(),
  boundsFromPolygon: jest.fn(() => ({
    latMin: 10,
    latMax: 20,
    lngMin: 30,
    lngMax: 40,
  }))
}))

describe('getRandomPointInCity', () => {
  test('should return a random point within the city bounds', async () => {
    fetchCity.mockResolvedValueOnce({
      data: {
        boundary: {
          coordinates: [[[10, 30], [10, 40], [20, 40], [20, 30], [10, 30]]],
        },
      },
    });

    const point = await getRandomPointInCity('stockholm');

    expect(point).toHaveProperty('lat');
    expect(point).toHaveProperty('lng');
    expect(point.lat).toBeGreaterThanOrEqual(10);
    expect(point.lat).toBeLessThanOrEqual(20);
    expect(point.lng).toBeGreaterThanOrEqual(30);
    expect(point.lng).toBeLessThanOrEqual(40);
  });

  test('should return null if city does not exist', async () => {
    const point = await getRandomPointInCity('NonExistentCity');
    expect(point).toBeNull();
  });

  test('should return null if fetchCity fails', async () => {
    fetchCity.mockResolvedValueOnce(null);

    const point = await getRandomPointInCity('stockholm');
    expect(point).toBeNull();
  });

  test('should return null if city boundary is invalid', async () => {
    fetchCity.mockResolvedValueOnce({
      data: {
        boundary: { coordinates: [] },
      },
    });

    const point = await getRandomPointInCity('stockholm');
    expect(point).toBeNull();
  });
});