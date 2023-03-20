import constants from '../../utils/constants.js'

// const href = '#eligibilityLoConsent'
const handlers = {
  get: async (request, h) => {
    return h.view(constants.views.DEVELOPER_ELIGIBILITY_LO_CONSENT)
  }
}

export default [{
  method: 'GET',
  path: constants.routes.DEVELOPER_ELIGIBILITY_LO_CONSENT,
  handler: handlers.get
}]
