import constants from '../utils/constants.js'

const accessibilityStatement = {
  method: 'GET',
  path: constants.routes.ACCESSIBILITY_STATEMENT,
  options: {
    auth: false
  },
  handler: async (request, h) => {
    const requestHeadersReferer = request.headers.referer ? encodeURI(request.headers.referer) : ''

    return h.view(constants.views.ACCESSIBILITY_STATEMENT, {
      referer: requestHeadersReferer
    })
  }
}

export default accessibilityStatement
