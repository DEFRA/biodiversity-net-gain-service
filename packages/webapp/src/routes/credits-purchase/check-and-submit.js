import creditsApplication from '../../utils/credits-application.js'
import creditsApplicationValidation from '../../utils/credits-application-validation.js'
import { postJson } from '../../utils/http.js'
import creditsPurchaseConstants from '../../utils/credits-purchase-constants.js'
import constants from '../../utils/constants.js'

const getApplicationDetails = () => ({
  dummy: 'Hello'
})

const handlers = {
  get: (request, h) => h.view(creditsPurchaseConstants.views.CREDITS_PURCHASE_CHECK_YOUR_ANSWERS, getApplicationDetails()),
  post: async (request, h) => {
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

export default [
  {
    method: 'GET',
    path: creditsPurchaseConstants.routes.CREDITS_PURCHASE_CHECK_YOUR_ANSWERS,
    handler: handlers.get
  },
  {
    method: 'POST',
    path: creditsPurchaseConstants.routes.CREDITS_PURCHASE_CHECK_YOUR_ANSWERS,
    handler: handlers.post
  }
]
