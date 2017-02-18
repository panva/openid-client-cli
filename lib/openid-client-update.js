'use strict';

const program = require('commander');
const got = require('got');
const pkg = require('../package.json');
const error = require('./error.js');
const parseProperties = require('./properties.js');

// TODO: form the request and prompt for confirmation
// TODO: --no-prompt option

program
  .version(pkg.version)
  .arguments('[properties...]')
  .option('-t, --token <value>', 'registration_access_token')
  .option('-u, --uri <value>', 'registration_client_uri')
  .action((propertiesList) => {
    const properties = parseProperties(propertiesList);
    Object.assign(program, { properties });
  });

program.on('--help', () => {
  console.log('  Example properties update:');
  console.log('    $ openid-client update --token BearerToken --uri https://op.example.com/client/8465246 grant_types=authorization_code,refresh_token client_name=\'New Name\'');
  console.log('');
  console.log('  Example properties deletion:');
  console.log('    $ openid-client update --token BearerToken --uri https://op.example.com/client/8465246 client_name=null');
  console.log('');
});

program.parse(process.argv);

program.options.forEach((option) => {
  if (option.required && !program[option.long.replace(/^-*/g, '')]) {
    program.missingArgument(option.long);
  }
});

got.get(program.uri, {
  headers: {
    Authorization: `Bearer ${program.token}`,
  },
  json: true,
}).then((response) => {
  const client = response.body;
  delete client.registration_access_token;
  delete client.registration_client_uri;
  delete client.client_secret_expires_at;
  delete client.client_id_issued_at;
  return got.put(program.uri, {
    headers: {
      Authorization: `Bearer ${program.token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(Object.assign(client, program.properties)),
  });
}).then((response) => {
  console.log(response.body);
}).catch(error);
