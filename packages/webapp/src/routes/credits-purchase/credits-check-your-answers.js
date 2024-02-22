import creditsApplication from '../../utils/credits-application.js'
import creditsApplicationValidation from '../../utils/credits-application-validation.js'
import { postJson } from '../../utils/http.js'
import creditsPurchaseConstants from '../../utils/credits-purchase-constants.js'
import constants from '../../utils/constants.js'

export default [
  {
    method: 'GET',
    path: creditsPurchaseConstants.routes.CREDITS_PURCHASE_CYA,
    handler: (_request, h) => h.view(creditsPurchaseConstants.views.CREDITS_PURCHASE_CYA)
  },
  {
    method: 'POST',
    path: creditsPurchaseConstants.routes.CREDITS_PURCHASE_CYA,
    handler: async (request, h) => {
      const { value, error } = creditsApplicationValidation.validate(creditsApplication(request.yar, request.auth.credentials.account))
      if (error) {
        throw new Error(error)
      }

      const result = await postJson(`${constants.AZURE_FUNCTION_APP_URL}/processcreditspurchaseapplication`, value)
      console.log('result', result)
      request.yar.set(creditsPurchaseConstants.redisKeys.CREDITS_PURCHASE_APPLICATION_REFERENCE, result.gainSiteReference)
      return h.redirect(creditsPurchaseConstants.routes.CREDITS_PURCHASE_CONFIRMATION)
    }
  }
]
