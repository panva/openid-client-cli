/* eslint-disable no-console */

const program = require('commander');
const pkg = require('../package.json');

// TODO: form the request payload and prompt for confirmation
// TODO: --no-prompt option

program
  .version(pkg.version)
  .option('-t, --token <value>', 'registration_access_token')
  .option('-u, --uri <value>', 'registration_client_uri')
  .parse(process.argv);

program.options.forEach((option) => {
  if (option.required && !program[option.long.replace(/^-*/g, '')]) {
    program.missingArgument(option.long);
  }
});

const { delete: del } = require('got');

(async () => {
  const client = await del(program.uri, {
    headers: {
      Authorization: `Bearer ${program.token}`,
    },
  });
  console.log(client.body);
})();
