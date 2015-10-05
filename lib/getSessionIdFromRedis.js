
// Given a node_redis redis client object and a session Id, get the id of the matching user
function getSessionIdFromRedis (sessionId, redisClient, cb) {
  var sessionData, userId;

  _getRedisSessionData(sessionId, redisClient, _processSessionData);

  // When redis responds, parse the sessionData to return only the userId
  function _processSessionData (err, sessionData) {
    if (err) {cb(err); return;}
    if (!sessionData) {cb(null, {}); return;}

    userId = sessionData.userId;
    cb(null, userId);
    return;
  }
}

// Get the session from redis
function _getRedisSessionData (sessionId, redisClient, cb) {
  var redisKey = 'sess:' + sessionId; // Format it so that it matches the keys in redis
  console.log('querying redis for key: ', redisKey); //FIXIT
  redisClient.get(redisKey, _handleRedisResponse); // Run the query

  // Handle the response from redis
  function _handleRedisResponse (err, reply) {
    console.log('running handleRedisResponse...');
    if (err) {
      cb(err);
    } else if (!reply) {
      cb(null, null); // This generally happens when there is no matching item in redis
    } else {
      var sessionData = JSON.parse(reply);
      cb(null, sessionData);
    }
  }
}

module.exports = getSessionIdFromRedis;