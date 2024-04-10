const mongoose = require('mongoose');
const { DBNAME, BASEURL } = require('./config.js');

main().catch(err => console.log(err));

function buildUrl() {
  const baseURL = BASEURL;
  return baseURL + '/' + DBNAME;
}

async function main() {
  await mongoose.connect(buildUrl());
  console.log('db connected');
}

module.exports = main;
