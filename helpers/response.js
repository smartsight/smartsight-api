const createError = ({
  code = 500,
  message = 'Internal server error'
} = {}) => ({
  error: {
    code,
    message
  }
})

module.exports = {
  createError
}
