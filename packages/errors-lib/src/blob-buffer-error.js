export default class BlobBufferError extends Error {
  constructor (code, ...args) {
    super(...args)
    this.code = code
    Error.captureStackTrace(this, BlobBufferError)
  }
}
