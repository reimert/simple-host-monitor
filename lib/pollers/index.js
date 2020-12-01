// pollers
const memory = require('./memory');
const cpuUtil = require('./cpuUtil');
const uptime = require('./uptime');
const hosts = require('./hosts');

module.exports = {
  memory,
  cpuUtil,
  uptime,
  hosts,
};
