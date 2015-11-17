// This server can be used to test the module
// The easiest way is probably to run it while there is an instance of the redis 
// Delete this file before 
// To run it do node ./example/example.js
var Hapi = require('hapi');
var RedisSessionReader = require('../index');
var sessionSecret = "IMPORT_SECRET_KEY_HERE"; // Don't commit the real secret key!

var server = new Hapi.Server();
server.connection({ 
  host: 'localhost',
  port: 8000,
  routes: {
    cors: true
  }
});

// Unsign and decode the cookie from the browser
// In a real example, you would parse this from the cookie
var rawSignedSessionId = 's%3AK-5uqkQChDuf5b5dAytqfqm8.dvl08QCN1ydR5TT7uul9v0B3e3Z7ukyK%2Bhx34gFaDTQ';

var sid = RedisSessionReader.unsignCookieSid(rawSignedSessionId, sessionSecret);
console.log('querying for sid: ', sid);

redisOptions = {
  host: 'localhost',
  port: 6379
};

RedisSessionReader.connectHapiServerToRedis(server, sessionSecret, 'connect.sid.1.0', redisOptions, _doStuffAfterConnectingToRedis);

function _doStuffAfterConnectingToRedis (err, status) {
  if (err) {console.log(err); return;}
  RedisSessionReader.getSessionIdFromRedis(sid, server.plugins['hapi-redis'].client, handleUserIdRes);

  function handleUserIdRes (err, userId) {
    if (err) {console.log(err) ; return;}
    console.log('server got userId: ', userId);
  }
}
