import constants from '../..//utils/credits-estimation-constants.js'
import creditsApplication from '../../utils/credits-application.js'
import creditsApplicationValidation from '../../utils/credits-application-validation.js'
import { postJson } from '../../utils/http.js'
import mainConstant from '../../utils/constants.js'

export default [
  {
    method: 'GET',
    path: constants.routes.ESTIMATOR_CREDITS_CYA,
    handler: (_request, h) => h.view(constants.views.ESTIMATOR_CREDITS_CYA)
  },
  {
    method: 'POST',
    path: constants.routes.ESTIMATOR_CREDITS_CYA,
    handler: async (request, h) => {
      const { value, error } = creditsApplicationValidation.validate(creditsApplication(request.yar, request.auth.credentials.account))
      if (error) {
        throw new Error(error)
      }

      const result = await postJson(`${mainConstant.AZURE_FUNCTION_APP_URL}/processcreditsapplication`, value)
      request.yar.set(constants.redisKeys.CREDITS_APP_REFERENCE, result.gainSiteReference)
      return h.redirect(constants.routes.ESTIMATOR_CREDITS_CONFIRMATION)
    }
  }
]
