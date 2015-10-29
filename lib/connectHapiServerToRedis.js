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
    server.auth.strategy('cookieAuth',  'seelioAuth', {
      authenticate: function(req, cb) {
		  
        // Get cookie id
    
        // var rawSid = req.state['connect.sid.1.0'];

        // if (!rawSid) {
        //   // Cookie does not exist
        //   return cb( new Boom.unauthorized('Not authorized'));
        // }

        // // Get session ID and verify signature
 
        // var sid = unsignCookieSid(rawSid, secret);

        // if (!sid) {

        //   // Cookie is not properly signed
        //   return cb( new Boom.unauthorized('Not authorized'));

        // }
        // else {

        //   // Call redis with cookie to get session

        //   getSessionIdFromRedis(sid, server.plugins.redisPlugin.client, function (err, userId) {

        //     if (err) {return new Boom.unauthorized('Not authorized');}
        //     return cb(null, { userId: userId })
        //   });
        // }

        // Test code without using redis
        var userobj = {
          userId: 1,
        };
        cb(null, userobj);
        
        // Example of unauth
        //cb( new Boom.unauthorized('Not authorized'));

	      
      } // end of authenticate function
    }); // end of register function
  }); // end of connectHapiToRedis function

  // var reg = require('./extraSimpleRedisPlugin');
  // server.register(reg, function(err) {
  //   if (err) {
  //     if (cb) {cb(err);}
  //   } else if (cb) {
  //     cb(null, {status: "Connected to redis!"});
  //   } else {
  //     return {status: "Connected to redis!"};
  //   } // End of if statements
  // });
  


}

module.exports = connectHapiServerToRedis;
