import constants from '../utils/constants.js'
import application from '../utils/application.js'
import { postJson } from '../utils/http.js'

const functionAppUrl = process.env.AZURE_FUNCTION_APP_URL || 'http://localhost:7071/api'

const handlers = {
  get: async (_request, h) => h.view(constants.views.CHECK_YOUR_ANSWERS),
  post: async (request, h) => {
    const data = application(request.yar)
    try {
      const result = await postJson(`${functionAppUrl}/processapplication`, data)
      request.yar.set(constants.redisKeys.GAIN_SITE_REFERENCE, result.gainSiteReference)
      return h.redirect(constants.routes.CONFIRMATION)
    } catch (err) {
      return h.view(constants.views.CHECK_YOUR_ANSWERS, {
        err: [{
          text: 'There is a problem',
          href: null
        }]
      })
    }
  }
}

export default [{
  method: 'GET',
  path: constants.routes.CHECK_YOUR_ANSWERS,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.CHECK_YOUR_ANSWERS,
  handler: handlers.post
}]
