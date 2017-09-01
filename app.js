var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
global.__settings = require('./config/settings.js');


var app = express();
// M i d d l e w a r e 
var loadLog = require(path.join(global.__settings.rootDir, 'app/loadLogger'));
var logger = loadLog.log4js.getLogger('app');

var Promise = require('bluebird');

var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// Configure database

var dbConfig = require(path.join(global.__settings.rootDir, 'config/postgres.json'))[app.get('env')];
logger.debug("Connecting to database with the following credentials", dbConfig);
var database = require(path.join(global.__settings.rootDir, 'app/database'))(dbConfig, Promise);
logger.debug("Testing database connection...");
database.db.any("SELECT * FROM opendota_request LIMIT 1");
// Configure job manager
const pgString = `postgres://${dbConfig.user}:${dbConfig.password}@${dbConfig.host}/${dbConfig.database}`;
var boss = require('pg-boss')(pgString);
boss.on('error', logger.error);

var routes = require(path.join(global.__settings.rootDir, 'routes/index'))(logger, Promise, database, boss);


// view engine setup
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');

app.use(loadLog.log4js.connectLogger(loadLog.logger, {level: loadLog.log4js.levels.INFO}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(global.__settings.rootDir, 'public')));
app.disable('etag');


// Start the app
logger.debug("Launching the applincation with the following settings:\n", global.__settings);
app.use('/', routes);
logger.info(`In ${app.get('env')} environment`);


if (app.get('env') === 'development') {
  app.use(function(err, req, res, next){
    logger.error("Handling error with generic handler");
    logger.error(err);
    res.status(err.status || 500).json({
      success: false,
      message: err.message || "An error occurred",
      err: err
    });
  });
} else {
  app.use(function(err, req, res, next){
    res.status(err.status || 500).json({
      success: false,
      status: 'Fatal error',
      message: err.message
    });
  });
}


module.exports = app;
