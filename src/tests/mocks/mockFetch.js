// import mealsData from './mealsData';

const mockFetch = (data) => Promise.resolve({
  json: () => Promise.resolve(data),
});

export default mockFetch;
