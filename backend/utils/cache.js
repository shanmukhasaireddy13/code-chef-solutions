const NodeCache = require('node-cache');

// StdTTL: standard time to live in seconds (default 5 minutes)
// Checkperiod: automatic delete check interval
const cache = new NodeCache({ stdTTL: 300, checkperiod: 320 });

module.exports = cache;
