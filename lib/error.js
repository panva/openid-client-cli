'use strict';

const got = require('got');

module.exports = function errorHandler(err) {
  if (err instanceof got.HTTPError) {
    console.error(err.response.body);
  } else {
    console.error(err);
  }
  process.exit(1);
};
