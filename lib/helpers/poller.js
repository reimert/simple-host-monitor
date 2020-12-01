// helpers
const config = require('config');
const logger = require('./logger');

const pollerHelper = {
  getPollerAttributes: (pollerId) => {
    logger.debug('Helper function poller.getPollerAttributes called.');
    if (!pollerId) {
      throw new Error('Invalid poller id supplied.');
    }
    if (!config.has('pollers') && config.get('pollers').length === 0) {
      throw new Error('Invalid global poller configuration.');
    }

    const pollerObject = config.get('pollers').filter((x) => x.pollerId === pollerId);
    if (pollerObject.length === 0 || pollerObject[0].attributes.length === 0) {
      throw new Error('Invalid poller configuration.');
    }

    // get attributes
    return pollerObject[0].attributes;
  },
  enrichAttributes: (attributes, attributeParameters) => {
    logger.debug('Helper function poller.enrichAttributes called.');
    const resultsTimestamp = new Date().getTime();

    // check for nested results
    if (Array.isArray(attributeParameters)) {
      return attributeParameters.map((parameterSet) => {
        const results = attributes.reduce((total, item) => {
          if (!Object.keys(parameterSet).includes(item.name)) {
            throw new Error(`Cannot find attribute ${item.name} in supplied attribute parameters`);
          }
          // enrich with value and timestamp
          total.push({
            ...item,
            value: parameterSet[item.name],
            timestamp: resultsTimestamp,
          });
          return total;
        }, []);
        return results;
      });
    }

    // normal result set
    return attributes.reduce((total, item) => {
      if (!Object.keys(attributeParameters).includes(item.name)) {
        throw new Error(`Cannot find attribute ${item.name} in supplied attribute parameters`);
      }
      // enrich with value and timestamp
      total.push({
        ...item,
        value: attributeParameters[item.name],
        timestamp: resultsTimestamp,
      });
      return total;
    }, []);
  },
  initialiseBackoffCounters: (attributes) => {
    logger.debug('Helper function poller.initialiseBackoffCounters called.');
    return attributes.reduce((total, item) => Object.assign(total, { [item]: 0 }), {});
  },
  initialisePollerLoops: (attributes) => {
    logger.debug('Helper function poller.initialisePollerLoops called.');
    return attributes.reduce((total, item) => Object.assign(total, { [item]: null }), {});
  },
  incrementBackoffCounter: (backoffCounters, attribute) => {
    logger.debug('Helper function poller.incrementBackoffCounter called.');
    const newCounter = backoffCounters[attribute] + 1;
    logger.warn(`Incrementing backoff for ${attribute} to ${newCounter}`);
    return newCounter;
  },
};

module.exports = pollerHelper;
