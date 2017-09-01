/***
   * Provides the 'The International' Controller
   *
   * @class tiController
   * @constructor
   * @params {Object} logger The log4js logger
   * @params {Object} promise The bluebird promise module
   * @params {Object} database An initialized pg-promise object
   * @params {Object} utils A utility module
   * @params {Object} returns a series of functions to handle the routes
***/


module.exports = function tiController(logger, promise, database, utils, request, querystring, Type, boss, salt){



  const db = database.db;
  const pgp = database.pgp;

  const tiYear = require('./tiYear')(logger, promise, request, querystring);

  function submitYear(req, res, next){
    
    if (req.params.year.length != 4) return utils.newErr({message: "Year length was not equal to 4... what year are you in?", status: 400}, next);
    else if (!Type.is(+req.params.year, Number)) return utils.newErr({message: "Year could not be coerced to a Number", status: 400});
    else if (+req.params.year < 2012) return utils.newResponse({data: {}, status: 200, message: "No data is available for TI before 2012."}, res);
    else {
      const datetimeSalt = `${new Date()}.${salt(16)}`;
      boss.publish('getYear', {datetimeSalt: datetimeSalt, year: req.params.year, team: req.query.team}).then(function(jobId){
	return utils.newResponse({data: {id: jobId}, status: 200, message: `Beginning query towards OpenDota API... please check '/api/job/${jobId}' for results`}, res);
      });
    }
  };

  function getJob(req, res, next){
    logger.debug(`Checking if job '${req.params.jobId}' is completed...`);
    return db.oneOrNone("SELECT * FROM opendota_request WHERE id = $1", req.params.jobId).then(function(od_request){
      if (od_request == null) return utils.newResponse({data: {}, status: 404, message: `Job with id '${jobId}' is incomplete or does not exist`}, res);
      else return utils.newResponse({data: od_request.result, status: 200, message: "Query completed"}, res);
    }).catch(function(err){
      return utils.newErr(err, next);
    });
  }


  function queryYear(){
    options.queryAPI = global.__settings.queryAPI;
    options.matchAPI = global.__settings.matchAPI;
    options.playerAPI = global.__settings.playerAPI;
    boss.subscribe('getYear', function(job){
      return db.one("INSERT INTO opendota_request (ID, input) VALUES ($1, $2::json) RETURNING *", [job.id, job.data]).then(function(job_request){ 
	logger.debug("Loaded original query into the database. Beginning requests to OpenDota...");
	return tiYear.getPlayerMatches(year, options, team);  
      }).then(function(data){
	logger.debug("'playermatches' retrieved, processing for match data");
	return Promise.join(
	  matchData.getMatches(utils.uniq(data.rows.map((x) => x.match_id)), options),
	  playerData.getPlayers(utils.uniq(data.rows.map((x) => x.accound_id)), options),
	  function(matchDataArray, playerDataArray){
	    logger.debug("All data retrieved!");
	    data.matches = matchDataArray;
	    data.players = playerDataArray;
	    return data
	  });
      }).then(function(finalData){
	logger.debug("Committing dataset to the database"
      });
    });
  }

  return {
    submitYear: submitYear, // To submit a query
    getJob: getJob, // Retrieve data from a complete job
    queryYear: queryYear // 
}
