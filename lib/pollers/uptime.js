// constants
const POLLER_ID = 30000;

// libs
const os = require('os');

// helpers
const { logger, poller: pollerHelper } = require('../helpers');

const uptimePoller = () => {
  const init = async () => {
    logger.info('uptime Poller started.');
    try {
      // get attributes
      const attributes = pollerHelper.getPollerAttributes(POLLER_ID);

      // get results
      const uptime = os.uptime();

      return pollerHelper.enrichAttributes(attributes, { uptime });
    } catch (ex) {
      logger.debug(ex.stack);
      throw new Error('Failed executing uptime poller.');
    }
  };

  return {
    init,
  };
};

module.exports = uptimePoller();
