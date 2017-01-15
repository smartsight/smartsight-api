const koa = require('koa')
const api = require('./api')
const app = koa()

app
  .use(api.routes())

module.exports = app
