const { v4: uuid } = require('node-uuid')
const PythonShell = require('python-shell')

const { APIError } = require('../../../helpers/error')
const { createError } = require('../../../helpers/response')
const { logger, pythonPath } = require('../../../config')

const AUTHORIZED_FORMATS = ['jpg', 'jpeg']

module.exports = dependencies => {
  const { fs, os, path } = dependencies

  const getClassification = (imagePath, isFinal) => {
    const options = {
      pythonPath,
      args: ['--image_file', imagePath]
    }
    const pyshell = new PythonShell('engine/classify.py', options)

    return new Promise((resolve, reject) => {
      pyshell
        .on('error', reject)
        .on('message', message => {
          try {
            // Check if the response is in the JSON format.
            // The response is not in JSON if the server
            // downloads the images data for the first time
            const data = JSON.parse(message)

            resolve(data)
            logger.info('Classified a picture.', data)
          } catch (e) {
            if (!isFinal) {
              resolve(getClassification(imagePath, true))
              logger.info('Downloaded the trained graph for the first time.')
            } else {
              reject(e)
              logger.error('Could not process the classification.', e)
            }
          }
        })
    })
  }

  return {
    * classify ({ request, response }) {
      const { answer, abort } = response
      const { parts } = request

      let filepath

      try {
        const part = yield parts
        const { mime } = part

        if (!mime) {
          const code = 422
          const message = 'The file is not specified.'

          throw new APIError({ code, message })
        }

        const [, format] = mime.split('/')

        if (!AUTHORIZED_FORMATS.includes(format)) {
          const code = 415
          const message = `The media type should be one of the following: ${AUTHORIZED_FORMATS.join(', ')}.`

          throw new APIError({ code, message })
        }

        filepath = path.join(os.tmpdir(), uuid())
        const stream = fs.createWriteStream(filepath)

        part.pipe(stream)

        if (!stream) {
          const code = 422
          const message = 'The file parameter is missing.'

          throw new APIError({ code, message })
        }

        try {
          const data = yield getClassification(stream.path)

          const result = {
            meta: {
              type: 'success',
              code: 200
            },
            data
          }

          answer(result)
        } catch (e) {
          const code = 422
          const message = 'Unable to process the classification (the file might be corrupted).'

          throw new APIError({ code, message })
        }
      } catch (e) {
        const code = e.code || 500
        const message = e.message

        abort(code, createError({ code, message }))
        logger.error(message, { code, message })
      }

      // Delete the picture once processed
      if (filepath) {
        fs.unlink(filepath, err => {
          if (err) {
            logger.error(err)
          }
        })
      }
    }
  }
}
