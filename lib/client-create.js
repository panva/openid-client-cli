/* eslint-disable no-console */

// TODO: initial access token as an option
// TODO: form the request payload and prompt for confirmation
// TODO: --no-prompt option

const program = require('commander');
const assert = require('assert');
const pkg = require('../package.json');
const { parse } = require('querystring');

const arrays = [
  'redirect_uris',
  'contacts',
  'default_acr_values',
  'grant_types',
  'post_logout_redirect_uris',
  'redirect_uris',
  'request_uris',
  'response_types',
];

program
  .version(pkg.version)
  .arguments('<registration_endpoint> [properties...]')
  .action((endpoint, propertiesList) => {
    const properties = propertiesList.reduce((props, param) => {
      const i = param.indexOf('=');
      const name = param.substring(0, i);
      const parsed = parse(param, '', '=');
      assert(parsed[name], `  invalid format: ${param}`);

      const value = ((val) => {
        // handle booleans
        if (['True', 'true', 'false', 'False'].includes(val)) return Boolean(val);

        // handle numbers
        if (/^-?\d+(\.\d*)?$/.exec(val)) return parseFloat(val, 10);

        // handle nulls
        if (val === 'null') return null;

        // handle should be arrays
        /* eslint-disable no-param-reassign */
        if (arrays.includes(name) && !val.startsWith('[')) val = `[${val}`;
        if (arrays.includes(name) && !val.endsWith(']')) val = `${val}]`;
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
    Object.assign(program, { endpoint, properties });
  })
  .parse(process.argv);

const { post, HTTPError } = require('got');

(async () => {
  const client = await post(program.endpoint, {
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(program.properties),
  });
  console.log(client.body);
})().catch((err) => {
  if (err instanceof HTTPError) {
    console.error(err.response.body);
  } else {
    console.error(err);
  }
  process.exit(1);
});
