var cookieSigner = require('cookie-signature');

// Given a raw cookie sid from the browser, unsign it using the same method as the seelio monolith
function unsignCookieSid (signedSid, secret) {
  var decodedSid = decodeURIComponent(signedSid).slice(2); // Decode URI and reformat it
  var sid = cookieSigner.unsign(decodedSid, secret);
  console.log('unsigned cookie', sid, decodedSid);
  return sid;
};

module.exports = unsignCookieSid;