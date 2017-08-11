var express = require('express');

module.exports = function(logger, promise, database){
  var router = express.Router();

  router.get('/', function(req, res, next){
    res.render('index', {title: 'Express' });
  });

  return router
}
