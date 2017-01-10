const koa = require('koa')
const config = require('./config')

const app = koa()
const { host, port } = config

app.use(function *() {
  if (this.method !== 'POST') {
    this.throw('Only POST method supported', 405)
  }

  this.body = 'TODO'
})

app.listen(port)

console.log(`Server running at http://${host}:${port}`)
