exports.createCliConfig = function createCliConfig({ host, port, logLevel, open }) {
  return {
    host,
    h: host,
    port,
    p: port,
    logLevel,
    l: logLevel,
    open,
    o: open,
  };
};
