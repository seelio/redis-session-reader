// Given a Hapi server, connect to redis using the hapi-redis plugin
// Then run a callback (optional)
// The node_redis redis client object instance will be stored here: server.plugins['hapi-redis'].client

function connectHapiServerToRedis (server, cb) {
  // Configure the redis connection
  // This uses the hapi-redis npm package
  var redisOpts = {
    connection: {
      "host": "localhost", // Fixit. This is wrong.
      "opts": {
          "parser": "javascript"
      }
    }
  };

  // Register the redis plugin to the Hapi server
  server.register({
    register: require('hapi-redis'),
    options: redisOpts
  }, _handlePluginRegistration);

  // Once the server has registered the redis plugin, do this stuff:
  function _handlePluginRegistration (err) {
    if (err) {
      if (cb) {cb(err);}
    } else if (cb) {
      cb(null, {status: "Connected to redis!"});
    } else {
      return {status: "Connected to redis!"};
    } // End of if statements
  } // end of _handlePluginRegistration

}

module.exports = connectHapiServerToRedis;