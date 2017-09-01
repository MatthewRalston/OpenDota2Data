

module.exports = function(logger, promise, request, querystring){

  function sqlQuery(year, team){
    var selection = `SELECT
    matches.match_id,
    matches.start_time,
    ((player_matches.player_slot < 128) = matches.radiant_win) win,
    player_matches.hero_id,
    notable_players.name,
    player_matches.account_id,
    heroes.localized_name,
    players.avatarfull,
    leagues.name leaguename,
    matches.radiant_team_name,
    matches.dire_team_name`;
    var from = ` FROM matches
    JOIN match_patch using(match_id)
    JOIN leagues using(leagueid)
    JOIN player_matches using(match_id)
    JOIN heroes on heroes.id = player_matches.hero_id
    LEFT JOIN notable_players ON notable_players.account_id = player_matches.account_id AND notable_players.locked_until = (SELECT MAX(locked_until) FROM notable_players)
    LEFT JOIN players ON players.account_id = player_matches.account_id
    LEFT JOIN teams using(team_id)`;
    var where = ` WHERE TRUE AND leagues.name = 'The International ${year}'`;
    if (team != null) {
      where += ` AND (notable_players.team_name = '${team}' OR notable_players.team_tag = '${team}')`;
    }
    return selection + from + where + " ORDER BY matches.match_id DESC NULLS LAST";
  };

  function getPlayerMatches(year, options, team){
    var qString = querystring.stringify({sql: sqlQuery(year, team)});
    var uri = `${options.queryAPI}?${qString}`;
    return new promise(function(resolve, reject){
      request.get({url: uri, json: true, headers: {"Content-Type": "application/json"}}, function(error, res, body){
	if (!error && res.statusCode > 199 && res.statusCode < 300){
	  logger.debug("Request was sussessful");
	  resolve(body);
	} else {
	  logger.error("An error occurred during the request to the OpenDota API.");
	  logger.error(error);
	  logger.error(body);
	  reject(res);
	}
      });
    });
  };


  return {getPlayerMatches: getPlayerMatches};
};
