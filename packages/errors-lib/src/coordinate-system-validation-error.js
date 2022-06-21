import ValidationError from './validation-error.js'

// Adapted from https://medium.com/@xjamundx/custom-javascript-errors-in-es6-aa891b173f87
export default class CoordinateSystemValidationError extends ValidationError {
  constructor (authorityKey, code, ...args) {
    super(code, ...args)
    this.authorityKey = authorityKey
    Error.captureStackTrace(this, CoordinateSystemValidationError)
  }
}
