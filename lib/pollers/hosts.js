// constants
const POLLER_ID = 50000;

// libs
const os = require('os');
const config = require('config');
const IpCidr = require('ip-cidr');

// helpers
const { logger, arp, poller: pollerHelper } = require('../helpers');

const discoveryPoller = () => {
  const getCidr = (interfaceAddress) => {
    logger.debug('Service function discovery.getCidr called.');

    // list network interfaces
    const interfaces = os.networkInterfaces();
    let connectedInterface = [];
    Object.keys(interfaces).forEach((i) => {
      connectedInterface = connectedInterface.concat(interfaces[i].filter((x) => (x.mac === interfaceAddress && x.family === 'IPv4')));
    });

    // get subnet range
    const cidr = new IpCidr(connectedInterface[0].cidr);
    if (!cidr.isValid) {
      logger.error(`Connected Interface: ${JSON.stringify(connectedInterface)}`);
      throw new Error('Invalid network CIDR');
    }
    return cidr.cidr;
  };

  const nmap = async (cidr) => {
    logger.debug('Service function discovery.nmap called.');
    return arp.queryNmap(cidr);
  };

  const init = async () => {
    logger.info('Poller discovery started.');
    try {
      // get attributes
      const attributes = pollerHelper.getPollerAttributes(POLLER_ID);
      const connectedMac = config.get('network.mac');
      const networkCidr = getCidr(connectedMac);
      const nmapResults = await nmap(networkCidr);

      // return results
      return pollerHelper.enrichAttributes(attributes, nmapResults);
    } catch (ex) {
      logger.debug(ex.stack);
      throw new Error('Failed executing host discovery poller.');
    }
  };

  return {
    init,
  };
};

module.exports = discoveryPoller();
