// Given a Hapi server, connect to redis using the hapi-redis plugin
// Then run a callback (optional)
// The node_redis redis client object instance will be stored here: server.plugins['hapi-redis'].client

// PLUGIN code - consider moving elsewhere if necessary

var authPlug = {
  register: function(plugin, options, next) {
    plugin.auth.scheme('seelio_auth', function( server, options) {
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

function connectHapiServerToRedis (server, cb) {
  // Register Plugin - inside redis-session-reader, in the connectHapiServerToRedis.js file
  server.register(authPlug, function(err) {
    console.log(MyCB);
    console.log('REGISTERING PLUGIN');
    server.auth.strategy('my_auth',  'seelio_auth', {
      authenticate: function(req, cb) {
		  
        // Get cookie id
		
        // Call redis with cookie to get session
		
        // From session get userid
        var rawSid = req.state['connect.sid.1.0'];
 
        var sid = RedisSessionReader.unsignCookieSid(rawSid, secret);
        //RedisSessionReader.getSessionIdFromRedis(sessionId, server.plugins['hapi-redis'].client, function (err, userId) {
        //  if (err) {return cb(err);}
        //  cb(null, { userId: userId })
        //});		  
        var userobj = {
          userid: 1,
        };
        cb(null, userobj);
        
        // Example of unauth
        //cb( new Boom.unauthorized('Not authorized'));
      }
    });
  });

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
