const app = require('./app')
const config = require('./config')

const { host, port } = config

app.listen(port, host, () => console.log(`Server running at http://${host}:${port}`))
