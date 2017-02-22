class APIError extends Error {
  constructor ({ code, message }) {
    super(message)

    this.name = 'APIError'
    this.code = code
  }
}

module.exports = {
  APIError
}
