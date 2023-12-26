import constants from '../utils/constants.js'

const contactus = {
  method: 'GET',
  path: constants.routes.CONTACTUS,
  options: {
    auth: false
  },
  handler: async (request, h) => {
    const requestHeadersReferer = request.headers.referer ? encodeURI(request.headers.referer) : ''

    return h.view(constants.views.CONTACTUS, {
      referer: requestHeadersReferer
    })
  }
}

export default contactus
