// Given a Hapi server, connect to redis using the hapi-redis plugin
// Then run a callback (optional)
// The node_redis redis client object instance will be stored here: server.plugins['hapi-redis'].client

// PLUGIN code - consider moving elsewhere if necessary

var Boom = require('boom');
var getSessionIdFromRedis = require('./getSessionIdFromRedis.js');
var unsignCookieSid = require('./unsignCookieSid.js');

var authPlug = {
  register: function(plugin, options, next) {
    plugin.auth.scheme('seelioAuth', function( server, options) {
      return {
        authenticate: function(request, reply) {
          options.authenticate(request, function(err, credentialsObj) {
            if (err) {
              return reply(err, null, {});
            }
            else {
              return reply.continue({credentials: credentialsObj});
            }
          });
        }
      }
    });
    next();
  }
};

authPlug.register.attributes = {
  name: 'seelioPlugin',
  version: '0.0.1'
};

// END PLUGIN code


function connectHapiServerToRedis (server, secret, cb) {
  // Register Plugin - inside redis-session-reader, in the connectHapiServerToRedis.js file
  server.register(authPlug, function(err) {
    console.log('REGISTERING PLUGIN');
    server.auth.strategy('cookieAuth',  'seelioAuth', {
      authenticate: function(req, cb) {
		  
        // Get cookie id
    
        var rawSid = req.state['connect.sid.1.0'];

        if (!rawSid) {
          console.log('Cookie does not exist!');
          return cb( new Boom.unauthorized('Not authorized'));
        }

        // Get session ID and verify signature
 
        var sid = unsignCookieSid(rawSid, secret);

        if (!sid) {

          console.log('Cookie not signed so not authorized');
          return cb( new Boom.unauthorized('Not authorized'));

        }
        else {

          // Call redis with cookie to get session

          getSessionIdFromRedis(sid, server.plugins['hapi-redis'].client, function (err, userId) {

            if (err) {return new Boom.unauthorized('Not authorized');}
            return cb(null, { userId: userId })
          });
        }
        /*

        // Test code without using redis

        var userobj = {
          userId: 1,
        };
        cb(null, userobj);
        
        // Example of unauth
        //cb( new Boom.unauthorized('Not authorized'));

	      */
      }
    });
  });
  // FIXIT - remove this once redis is integrated
  //cb(null, {status: "connected, but redis is not built out yet!"}); 

  // Configure the redis connection
  // This uses the hapi-redis npm package
   var redisOpts = {
     connection: {
       "host": "localhost", // Fixit. This is wrong.
       // Later, if we want to use unix sockets instead, comment out the host line above and uncomment the socket line below.
       //"socket": "/var/run/redis/redis.sock",
       "opts": {
          "parser": "javascript",
          "connect_timeout": 5000
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
