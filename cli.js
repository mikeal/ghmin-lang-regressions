#!/usr/bin/env node
const pull = require('./src/pull')
const brotli = require('brotli-max')
const filename = require('./src/date-file')
const mkdirp = require('mkdirp')
const path = require('path')

const oneday = 1000 * 60 * 60 * 24

const runDay = async argv => {
  const start = (new Date(argv.day)).getTime()
  const obj = await pull(start, start + oneday, argv)
  const f = filename.day(start)
  mkdirp.sync(path.dirname(f))
  await brotli(Buffer.from(JSON.stringify(obj)), f)
}

const options = yargs => {
  yargs.positional('day', {
    desc: 'Day you want to pull'
  })
  yargs.option('langs', {
    desc: 'Include language data',
    default: true
  })
}

const yargs = require('yargs')
const args = yargs
  .command('day [day]', 'Pull and save a day of data.', options, runDay)
  .argv

if (!args._.length) {
  yargs.showHelp()
}
