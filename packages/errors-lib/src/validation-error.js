// Adapted from https://medium.com/@xjamundx/custom-javascript-errors-in-es6-aa891b173f87
export default class ValidationError extends Error {
  constructor (code, ...args) {
    super(...args)
    this.code = code
    Error.captureStackTrace(this, ValidationError)
  }
}
