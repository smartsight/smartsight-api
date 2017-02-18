const env = process.env.NODE_ENV || 'dev'

if (!process.env.PYTHONPATH) {
  console.error(
`No Python interpreter specified
Please set your default interpreter to Python 3:
$ export PYTHONPATH=$(which python3)
`)

  process.exit(1)
}

module.exports = {
  host: process.env.SM_SERVER_HOST || env === 'dev' ? '0.0.0.0' : 'localhost',
  port: process.env.SM_SERVER_PORT || 3000,
  pythonPath: process.env.PYTHONPATH
}
