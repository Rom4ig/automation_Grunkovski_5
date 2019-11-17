const log4js = require('log4js');
exports.search = 'Automation';
exports.res = 2;
log4js.configure({
  appenders: {
    file: { type: 'file', filename: 'logs/debug.log' },
    stdout: { type: 'stdout' }
  },
  categories: {
    default: { appenders: ['file', 'stdout'], level: 'debug' },
    trace: { appenders: ['file'], level: 'trace' }
  }
});

const loggerDefault = log4js.getLogger();
const loggerTrace = log4js.getLogger('trace');

exports.logger = {
  trace: str => loggerTrace.trace(str),
  debug: str => loggerDefault.debug(str),
  info: str => loggerDefault.info(str),
  warn: str => loggerDefault.warn(str),
  error: str => loggerDefault.error(str),
  fatal: str => loggerDefault.fatal(str)
}

