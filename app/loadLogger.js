var log4js = require('log4js');

// Accessory configurations for Log4js

var $depth = 11;
var config = {
  "appenders": {
    "terminal": {
      "type": "stderr",
      "layout": {
	"type": "pattern",
	"pattern": "[%[%5.5p%]] %d - %m"
      },
    }
  },
  "categories": {
    "default": {
      "appenders": ["terminal"],
      "level": "WARN"
    }
  }
};


log4js.configure(config);

var logger = new log4js.getLogger('default');

module.exports = logger;
