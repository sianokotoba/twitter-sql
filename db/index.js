var pg = require('pg');

// var config = {
//   database: 'twitterdb',
//   host: 'localhost',
//   port: 5432,
//   max: 10,
//   idleTimeoutMills: 30000
// };
var postgresUrl = 'postgres://localhost/twitterdb';

// Client can accept a url string like 'postgresURL' but does NOT have a function called 'done()'
//      var postgresUrl = 'postgres://localhost/twitterdb';
// Client can also be passed a 'config' object variable

// Pool must be passed a 'config' object variable NOT a url string and it does have a 'done()' function

var client = new pg.Client(postgresUrl);

client.connect();

module.exports = client;
