// Do something test-like
var test = require('tape');

test('getSessionIdFromRedis() should correctly retrieve a session from redis', function (t) {
  // I'm not entirely sure how to do this since we need a working redis client to actually test it...
  // Unless we want to set up a server just for that purpose...
  t.plan(1);

  t.equal(0, 1);
  t.end();
});