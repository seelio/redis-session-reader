var redisPlugin;
var redis = require('redis');

redisPlugin = {
  register: function(server, options, next) {
    var rClient = redis.createClient();
    server.expose('client', rClient);
    return next();
  }
};

redisPlugin.register.attributes = {
  name: 'redisPlugin',
  version: '0.0.1'
};

module.exports = redisPlugin;
