export default class MetricExtractionError extends Error {
  constructor (code, ...args) {
    super(...args)
    this.code = code
    Error.captureStackTrace(this, MetricExtractionError)
  }
}
