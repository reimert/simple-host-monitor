// helpers
const logger = require('./logger');

module.exports.init = () => {
  logger.debug('Helper function processManager.init called.');
  // signal handlers
  process.on('SIGTERM', () => {
    logger.info('Application exiting...');
    process.exit(1);
  });

  process.on('SIGINT', () => {
    logger.info('Application exiting...');
    process.exit(0);
  });

  process.on('SIGBREAK', () => {
    logger.info('Application exiting...');
    process.exit(0);
  });

  // process handler
  process.on('exit', (code) => {
    logger.info(`Application exited with code ${code}`);
  });

  // unhandled exceptions
  process.on('unhandledRejection', (reason) => {
    logger.warn(`Unhandled promise rejection: ${reason}`);
    process.exit(1);
  });

  process.on('uncaughtException', () => {
    logger.warn('Uncaught exception handled.');
    process.exit(1);
  });
};
