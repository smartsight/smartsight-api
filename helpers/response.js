const createError = ({
  code = 500,
  message = 'Internal server error',
  url = 'https://github.com/smartsight/smartsight-api/wiki'
} = {}) => ({
  error: {
    code,
    message,
    url
  }
})

module.exports = {
  createError
}
