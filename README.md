# redis-session-reader
Read sessions generated by express-session and stored into redis!

Our sessions were being created by an express app using express-session and stored in a redis store using redis-connect.  This module allows those sessions to be accessed and used in other cases.  

Installation:
`npm install https://github.com/seelio/redis-session-reader`

The module provides 3 interfaces:

```
RedisSessionReader = require('redis-session-reader');

// Given a raw session id (signed) from the browser, 
// decode it to match the value of the matching session id in the redis store.
var sid = RedisSessionReader.sessionredisSessionReader.unsignCookieSid(rawSid, secret);

// Given a Hapi server, connect to redis:
RedisSessionReader.connectHapiServerToRedis(server, cb);
// ^^ cb returns (err, status)

// Given a redis_node redis client object, 
// get the userId of the user who owns the session:
RedisSessionReader.getSessionIdFromRedis(sid, server.plugins['hapi-redis'].client, cb);
// ^^ cb returns (err, userId)

```
