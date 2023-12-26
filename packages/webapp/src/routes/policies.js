import constants from '../utils/constants.js'

const policies = {
  method: 'GET',
  path: constants.routes.POLICIES,
  options: {
    auth: false
  },
  handler: async (request, h) => {
    const requestHeadersReferer = request.headers.referer ? encodeURI(request.headers.referer) : ''

    return h.view(constants.views.POLICIES, {
      referer: requestHeadersReferer
    })
  }
}

export default policies
