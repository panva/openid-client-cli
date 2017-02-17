#!/usr/bin/env node --harmony_async_await

const program = require('commander');
const pkg = require('../package.json');

program
  .version(pkg.version)
  .command('create', 'foo')
  .command('read', 'foo')
  .command('update', 'foo')
  .command('delete', 'foo')
  .parse(process.argv);
