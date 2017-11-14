'use strict';

const program = require('commander');
const got = require('got');
const pkg = require('../package.json');
const error = require('./error');
const parseProperties = require('./properties');

program
  .version(pkg.version)
  .option('-t, --token [value]', 'use as value initial access token')
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

const headers = {
  'Content-Type': 'application/json'
};

if (program.token) {
  Object.assign(headers, { Authorization: `Bearer ${program.token}` });
}

got.post(program.endpoint, {
  headers,
  followRedirect: false,
  body: JSON.stringify(program.properties),
}).then((client) => {
  console.log(client.body);
}, error);
