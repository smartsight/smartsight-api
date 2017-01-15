const { v4: uuid } = require('node-uuid')

const AUTHORIZED_FORMATS = ['png', 'jpg', 'jpeg', 'bmp']

module.exports = function (dependencies) {
  const { fs, os, path } = dependencies

  return {
    * classify ({ request, response }) {
      const { answer, abort } = response
      const { parts } = request

      try {
        let part

        while ((part = yield parts)) {
          const { mime } = part
          const [, format] = mime.split('/')

          if (!AUTHORIZED_FORMATS.includes(format)) {
            abort(415, `Unsupported Media Type (${AUTHORIZED_FORMATS.join(', ')})`)
            return
          }

          const stream = fs.createWriteStream(path.join(os.tmpdir(), uuid()))

          part.pipe(stream)
        }

        // TODO(@francoischalifour): add Python script call
        // with stream.path as input

        const result = [{
          class: 'pizza',
          confidence: 0.97
        }, {
          class: 'plate',
          confidence: 0.76
        }]

        answer(JSON.stringify(result))
      } catch (e) {
        console.log(e.message)
        abort(405, e.message)
      }
    }
  }
}
