var RedisSessionReader = {};

// Expose 3 interfaces: (see each module for details)
RedisSessionReader.connectHapiServerToRedis = require('./lib/connectHapiServerToRedis');
RedisSessionReader.unsignCookieSid = require('./lib/unsignCookieSid');
RedisSessionReader.getSessionIdFromRedis = require('./lib/getSessionIdFromRedis');

module.exports = RedisSessionReader;

