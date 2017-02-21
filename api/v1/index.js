const router = require('koa-router')()
const classify = require('./classify')

router
  .use('/classify', classify.routes())

module.exports = router
