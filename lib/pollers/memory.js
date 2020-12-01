// constants
const POLLER_ID = 10000; // poller identifier

// libs
const os = require('os');

// helpers
const { logger, poller: pollerHelper } = require('../helpers');

const memoryPoller = () => {
  const init = async () => {
    logger.info('memory Poller started.');
    try {
      // get monitored attributes
      const attributes = pollerHelper.getPollerAttributes(POLLER_ID);

      // get attributes values
      let totalMemory = -1;
      let freeMemory = -1;
      let usedMemory = -1;

      totalMemory = os.totalmem();
      freeMemory = os.freemem();

      if (Number.isNaN(totalMemory) || Number.isNaN(freeMemory)) {
        throw new Error('Invalid attribute data types.');
      }
      usedMemory = totalMemory - freeMemory;

      // return enriched attributes
      return pollerHelper.enrichAttributes(attributes, { totalMemory, freeMemory, usedMemory });
    } catch (ex) {
      logger.debug(ex.stack);
      throw new Error('Failed executing memory poller.');
    }
  };

  return {
    init,
  };
};

module.exports = memoryPoller();
