import constants from '../../utils/constants.js'
import application from '../../utils/application.js'
import { postJson } from '../../utils/http.js'
import { listArray, boolToYesNo, dateToString, hideClass } from '../../utils/helpers.js'

const functionAppUrl = process.env.AZURE_FUNCTION_APP_URL || 'http://localhost:7071/api'

const handlers = {
  get: async (request, h) => {
    const data = application(request.yar)
    return h.view(constants.views.CHECK_AND_SUBMIT, {
      application: data.landownerGainSiteRegistration,
      ...getContext(request)
    })
  },
  post: async (request, h) => {
    const data = application(request.yar)
    try {
      const result = await postJson(`${functionAppUrl}/processapplication`, data)
      request.yar.set(constants.redisKeys.GAIN_SITE_REFERENCE, result.gainSiteReference)
      return h.redirect(constants.routes.REGISTRATION_SUBMITTED)
    } catch (err) {
      return h.view(constants.views.CHECK_AND_SUBMIT, {
        err: [{
          text: 'There is a problem',
          href: null
        }],
        application: data.landownerGainSiteRegistration,
        ...getContext(request)
      })
    }
  }
}

const getContext = request => {
  return {
    listArray,
    boolToYesNo,
    dateToString,
    hideClass,
    hideConsent: (request.yar.get(constants.redisKeys.ROLE_KEY) === 'Landowner' && request.yar.get(constants.redisKeys.LANDOWNERS)?.length === 0),
    changeLandownersHref: request.yar.get(constants.redisKeys.ROLE_KEY) === 'Landowner' ? constants.routes.REGISTERED_LANDOWNER : constants.routes.ADD_LANDOWNERS,
    routes: constants.routes
  }
}

export default [{
  method: 'GET',
  path: constants.routes.CHECK_AND_SUBMIT,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.CHECK_AND_SUBMIT,
  handler: handlers.post
}]
