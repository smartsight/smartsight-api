const env = process.env.NODE_ENV || 'dev'

module.exports = {
  host: process.env.SM_SERVER_HOST || env === 'dev' ? '0.0.0.0' : 'localhost',
  port: process.env.SM_SERVER_PORT || 3000
}
