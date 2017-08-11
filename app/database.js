module.exports = function(config, promise){
  var pgp = require('pg-promise')({promiseLib: promise});
  var db = pgp(config);
  return {
    db: db,
    pgp: pgp
  };
};
