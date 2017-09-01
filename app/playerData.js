

module.exports = function(logger, promise, retry, request){



  function getPlayers(playerIdArray, options){

    return promise.mapSeries(playerIdArray, function(playerID, index){
      function getPlayer(){
	return new promise(function(resolve, reject){
	  logger.debug(`Retrieving data for player '${playerID}', ${index} of ${playerIdArray.length}... '${options.playerAPI}/${playerID}'`);
	  request.get({url: `${options.playerAPI}/${playerID}`, json: true, header: {"Content-Type": "application/json"}}, function(error, res, body){
	    if (!error && res.statusCode > 199 && res.statusCode < 300){
	      logger.debug(`Request for player_id '${playerID}' was successful`);
	      resolve(body);
	    } else {
	      logger.error(`An error occurred during the request for player '${playerID}' to the OpenDota API. HTTP Response code:`, res.statusCode);
	      logger.error(error);
	      logger.error(body);
	      reject(error || res);
	    }
	  });
	}).delay(1000).then(function(data){return data});

      };

      return retry(getPlayer, {max_tries: 4, interval: 500});
    }).then(function(playerDataArray){
      logger.debug("All player data requests successful");
      return playerDataArray;pp
    }).catch(function(err){
      logger.error("One or more requests for player data were unsuccessful");
      logger.error(err);
      return promise.reject(err);
    });
  };

  return {getPlayers: getPlayers};
};
