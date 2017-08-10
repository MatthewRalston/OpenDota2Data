/**
* utils.js
*/

/**
* Utils module initialization
* @param logger
* @param promise
* @param fs
* @param Type
* @returns {{ }}
*/

module.exports = function(logger, promise, fs, Type){

/***
* This function merges two arrays
*
* @method union
* @param {Array} a An array
* @param {Array} b An array
* @return {Array}
***/
  function union(a, b){
    if (!Type.is(a, Array)){
      throw new TypeError("utils#union expects an Array 'a' as its first argument");
    } else if (!Type.is(b, Array)){
      throw new TypeError("utils#union expects an Array 'b' as its second argument");
    } else {
      return uniq(a.concat(b)).filter(Boolean);
    }
  };

  /***
     * This function zips each element of two arrays together
     *
     * @method uniq
     * @param {Array} a An Array
     * @return {Array} an array containing only the unique elements from the input
   ***/
  function uniq(a){
    if (!Type.is(a, Array)) {
      throw new TypeError("utils#uniq expects an Array 'a' as its argument");
    } else {
      return a.filter((v,i,self)=>self.indexOf(v) === i);
    }
  };


  /***
     * This function returns the full path of a file
     *
     * @method getRealPath
     * @param {String} filepath A path to a file
     * @return {Object} returns a promise that resolves to the full filepath determined by fs
   ***/
  function getRealPath(filepath){
    logger.debug("Filepath is:", filepath);
    return new promise(function(resolve, reject){
      if (!Type.is(filepath, String)) {
	reject(new TypeError("utils#getRealPath expects a String 'filepath' as its argument"));
      } else fs.access(filepath, fs.R_OK, function(err){
	if (err){
	  logger.error(`File '${filepath}' cannot be access on the client`);
	  logger.error(err);
	  reject(new Error("utils#getRealPath expects a filepath that can be accessed"));
	} else fs.realpath(filepath, function(error, path){
	  if (error){
	    logger.error(`There was an error getting the full path to '${filepath}'`);
	      logger.error(error);
	      reject(new Error("utils#getRealPath could not retrieve file information"));
	  } else {
	      resolve(path);
	  }
	});
      });
    });
  };

    return {
	union: union,
	uniq: uniq,
	getRealPath: getRealPath
    };
};
