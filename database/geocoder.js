const NodeGeocoder = require('node-geocoder');

const options = {
  provider: 'google',
  // Optional depending on the providers
  fetch: customFetchImplementation,
  apiKey: 'AIzaSyDe-eDOIIeTS8_PnUZC96qyCzObyFKwMKY', // for Mapquest, OpenCage, Google Premier
  formatter: null // 'gpx', 'string', ...
};

const geocoder = NodeGeocoder(options);
