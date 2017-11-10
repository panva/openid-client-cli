'use strict';

const assert = require('assert');
const querystring = require('querystring');
const arrays = require('./arrays.json');

module.exports = function parsePropertiesList(propertiesList) {
  return propertiesList.reduce((props, param) => {
    const i = param.indexOf('=');
    const name = param.substring(0, i);
    const parsed = querystring.parse(param, '', '=');
    assert(parsed[name], `  invalid format: ${param}`);

    const value = ((val) => {
      // handle booleans
      if (['True', 'true', 'false', 'False'].indexOf(val) !== -1) return Boolean(val);

      // handle numbers
      if (/^-?\d+(\.\d*)?$/.exec(val)) return parseFloat(val, 10);

      // handle nulls
      if (val === 'null') return null;

      // handle should be arrays
      /* eslint-disable no-param-reassign */
      if (arrays[name]) {
        if (!val.startsWith('[')) val = `[${val}`;
        if (!val.endsWith(']')) val = `${val}]`;
      }
      /* eslint-enable no-param-reassign */

      // handle empty arrays
      if (val === '[]') return [];

      // handle arrays
      if (val.startsWith('[') && val.endsWith(']')) return val.slice(1, -1).split(',');

      if (name === 'jwks') {
        try {
          return JSON.parse(val);
        } catch (err) {
          throw new Error('  invalid jwks format, enter as jwks=\'{"keys": [ { ... }, { ... } ]}\'');
        }
      }

      return val;
    })(parsed[name]);

    Object.assign(props, { [name]: value });

    return props;
  }, {});
};
