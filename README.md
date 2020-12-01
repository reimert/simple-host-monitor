Simple modular host telemetry poller
===
*Usage:*
```
sudo npm start
```

_Please note:_ 
> Need to run as sudo user in order to run the host discovery poller. 

> [nmap](https://nmap.org/) distro package needs to be installed on the host system in order to run the host discovery poller.


The telemetry returned are: **memory usage**, **cpu utilisation**, **host uptime** and **arp host discovery**. Results are written to the console in the following format:

```
[
    {
      "pollerId": 10000,
      "name": "memory",
      "attributes": [
        {
          "attributeId": 10001,
          "name": "totalMemory",
          "dimension": "bytes"
        },
        {
          "attributeId": 10002,
          "name": "freeMemory",
          "dimension": "bytes"
        },
        {
          "attributeId": 10003,
          "name": "usedMemory",
          "dimension": "bytes"
        }
      ]
    },
    {
      "pollerId": 20000,
      "name": "cpuUtil",
      "attributes": [
        {
          "attributeId": 20001,
          "name": "util1Min",
          "dimension": "%"
        },
        {
          "attributeId": 20002,
          "name": "util5Min",
          "dimension": "%"
        },
        {
          "attributeId": 20003,
          "name": "util15Min",
          "dimension": "%"
        }
      ]
    },
    {
      "pollerId": 30000,
      "name": "uptime",
      "attributes": [
        {
          "attributeId": 30001,
          "name": "uptime",
          "dimension": "seconds"
        }
      ]
    },
    {
      "pollerId": 50000,
      "name": "hostDiscovery",
      "attributes": [
        {
          "attributeId": 50001,
          "name": "ipAddress",
          "dimension": "ipAddress"
        },
        {
          "attributeId": 50002,
          "name": "macAddress",
          "dimension": "macAddress"
        }
      ]
    }
  ]
  ```

  Adapters to send the results to an api, queue or event bus are work-in-progress.