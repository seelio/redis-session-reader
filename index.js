var sessionStore = {};

// Expose 3 interfaces: (see each module for details)
sessionStore.connectHapiServerToRedis = require('./lib/connectHapiServerToRedis');
sessionStore.unsignCookieSid = require('./lib/unsignCookieSid')
sessionStore.getSessionIdFromRedis = require('./lib/getSessionIdFromRedis');

module.exports = seelioSessions;

