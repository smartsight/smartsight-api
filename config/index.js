require('dotenv').config()
const winston = require('winston')

const pythonPath = process.env.SM_PYTHON_PATH

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
$ export SM_PYTHON_PATH=$(which python3)
`)

  process.exit(1)
}

module.exports = {
  host: process.env.SM_SERVER_HOST,
  port: process.env.SM_SERVER_PORT,
  modelDirectory: process.env.SM_MODEL_DIR,
  pythonPath,
  logger
}
