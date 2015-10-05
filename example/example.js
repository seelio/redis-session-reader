// This server can be used to test the module
// The easiest way is probably to run it while there is an instance of the redis 
// Delete this file before 
// To run it do node ./example/example.js
var Hapi = require('hapi');
var sessionStore = require('../index');
var sessionSecret = "SECRET_SHOULD_BE_IMPORTED_HERE"; // Don't commit the real secret key!

var server = new Hapi.Server();
server.connection({ 
  host: 'localhost',
  port: 8000,
  routes: {
    cors: true
  }
});

// Unsign the cookie
var rawSignedSessionId = 's%3AK-5uqkQChDuf5b5dAytqfqm8.dvl08QCN1ydR5TT7uul9v0B3e3Z7ukyK%2Bhx34gFaDTQ'; //From browser

var sid = sessionStore.unsignCookieSid(rawSignedSessionId, sessionSecret);

sessionStore.connectHapiServerToRedis(server, startServer, startServer);

function startServer () {
  sessionStore.getSessionIdFromRedis(sid, server.plugins['hapi-redis'].client, handleUserIdRes);

  function handleUserIdRes (err, userId) {
    if (err) {console.log(err) ; return;}
    console.log('server got userId: ', userId);
  }
}
