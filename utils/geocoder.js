const NodeGeocoder = require('node-geocoder');

const options = {
  provider: 'mapquest',
  httpAdapter: 'https',
  apiKey: '880O3MRewVM2XwohIHKSbDnYX4zhgZeh',
  formatter: null
}

const geocoder = NodeGeocoder(options);

module.exports = geocoder;