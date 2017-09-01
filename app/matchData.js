

module.exports = function(logger, promise, retry, request){



  function getMatches(matchIdArray, options){

    return promise.mapSeries(matchIdArray, function(matchID, index){
      function getMatch(){
	return new promise(function(resolve, reject){
	  logger.debug(`Retrieving data for match '${matchID}', ${index} of ${matchIdArray.length}... '${options.matchAPI}/${matchID}'`);
	  request.get({url: `${options.matchAPI}/${matchID}`, json: true, header: {"Content-Type": "application/json"}}, function(error, res, body){
	    if (!error && res.statusCode > 199 && res.statusCode < 300){
	      logger.debug(`Request for match_id '${matchID}' was successful`);
	      resolve(body);
	    } else {
	      logger.error(`An error occurred during the request for match '${matchID}' to the OpenDota API. HTTP Response code:`, res.statusCode);
	      logger.error(error);
	      logger.error(body);
	      reject(error || res);
	    }
	  });
	}).delay(500).then(function(data){return data});

      };

      return retry(getMatch, {max_tries: 4, interval: 5000});
    }).then(function(matchDataArray){
      logger.debug("All match data requests successful");
      return matchDataArray;
    }).catch(function(err){
      logger.error("One or more requests for match data were unsuccessful");
      logger.error(err);
      return promise.reject(err);
    });
  };

  return {getMatches: getMatches};
};
