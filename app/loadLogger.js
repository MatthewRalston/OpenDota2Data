var log4js = require('log4js');
//log4js.loadAppender('file');
// Accessory configurations for Log4js

function ln(){
  return (new Error).stack.split("\n")[$depth].replace(/^\s+at\s+(\S+)\s\((.+?)([^\/]+):(\d+):\d+\)$/, function(){
    return arguments[1] + ' ' + arguments[3] + ' line ' + arguments[4];
  });
};



var $depth = 11;
var config = {
  "appenders": {
    "fileLogger": {
      "type": "file",
      "filename": "logs/opendota2data.log",
      "maxLogSize": 20480,
      "backups": 3,
      "layout": {
	"type": "pattern",
	"pattern": "[%[%5.5p%]] %d{ISO8601_WITH_TZ_OFFSET} - {%x{ln}}|%]\t%m",
        "tokens": {
          "ln": ln
        }
      },
      "category": "fileLogger"
    },
    "consoleLogger": {
      "type": "stderr",
      "layout": {
	"type": "pattern",
	"pattern": "[%[%5.5p%]] %d - {%x{ln}}|%]\t%m",
        "tokens": {
          "ln": ln
        }
      },
      "category": "consoleLogger"
    }
  },
  "categories": {
    "default": {
      "appenders": ["consoleLogger"],
      "level": "WARN"
    },
    "app": {
      "appenders": ["consoleLogger", "fileLogger"],
      "level": "DEBUG"
    }
  }
};


log4js.configure(config);

var logger = new log4js.getLogger('default');

module.exports = {
  logger: logger,
  log4js: log4js
}
