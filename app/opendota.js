
const program = require('commander');
const heredoc = require('heredoc');
const prettyjson = require('prettyjson');
const Promise = require('bluebird');
const retry = require('bluebird-retry');
const request = require('request');
const process = require('process')
const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');
const Type = require('type-of-is');
const querystring = require('querystring');

// Custom modules
const logger = require('./loadLogger');
const utils = require('./utils')(logger, Promise, fs, Type);
const tiYear = require('./tiYear')(logger, Promise, request, process, querystring, prettyjson);
const matchData = require('./matchData')(logger, Promise, retry, request, process);
const playerData = require('./playerData')(logger, Promise, retry, request, process);

// Global constants
global.__settings = require('./../config/settings');

program.command('getTIData <year>').alias('y')
       .description('Get Dota2 data from The International competition using OpenDota API')
       .option('-v, --verbose', 'Include verbose output')
       .action(function(year, options){
	 if (options.verbose) logger.level = 'DEBUG';
	 if (year == null) {
	   logger.error("'year' is a required argument");
	   this.outputHelp();
	   process.exit(1);
	 } else  if (year.length == 4 && Type.is(+year, Number) && +year > 2011) {
	   logger.debug("Fetching data for The International Dota2 competition for year", year);
	   options.queryAPI = global.__settings.queryAPI;
	   options.matchAPI = global.__settings.matchAPI;
	   options.playerAPI = global.__settings.playerAPI;
	   tiYear.getPlayerMatches(year, options).then(function(data){
	     logger.debug("'playermatches' retrieved, processing for match data");
	     return Promise.join(
	       matchData.getMatches(utils.uniq(data.rows.map((x) => x.match_id)), options),
	       playerData.getPlayers(utils.uniq(data.rows.map((x) => x.account_id)), options),
	       function(matchDataArray, playerDataArray){
		 logger.debug("All data retrieved!");
		 data.matches = matchDataArray;
		 data.players = playerDataArray;
		 console.log(JSON.stringify(data));
	       });
	   });

	   
	 } else {
           logger.error(`Required argument year '${year}' is invalid. Please choose a year from 2012 onward.`);
	   process.exit(1);
	 }
	 
       });



program
       .version('0.0.1')
       .description(
	 heredoc(function(){
	   /*
	      ░▒▒▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▒▒░
	      ▒▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▒
	      ▓▓▓▒░░▒▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
	      ▓▓▓▓▒░░░▒▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▒▒░░▒▓▓▓▓▓▓▓
	      ▓▓▓▓▓▒░░░░░▒▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▒▒░░░░▒▓▓▓▓▓▓▓
	      ▓▓▓▓▓▓▓▒░░░░░▒▓▓▓▓▓▓▓▓▓▓▓▒░░░░░░░░░▒▓▓▓▓▓▓
	      ▓▓▓▓▓▓▓▓▒░░░░░░▒▓▓▓▓▓▓▓▓▓▓▓▒▒░░░░░░▒▓▓▓▓▓▓
	      ▓▓▓▓▓▓▓▓▓▒░░░░░░░▒▓▓▓▓▓▓▓▓▓▓▓▓▒░░░▒▓▓▓▓▓▓▓
	      ▓▓▓▓▓▓▓▓▓▓▒░░░░░░░░░▒▓▓▓▓▓▓▓▓▓▓▒░▒▓▓▓▓▓▓▓▓
	      ▓▓▓▓▓▓▓▓▓▓▓▓▒░░░░░░░░░░▒▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
	      ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▒░░░░░░░░░░░▒▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
	      ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▒░░░░░░░░░░░▒▓▓▓▓▓▓▓▓▓▓▓▓▓
	      ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▒░░░░░░░░░░░░▒▓▓▓▓▓▓▓▓▓▓
	      ▓▓▓▓▓▓▓▒░░▒▓▓▓▓▓▓▓▓▓▓▒░░░░░░░░░░░░▒▓▓▓▓▓▓▓
	      ▓▓▓▓▓▓▒░░░░░▒▓▓▓▓▓▓▓▓▓▒░░░░░░░░░░░░░▒▓▓▓▓▓
	      ▓▓▓▓▓▒░░░░░░░░▒▓▓▓▓▓▓▓▓▓▒░░░░░░░░░░░░░▒▓▓▓
	      ▓▓▓▓▒░░░░░░░░░░░▒▓▓▓▓▓▓▓▓▓▒░░░░░░░░░░░░▒▓▓
	      ▓▓▓▓▓▒░░░░░░░░▒▓▓▓▓▓▓▓▓▓▓▓▓▓▒░░░░░░░░░▒▓▓▓
	      ▓▓▓▓▓▓▒░░░░▒▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▒░░░░░▒▓▓▓▓
	      ▒▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▒
	      ░▒▒▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▒▒░
	    */
	 })).parse(process.argv);


