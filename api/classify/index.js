const router = require('koa-router')()
const parse = require('co-busboy')
const Controller = require('./Classify.controller')({
  fs: require('fs'),
  os: require('os'),
  path: require('path')
})

router
  .post('/', function * (next) {
    const parts = parse(this)

    yield Controller.classify({
      request: {
        parts
      },
      response: {
        answer: data => (this.body = data),
        abort: (status, data) => {
          this.status = status
          this.body = data
        }
      }
    })
  })

module.exports = router
