'use strict';

const program = require('commander');
const got = require('got');
const ExternalEditor = require('external-editor');
const pkg = require('../package.json');
const error = require('./error');

program
  .version(pkg.version)
  .arguments('[properties...]')
  .option('-t, --token <value>', 'registration_access_token')
  .option('-u, --uri <value>', 'registration_client_uri');

program.on('--help', () => {
  console.log('  Example:');
  console.log('    $ openid-client edit --token BearerToken --uri https://op.example.com/client/8465246');
  console.log('');
  console.log('    Leave untouched or delete everything to cancel.');
  console.log('');
});

program.parse(process.argv);

got.get(program.uri, {
  followRedirect: false,
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

  const formatted = JSON.stringify(client, null, 2);
  return { fromOp: formatted, fromEditor: ExternalEditor.edit(formatted) };
}).then(({ fromOp, fromEditor }) => {
  if (!fromEditor || fromEditor.trim() === '' || fromOp.trim() === fromEditor.trim()) {
    return null;
  }

  let client;

  try {
    client = JSON.parse(fromEditor);
  } catch (e) {
    throw new Error('Unable to parse the data from the $EDITOR. Was it a valid JSON?');
  }

  return got.put(program.uri, {
    followRedirect: false,
    headers: {
      Authorization: `Bearer ${program.token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(client),
  });
}).then((response) => {
  if (!response) {
    console.log('Cancelled.');
  } else {
    console.log(response.body);
  }
}).catch(error);
