var redisPlugin;
var redis = require('redis');

redisPlugin = {
  register: function(server, options, next) {
    if (!options) {
        options = {}
    }

    if (options.host === "0") {
      return next();
    }

    var host = options.host || '127.0.0.1';
    var port = options.port || 6379;

    delete options.host;
    delete options.port;

    var rClient = redis.createClient(port, host, options);
    rClient.on("error", function(err) {
      console.log(err);
      if (err.code == 'ECONNREFUSED') {
        console.log('ERROR redis-session-reader is unable to connect to the redis server, host ' + host + ':' + port);
      }
    })
    server.expose('client', rClient);
    return next();
  }
};

redisPlugin.register.attributes = {
  name: 'redisPlugin',
  version: '0.0.1'
};

module.exports = redisPlugin;
