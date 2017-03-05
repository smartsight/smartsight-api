const { v4: uuid } = require('node-uuid')
const PythonShell = require('python-shell')

const { APIError } = require('../../../helpers/error')
const { createError } = require('../../../helpers/response')
const { logger, modelDirectory, pythonPath } = require('../../../config')

const BIT_TO_BYTES = 1048576
const MAX_FILE_SIZE = 10 * BIT_TO_BYTES
const AUTHORIZED_FORMATS = ['jpg', 'jpeg']

module.exports = dependencies => {
  const { fs, os, path } = dependencies

  const getClassification = pathname => {
    const options = {
      pythonPath,
      args: ['--model_dir', modelDirectory, '--image_file', pathname]
    }
    const classificationScript = new PythonShell('engine/classify.py', options)

    return new Promise((resolve, reject) => {
      classificationScript
        .on('error', reject)
        .on('message', data => resolve(JSON.parse(data)))
    })
  }

  return {
    * classify ({ request, response }) {
      const { parts, contentLength } = request
      const { answer, abort } = response

      let filepath

      try {
        if (contentLength > MAX_FILE_SIZE) {
          const code = 413
          const message = `The file is too big (maximum size allowed is ${MAX_FILE_SIZE / BIT_TO_BYTES} MB).`

          throw new APIError({ code, message })
        }

        const part = yield parts

        if (!part) {
          const code = 422
          const message = 'The file is not specified.'

          throw new APIError({ code, message })
        }

        const { mime } = part
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

        // Check if the model has already been downloaded
        fs.stat(modelDirectory, err => {
          if (err) {
            logger.info('Downloading the model for the first time...')
          }
        })

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
          logger.info('Classified a picture.', data)
        } catch (e) {
          const code = 422
          const message = 'Unable to process the classification (the file might be corrupted).'

          logger.error(e)
          throw new APIError({ code, message })
        }
      } catch (e) {
        const code = e.code || 500
        const message = e.message

        abort(code, createError({ code, message }))
        logger.info(message, { code, message })
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
