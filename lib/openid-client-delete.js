'use strict';

const program = require('commander');
const got = require('got');
const pkg = require('../package.json');
const error = require('./error.js');

program
  .version(pkg.version)
  .option('-t, --token <value>', 'registration_access_token')
  .option('-u, --uri <value>', 'registration_client_uri');

program.on('--help', () => {
  console.log('  Example:');
  console.log('');
  console.log('    $ openid-client delete --token BearerToken --uri https://op.example.com/client/8465246');
  console.log('');
});

program.parse(process.argv);

program.options.forEach((option) => {
  if (option.required && !program[option.long.replace(/^-*/g, '')]) {
    program.missingArgument(option.long);
  }
});

got.delete(program.uri, {
  followRedirect: false,
  headers: {
    Authorization: `Bearer ${program.token}`,
  },
}).catch(error);
