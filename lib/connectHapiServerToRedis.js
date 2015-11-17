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


function connectHapiServerToRedis (server, secret, cookieName, redisOptions, cb) {

  // Register Plugin - inside redis-session-reader, in the connectHapiServerToRedis.js file
  server.register(authPlug, function(err) {
    server.auth.strategy('cookieAuth',  'seelioAuth', {
      authenticate: function(req, cb) {

        console.log('Authenticating with redisOptions:');
        console.log(redisOptions);

        // For testing. NOTE: This should probably be commented out during production
        if (redisOptions && redisOptions.testdata) {
          // todo - later, make this configurable to choose which test data from the array. For now it returns the first element.
          return cb(null, redisOptions.testdata[0]);
        }
		  
        if (typeof(secret) != 'string') {
          console.log('ERROR redis-session-reader - connectHapiServerToRedis: Secret param must be a string.');
        }

        // Get cookie id
    
        var rawSid = req.state[cookieName];

        if (!rawSid) {
          // Cookie does not exist
          return cb( new Boom.unauthorized('Not authorized'));
        }

        // Get session ID and verify signature
 
        var sid = unsignCookieSid(rawSid, secret);

        if (!sid) {

          // Cookie is not properly signed
          return cb( new Boom.unauthorized('Not authorized'));

        }
        else {

          // Call redis with cookie to get session

          getSessionIdFromRedis(sid, server.plugins.redisPlugin.client, function (err, userId) {

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

  var redisreg = require('./extraSimpleRedisPlugin');
  if (redisOptions) {
    redisreg.options = redisOptions;
  }
  server.register(redisreg, function(err) {
    if (err) {
      if (cb) {cb(err);}
    } else if (cb) {
      cb(null, {status: "Connected to redis!"});
    } else {
      return {status: "Connected to redis!"};
    } // End of if statements
  });
  


}

module.exports = connectHapiServerToRedis;
