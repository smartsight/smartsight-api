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
  console.error(
`No Python interpreter specified
Please set your default interpreter to Python 3:
$ export PYTHONPATH=$(which python3)
`)

  process.exit(1)
}

module.exports = {
  host: process.env.SM_SERVER_HOST || '0.0.0.0',
  port: process.env.SM_SERVER_PORT || 3000,
  modelDirectory: process.env.SM_MODEL_DIR || '/tmp/smartsight',
  pythonPath,
  logger
}
