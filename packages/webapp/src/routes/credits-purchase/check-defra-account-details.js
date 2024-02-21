import creditsPurchaseConstants from '../../utils/credits-purchase-constants.js'
import getApplicantContext from '../../utils/get-applicant-context.js'

const handlers = {
  get: async (request, h) => {
    // Clear any previous confirmation every time this page is accessed as part of forcing the user to confirm
    // their account details are correct based on who they are representing in the current session.
    request.yar.get(creditsPurchaseConstants.redisKeys.CREDITS_PURCHASE_DEFRA_ACCOUNT_DETAILS_CONFIRMED, true)
    return h.view(creditsPurchaseConstants.views.CREDITS_PURCHASE_CHECK_DEFRA_ACCOUNT_DETAILS, getApplicantContext(request.auth.credentials.account, request.yar))
  },
  post: async (request, h) => {
    const defraAccountDetailsConfirmed = request.payload.defraAccountDetailsConfirmed
    if (defraAccountDetailsConfirmed) {
      request.yar.set(creditsPurchaseConstants.redisKeys.CREDITS_PURCHASE_DEFRA_ACCOUNT_DETAILS_CONFIRMED, defraAccountDetailsConfirmed)
      // TODO: Update redirection to task list when task list task is complete
      // return h.redirect(creditsPurchaseConstants.routes.REGISTER_CREDIT_PURCHASE_TASK_LIST)
      return h.redirect('#')
    } else {
      return h.view(creditsPurchaseConstants.views.CREDITS_PURCHASE_CHECK_DEFRA_ACCOUNT_DETAILS, {
        ...getApplicantContext(request.auth.credentials.account, request.yar),
        err: [{
          text: 'You must confirm your Defra account details are up to date',
          href: '#defraAccountDetailsConfirmed'
        }]
      })
    }
  }
}

export default [{
  method: 'GET',
  path: creditsPurchaseConstants.routes.CREDITS_PURCHASE_CHECK_DEFRA_ACCOUNT_DETAILS,
  handler: handlers.get
}, {
  method: 'POST',
  path: creditsPurchaseConstants.routes.CREDITS_PURCHASE_CHECK_DEFRA_ACCOUNT_DETAILS,
  handler: handlers.post
}]
