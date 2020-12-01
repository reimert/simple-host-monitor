// libs
const winston = require('winston');
const config = require('config');

// init logger helper
module.exports = winston.createLogger({
  transports: [
    new winston.transports.Console(),
  ],
  level: config.get('app.logLevel') || 'info',
});
