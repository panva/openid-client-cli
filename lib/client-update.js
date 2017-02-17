/* eslint-disable no-console */

const assert = require('assert');
const program = require('commander');
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


// TODO: form the request and prompt for confirmation
// TODO: --no-prompt option

program
  .version(pkg.version)
  .arguments('[properties...]')
  .option('-t, --token <value>', 'registration_access_token')
  .option('-u, --uri <value>', 'registration_client_uri')
  .action((propertiesList) => {
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
    Object.assign(program, { properties });
  })
  .parse(process.argv);

program.options.forEach((option) => {
  if (option.required && !program[option.long.replace(/^-*/g, '')]) {
    program.missingArgument(option.long);
  }
});

const { get, put, HTTPError } = require('got');

(async () => {
  const { body: client } = await get(program.uri, {
    headers: {
      Authorization: `Bearer ${program.token}`,
    },
    json: true,
  });

  delete client.registration_access_token;
  delete client.registration_client_uri;
  delete client.client_secret_expires_at;
  delete client.client_id_issued_at;

  const update = await put(program.uri, {
    headers: {
      Authorization: `Bearer ${program.token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(Object.assign(client, program.properties)),
  });
  console.log(update.body);
})().catch((err) => {
  if (err instanceof HTTPError) {
    console.error(err.response.body);
  } else {
    console.error(err);
  }
  process.exit(1);
});
