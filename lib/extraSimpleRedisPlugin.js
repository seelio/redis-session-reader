var redisPlugin;
var redis = require('redis');

redisPlugin = {
  register: function(server, options, next) {
    if (!options) {
        options = {}
    }

    var host = options.host || '127.0.0.1';
    var port = options.port || 6379;

    delete options.host;
    delete options.port;

    var rClient = redis.createClient(port, host, options);
    server.expose('client', rClient);
    return next();
  }
};

redisPlugin.register.attributes = {
  name: 'redisPlugin',
  version: '0.0.1'
};

module.exports = redisPlugin;
