import creditsPurchaseConstants from '../../utils/credits-purchase-constants.js'
import { dateToString } from '../../utils/helpers.js'

const getApplicationDetails = (session) => {
  const nationality = session.get(creditsPurchaseConstants.cacheKeys.CREDITS_PURCHASE_NATIONALITY)
  const nationalityHtml = nationality ? Object.values(nationality).filter(n => n !== '').join('<br/>') : ''

  return {
    dueDiligence: {
      individualOrOrg: session.get(creditsPurchaseConstants.cacheKeys.CREDITS_PURCHASE_USER_TYPE),
      individualOrOrgUrl: creditsPurchaseConstants.routes.CREDITS_PURCHASE_INDIVIDUAL_OR_ORG,
      checkDefraAccount: session.get(creditsPurchaseConstants.cacheKeys.CREDITS_PURCHASE_DEFRA_ACCOUNT_DETAILS_CONFIRMED) && 'Confirmed',
      checkDefraAccountUrl: creditsPurchaseConstants.routes.CREDITS_PURCHASE_CHECK_DEFRA_ACCOUNT_DETAILS,
      middleName: session.get(creditsPurchaseConstants.cacheKeys.CREDITS_PURCHASE_MIDDLE_NAME)?.middleName,
      middleNameUrl: creditsPurchaseConstants.routes.CREDITS_PURCHASE_MIDDLE_NAME,
      dateOfBirth: dateToString(session.get(creditsPurchaseConstants.cacheKeys.CREDITS_PURCHASE_DATE_OF_BIRTH)),
      dateOfBirthUrl: creditsPurchaseConstants.routes.CREDITS_PURCHASE_DATE_OF_BIRTH,
      nationality: nationalityHtml,
      nationalityUrl: creditsPurchaseConstants.routes.CREDITS_PURCHASE_NATIONALITY
    }
  }
}

const handlers = {
  get: (request, h) => {
    request.yar.clear(creditsPurchaseConstants.cacheKeys.CREDITS_PURCHASE_CUSTOMER_DUE_DILIGENCE)
    return h.view(creditsPurchaseConstants.views.CREDITS_PURCHASE_CUSTOMER_DUE_DILIGENCE, {
      ...getApplicationDetails(request.yar)
    })
  },
  post: async (request, h) => {
    request.yar.set(creditsPurchaseConstants.cacheKeys.CREDITS_PURCHASE_CUSTOMER_DUE_DILIGENCE, true)
    return h.redirect(creditsPurchaseConstants.routes.CREDITS_PURCHASE_TASK_LIST)
  }
}

export default [
  {
    method: 'GET',
    path: creditsPurchaseConstants.routes.CREDITS_PURCHASE_CUSTOMER_DUE_DILIGENCE,
    handler: handlers.get
  },
  {
    method: 'POST',
    path: creditsPurchaseConstants.routes.CREDITS_PURCHASE_CUSTOMER_DUE_DILIGENCE,
    handler: handlers.post
  }
]
