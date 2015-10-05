// Given a Hapi server, connect to redis using the hapi-redis plugin
// Then run a callback (optional)
// The node_redis redis client object instance will be stored here: server.plugins['hapi-redis'].client

function connectHapiServerToRedis (server, cb) {
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
  }, function (err) {
    if (cb && err) {
      console.log('Error connecting to redis!', err);
      cb(err);
    } else if (err) {
      console.log('Error connecting to redis!', err);
    } else if (cb) {
      cb(null, {message: "Connected to redis!"});
    } else {
      return {message: "Connected to redis!"};
    }
  });
}

module.exports = connectHapiServerToRedis