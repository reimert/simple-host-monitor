// libs
const config = require('config');

// helpers
const { logger, poller: pollerHelper, processManager } = require('./lib/helpers');

// pollers
const pollers = require('./lib/pollers');

// initialise process control
processManager.init();

// initialise backoff counters
const backoffCounters = pollerHelper.initialiseBackoffCounters(Object.keys(pollers));
const pollerLoops = pollerHelper.initialisePollerLoops(Object.keys(pollers));

logger.info(`Starting pollers with ${config.get('app.pollInterval') / 1000} second intervals`);

// TODO: Get rid of tmp setInterval - should be managed by supervisor
Object.keys(pollers).forEach((x) => {
  pollerLoops[x] = setInterval(async () => {
    try {
      // run poller
      if (!pollers[x].init) {
        throw new Error(`Poller ${x} is missing init() function.`);
      }
      const results = await pollers[x].init();
      logger.info(results);
      // TODO: send results to worker api/queue

      // successful run, clear backoff factor for poller
      backoffCounters[x] = 0;
    } catch (ex) {
      logger.warn(`Poller ${x} failed with error.`);
      logger.error(ex.message);

      // check for subsequent error and adjust backoff counter
      if (backoffCounters[x] < config.get('app.errorBackoffFactor')) {
        backoffCounters[x] = pollerHelper.incrementBackoffCounter(backoffCounters, x);
      } else {
        // clear poller loop
        clearInterval(pollerLoops[x]);

        // TODO: send service down status to service mon
      }
    }
  }, config.get('app.pollInterval'));
});
