// Adapted from https://medium.com/@xjamundx/custom-javascript-errors-in-es6-aa891b173f87
export default class ThreatScreeningError extends Error {
  constructor (threatScreeningDetails, ...args) {
    super(...args)
    this.threatScreeningDetails = threatScreeningDetails
    Error.captureStackTrace(this, ThreatScreeningError)
  }
}
