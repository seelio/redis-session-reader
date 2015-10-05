var test = require('tape');
var cookieSigner = require('cookie-signature');
var unsignCookieSid = require('../lib/unsignCookieSid');


test('given a browser cookie, unsignCookieSid() should return the unsigned cookie', function (t) {
  t.plan(1);
  var sessionId = "SomethingRandom123";
  var secret = "very secret token";
  var signedSessionId = cookieSigner.sign(sessionId, secret); // Sign something
  // Add "s:" at the beginning of the string and encodeURI to simulate a cookie in the browser
  var browserSessionId = "s%3A" + encodeURIComponent(signedSessionId);
  var unsignedSessionId = unsignCookieSid(browserSessionId, secret);

  t.equal(sessionId, unsignedSessionId);
  t.end();
});