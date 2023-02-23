// Adapted from https://medium.com/@xjamundx/custom-javascript-errors-in-es6-aa891b173f87
export default class UnknownApplicationSessionIdError extends Error {
  constructor (applicationSessionId, ...args) {
    super(...args)
    this.applicationSessionId = applicationSessionId
    Error.captureStackTrace(this, UnknownApplicationSessionIdError)
  }
}
