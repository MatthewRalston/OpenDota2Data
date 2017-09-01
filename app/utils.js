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
function isJsonFlat(data){
  return new promise(function(resolve){
    if (Type.is(data, Object)){
      if (Object.keys(data).length == 0){
	logger.warn("JSON is flat, but it was empty");
	resolve(true);
      } else {
	Object.keys(data).forEach(function(key){// Iterate through each key
	  if (data[key] instanceof Array){ // Each value should be an array
	    if (!data[key].every(function(s){return Type.is(s, String)})){ // Each element of the array should be a string
	      logger.warn("JSON is imporoperly formatted: While values are arrays, array elements are not all strings.");
	      resolve(false);
	    }
	  } else { // If values are not arrays, return false
	    logger.error(`JSON is improperly formatted: Values are not arrays. '${key}' => ${typeof data[key]}`, data);
	    resolve(false);
	  }
	});
	resolve(true); // Otherwise return true
      }
    } else { // If the argumentis not an object, return false
      logger.warn("JSON is improperly formatted: argument was not an object");
      resolve(false);
    }
  });
}

function isDatetimeValid(datetime){
  if (!Type.is(datetime, String)) return false // If datetime is not a String, return false
  else if (isNaN(Date.parse(datetime))){ // If it is not parseable, return false
    logger.error(`utils#isDatetimeValid expected datetime '${datetime}' to be a valid datetime (e.g. UTC, ISO)`);
    return false
  } else return true; // Otherwise, the String is a valid datetime
}

function isArrayOfStringsValid(array){
  if (!Type.is(array, Array)){
    logger.error("utils#isArrayOfStringsValid expects an array:", array);
    return false; // The argument must be an Array
  } else if (array.length == 0){
    logger.warn("Array was empty");
    return true; // Empty arrays are technically valid
  } else if (array.every((s) => Type.is(s, String) && s.length > 0)) return true; // If every element of array is a non-empty String, it's valid
  else { // Otherwise the Array is invalid
    logger.error("One or more elements of array were not Strings", array);
    return false; 
  }
}

function isStringValid(s, name){
  if (Type.is(s, String)) return true; // Ensure that the argument is a String
  else {
    logger.error(`${name} string '${s}' has invalid type: ${typeof s}`);
    return false;
  }
};

function areArraysEqual(a, b){
  if (!Type.is(a, Array)) throw new TypeError(`utils#areArraysEqual expected an array as its first argument, got '${typeof a}'`);
  else if (!Type.is(b, Array)) throw new TypeError(`utils#areArraysEqual expected an array as its second argument, got '${typeof b}'`);
  else return a.length == b.length && a.every((v, i) => v == b[i]); 
};

function diff(a, b){
  if (!Type.is(a, Array)) throw new TypeError(`utils#diff expected an array as its first argument, got '${typeof a}'`);
  else if (!Type.is(b, Array)) throw new TypeError(`utils#diff expected an array as its second argument, got '${typeof b}'`);
  else return a.filter((x) => b.indexOf(x) == -1); // If both arguments are arrays, filter array a for items that are in b (set difference)
};


function zip(a, b){
  if (!Type.is(a, Array)) throw new TypeError(`utils#zip expected an array as its first argument, got '${typeof a}'`);
  else if (!Type.is(b, Array)) throw new TypeError(`utils#zip expected an array as its second argument, got '${typeof b}'`);
  else if (a.length == b.length) return a.map((_,i) => [_, b[i]]);
  else throw new TypeError(`utils#zip expects that both array arguments have the same length, got ${a.length} and ${b.length} elements, respectively.`);
};


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

  function newErr(err, next){
    return new promise(function(resolve){
      if (err == null) throw new TypeError("An unspecified error occurred"); // If this is called with no arguments for some reason, throw an error! lul
      else if (next == null){ // If the Express 'next' function is not supplied, throw the error anyway
	logger.error("NEXT FUNCTION UNDEFINED, THROWING ANYWAY. ALSO USING CAPITAL LETTERS");
	throw err;
      } else resolve(next(err));
    });
  };


  function newResponse(data, res){
    var result = {
      success: true,
      message: data.message || "Successful request",
      data: data.data || data
    }
    res.status(data.status || 200).json(result); // Pass data in JSON form to the response object
  }

  return {
    // Validation functions
    isArrayOfStringValid: isArrayOfStringsValid,
    isDatetimeValid: isDatetimeValid,
    isJsonFlat: isJsonFlat,
    isStringValid: isStringValid,

    // Utility functions
    areArraysEqual: areArraysEqual,
    diff: diff,
    getRealPath: getRealPath,
    union: union,
    uniq: uniq,
    zip: zip,


    // Response handlers
    newErr: newErr,
    newResponse: newResponse
  };
};
