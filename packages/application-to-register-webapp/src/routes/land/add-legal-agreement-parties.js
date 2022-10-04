import constants from '../../utils/constants.js'

const handlers = {
  get: async (request, h) => {
    return h.view(constants.views.ADD_LEGAL_AGREEMENT_PARTIES)
  },
  post: async (request, h) => {
    const organisationName = request.payload.organisationName
    const role = request.payload.role

    return h.view(constants.views.ADD_LEGAL_AGREEMENT_PARTIES, {
      err: [{
        text: 'Enter the name of the legal party ',
        href: '#organisationName'
      },
      {
        text: 'Enter the name of the legal party ',
        href: '#role'
      }]
    })
    // return h.view(constants.views.LEGAL_AGREEMENT_START_DATE)
  }
}

export default [{
  method: 'GET',
  path: constants.routes.ADD_LEGAL_AGREEMENT_PARTIES,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.ADD_LEGAL_AGREEMENT_PARTIES,
  handler: handlers.post
}]
