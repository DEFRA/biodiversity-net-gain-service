import constants from '../utils/constants.js'

const cookies = {
  method: 'GET',
  path: constants.routes.COOKIES,
  options: {
    auth: false
  },
  handler: async (request, h) => {
    const requestHeadersReferer = request.headers.referer ? encodeURI(request.headers.referer) : ''

    return h.view('cookies', {
      referer: requestHeadersReferer
    })
  }
}

export default cookies
