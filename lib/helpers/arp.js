// libs
const { spawn } = require('child_process');

// helpers
const logger = require('./logger');

module.exports = {
  queryNmap: (cidr) => {
    logger.debug('Helper function arp.queryNmap called.');
    return new Promise((resolve, reject) => {
      const nmap = spawn('nmap', [cidr, '-sn', '-PR', '-PU53']);
      const arpStdOut = [];
      let arpStdErr = '';
      nmap.on('error', (err) => reject(err));
      nmap.stdout.on('data', (data) => {
        const bufferString = data.toString().split('\n');
        let ipAddress;
        bufferString.forEach((x) => {
          if (x.indexOf('scan report for') > -1) {
            // get ip address
            ipAddress = x.split(' ').reverse()[0].trim().replace(/[()]+/gi, '');
          }
          if (x.indexOf('MAC Address:') > -1) {
            const macAddress = x.split(' ')[2].trim();
            const vendorPrefix = macAddress.substr(0, 8).toUpperCase();
            arpStdOut.push({
              cidr,
              ipAddress,
              macAddress,
              vendorPrefix,
            });
          }
        });
      });

      nmap.stderr.on('data', (data) => {
        arpStdErr = arpStdErr.concat(data);
      });

      nmap.on('exit', async () => {
        if (arpStdErr.length > 0) {
          return reject(new Error(arpStdErr));
        }
        return resolve(arpStdOut);
      });
    });
  },
};
