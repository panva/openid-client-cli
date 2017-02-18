'use strict';

// TODO: initial access token as an option
// TODO: form the request payload and prompt for confirmation
// TODO: --no-prompt option

const program = require('commander');
const got = require('got');
const pkg = require('../package.json');
const error = require('./error.js');
const parseProperties = require('./properties.js');

program
  .version(pkg.version)
  .arguments('<registration_endpoint> [properties...]')
  .action((endpoint, propertiesList) => {
    const properties = parseProperties(propertiesList);
    Object.assign(program, { endpoint, properties });
  });

program.on('--help', () => {
  console.log('  Example:');
  console.log('');
  console.log('    $ openid-client create https://op.example.com/client/register redirect_uris=https://lvh.me:3000/cb client_name=Foobar');
  console.log('');
});

program.parse(process.argv);

got.post(program.endpoint, {
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(program.properties),
}).then((client) => {
  console.log(client.body);
}, error);
