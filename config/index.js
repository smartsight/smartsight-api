const winston = require('winston')

const pythonPath = process.env.PYTHONPATH

const consoleLogger = new winston.transports.Console({
  name: 'log-console',
  prettyPrint: true,
  timestamp: true,
  colorize: true
})

const fileLogger = new winston.transports.File({
  name: 'log-file',
  filename: 'logs/logs.log',
  timestamp: true
})

const logger = new winston.Logger({
  transports: process.env.NODE_ENV !== 'test' ? [consoleLogger, fileLogger] : [fileLogger]
})

if (!pythonPath) {
  logger.error(
`No Python interpreter specified
Please set your default interpreter to Python 3:
$ export PYTHONPATH=$(which python3)
`)

  process.exit(1)
}

module.exports = {
  host: process.env.SM_SERVER_HOST || env === 'dev' ? '0.0.0.0' : 'localhost',
  port: process.env.SM_SERVER_PORT || 3000,
  pythonPath,
  logger
}
