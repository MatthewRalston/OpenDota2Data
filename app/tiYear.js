

module.exports = function(logger, promise, request, process, querystring, prettyjson){

    function sqlQuery(year){
	return `SELECT
    matches.match_id,
    matches.start_time,
    ((player_matches.player_slot < 128) = matches.radiant_win) win,
    player_matches.hero_id,
    notable_players.name,
    player_matches.account_id,
    heroes.localized_name,
    players.avatarfull,
    leagues.name leaguename
    FROM matches
    JOIN match_patch using(match_id)
    JOIN leagues using(leagueid)
    JOIN player_matches using(match_id)
    JOIN heroes on heroes.id = player_matches.hero_id
    LEFT JOIN notable_players ON notable_players.account_id = player_matches.account_id AND notable_players.locked_until = (SELECT MAX(locked_until) FROM notable_players)
    LEFT JOIN players ON players.account_id = player_matches.account_id
    LEFT JOIN teams using(team_id)
    WHERE TRUE
    AND leagues.name = 'The International ${year}'
    ORDER BY matches.match_id DESC NULLS LAST`;
    };

    function getPlayerMatches(year, options){
	var qString = querystring.stringify({sql: sqlQuery(year)});
	var uri = `${options.queryAPI}?${qString}`;
	return new promise(function(resolve, reject){
            request.get({url: uri, json: true, headers: {"Content-Type": "application/json"}}, function(error, res, body){
		if (!error && res.statusCode > 199 && res.statusCode < 300){
		    logger.debug("Request was sussessful");
		    //console.log(prettyjson.render(body));
		    resolve(body);
		} else {
		    logger.error("An error occurred during the request to the OpenDota API. HTTP Response code:", res.statusCode);
		    logger.error(error);
		    logger.error(body);
		    process.exit(1);
		}
	    });
	});
    };


    return {getPlayerMatches: getPlayerMatches};
};
