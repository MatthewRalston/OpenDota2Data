var express = require('express');



module.exports = function(logger, promise, database, boss){
  var router = express.Router();
  // Shared modules
  const fs = require('fs');
  const querystring = require('querystring');
  const request = require('request');
  const salt = require('random-token').create("CausalsGetSalty");
  const Type = require('type-of-is');
  const utils = require('./utils')(logger, promise, fs, Type);


  router.get('/', function(req, res, next){
    res.render('index', {title: 'Express' });
  });

  // TI data by year
  var ti = require('../app/theinternational.js')(logger, promise, database, utils, request, querystring, Type, boss, salt);
  router.get('/api/year', ti.getYear);
  

  return router
}
