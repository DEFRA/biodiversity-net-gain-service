import ValidationError from './validation-error.js'

// Adapted from https://medium.com/@xjamundx/custom-javascript-errors-in-es6-aa891b173f87
export default class UploadTypeValidationError extends ValidationError {
  constructor (uploadType, code, ...args) {
    super(code, ...args)
    this.uploadType = uploadType
    Error.captureStackTrace(this, UploadTypeValidationError)
  }
}
