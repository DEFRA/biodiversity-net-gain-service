import constants from '../../utils/constants.js'

const handlers = {
  get: async (request, h) => {
    return h.view(constants.views.LEGAL_AGREEMENT_START_DATE)
  },
  post: async (request, h) => {
    // const legalAgrementType = request.payload.legalAgrementType
    return h.view(constants.views.LEGAL_AGREEMENT_START_DATE)
  }
}

export default [{
  method: 'GET',
  path: constants.routes.LEGAL_AGREEMENT_START_DATE,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.LEGAL_AGREEMENT_START_DATE,
  handler: handlers.post
}]
