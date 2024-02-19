import creditsApplication from '../../utils/credits-application.js'
import creditsApplicationValidation from '../../utils/credits-application-validation.js'
import { postJson } from '../../utils/http.js'
import constants from '../../utils/constants.js'

export default [
  {
    method: 'GET',
    path: constants.routes.CREDITS_PURCHASE_CYA,
    handler: (_request, h) => h.view(constants.views.CREDITS_PURCHASE_CYA)
  },
  {
    method: 'POST',
    path: constants.routes.CREDITS_PURCHASE_CYA,
    handler: async (request, h) => {
      const { value, error } = creditsApplicationValidation.validate(creditsApplication(request.yar, request.auth.credentials.account))
      if (error) {
        throw new Error(error)
      }

      const result = await postJson(`${constants.AZURE_FUNCTION_APP_URL}/processcreditsapplication`, value)
      request.yar.set(constants.redisKeys.CREDITS_APPLICATION_REFERENCE, result.gainSiteReference)
      return h.redirect(constants.routes.CREDITS_PURCHASE_CONFIRMATION)
    }
  }
]
