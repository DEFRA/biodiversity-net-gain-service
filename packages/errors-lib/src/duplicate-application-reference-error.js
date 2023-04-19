// Adapted from https://medium.com/@xjamundx/custom-javascript-errors-in-es6-aa891b173f87
export default class DuplicateApplicationReferenceError extends Error {
  constructor (applicationReference, ...args) {
    super(...args)
    this.applicationReference = applicationReference
    Error.captureStackTrace(this, DuplicateApplicationReferenceError)
  }
}
