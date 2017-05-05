#!/usr/bin/env node

const program = require('commander');
const pkg = require('../package.json');

program
  .version(pkg.version)
  .command('create', 'Register a client using Dynamic Client Registration 1.0')
  .command('read', 'Read client registration using Dynamic Client Registration 1.0')
  .command('update', 'Update client registration using RFC7592')
  .command('edit', 'Update client registration using RFC7592 via $EDITOR')
  .command('delete', 'Delete a client using RFC7592')
  .parse(process.argv);
