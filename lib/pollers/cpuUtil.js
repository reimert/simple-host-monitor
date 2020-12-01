// constants
const POLLER_ID = 20000; // poller identifier

// libs
const os = require('os');

// helpers
const { logger, poller: pollerHelper } = require('../helpers');

const cpuUtilPoller = () => {
  const init = async () => {
    logger.info('cpuUtil poller started.');
    try {
      // get poller attributes
      const attributes = pollerHelper.getPollerAttributes(POLLER_ID);

      // get results
      const [util1Min, util5Min, util15Min] = os.loadavg().map((x) => x.toFixed(2));

      return pollerHelper.enrichAttributes(attributes, { util1Min, util5Min, util15Min });
    } catch (ex) {
      logger.debug(ex.stack);
      throw new Error('Failed executing cpuUtil poller.');
    }
  };

  return {
    init,
  };
};

module.exports = cpuUtilPoller();
