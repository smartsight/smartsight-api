const { v4: uuid } = require('node-uuid')
const PythonShell = require('python-shell')

const config = require('../../config')
const { createError } = require('../utils')

const AUTHORIZED_FORMATS = ['jpg', 'jpeg']
const { pythonPath } = config

module.exports = dependencies => {
  const { fs, os, path } = dependencies

  return {
    * classify ({ request, response }) {
      const { answer, abort } = response
      const { parts } = request

      try {
        let part
        let stream

        while ((part = yield parts)) {
          const { mime } = part
          const [, format] = mime.split('/')

          if (!AUTHORIZED_FORMATS.includes(format)) {
            const code = 415
            const message = `Unsupported Media Type (${AUTHORIZED_FORMATS.join(', ')})`

            abort(code, createError({ code, message }))
            return
          }

          stream = fs.createWriteStream(path.join(os.tmpdir(), uuid()))

          part.pipe(stream)
        }

        const options = {
          pythonPath,
          args: ['--image_file', stream.path]
        }
        const pyshell = new PythonShell('engine/classify.py', options)

        try {
          const data = yield new Promise((resolve, reject) => {
            pyshell
              .on('error', reject)
              .on('message', resolve)
          })

          const result = {
            meta: {
              type: 'success',
              code: 200
            },
            data
          }

          answer(result)
        } catch (e) {
          const code = 500
          const message = e.message

          abort(code, createError({ code, message }))
        }
      } catch (e) {
        const code = 405
        const message = `No file specified (expect ${AUTHORIZED_FORMATS.join(', ')})`

        abort(code, createError({ code, message }))
      }
    }
  }
}
