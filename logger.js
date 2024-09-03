const winston = require('winston');
const { combine, timestamp, json } = winston.format;

const logger = winston.createLogger({
    level: 'info', // Set minimum log level (info, debug, etc.)
    format: combine(timestamp(), json()), // Combine timestamp and JSON format
    transports: [
        new winston.transports.Console({ // Log to console
            'timestamp':true,
            format: winston.format.combine(
                winston.format.colorize({ all: true }), // Colorize console logs
                winston.format.simple() // Simplified console output format
            )
        }),
        new winston.transports.File({ // Log to file (optional)
            'timestamp':true,
            filename: 'api.log', // Customize filename
            level: 'info' // Write only errors to the file (optional)
        })
    ]
});

function handleLog(message, level) {
    const logData = {
      timestamp: Date.now(),
      message,
    }
  
    return logger[level](logData)
  }
  
  function info(message) {
    handleLog(message, 'info')
  }
  
  function error(message) {
    handleLog(message, 'error')
  }
  
  function warn(message) {
    handleLog(message, 'warn')
  }
  
  module.exports = {
    logger,
    info,
    error,
    warn
  }