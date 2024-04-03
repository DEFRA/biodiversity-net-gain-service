import creditsPurchaseConstants from '../../utils/credits-purchase-constants.js'
import {
  dateClasses,
  validateAndParseISOString,
  validateDate
} from '../../utils/helpers.js'

const handlers = {
  get: (request, h) => {
    const { day, month, year } = validateAndParseISOString(request.yar.get(creditsPurchaseConstants.cacheKeys.CREDITS_PURCHASE_DATE_OF_BIRTH))

    return h.view(creditsPurchaseConstants.views.CREDITS_PURCHASE_DATE_OF_BIRTH, {
      dateClasses,
      day,
      month,
      year,
      backLink: creditsPurchaseConstants.routes.CREDITS_PURCHASE_MIDDLE_NAME
    })
  },
  post: (request, h) => {
    const ID = 'dob'
    const { day, month, year, dateAsISOString, context } = validateDate(request.payload, ID, 'date of birth, for example 31 3 1980', 'Date of birth', true)

    if (context.err) {
      return h.view(creditsPurchaseConstants.views.CREDITS_PURCHASE_DATE_OF_BIRTH, {
        day,
        month,
        year,
        dateClasses,
        ...context,
        backLink: creditsPurchaseConstants.routes.CREDITS_PURCHASE_MIDDLE_NAME
      })
    }
    request.yar.set(creditsPurchaseConstants.cacheKeys.CREDITS_PURCHASE_DATE_OF_BIRTH, dateAsISOString)
    return h.redirect(creditsPurchaseConstants.routes.CREDITS_PURCHASE_NATIONALITY)
  }
}

export default [{
  method: 'GET',
  path: creditsPurchaseConstants.routes.CREDITS_PURCHASE_DATE_OF_BIRTH,
  handler: handlers.get
}, {
  method: 'POST',
  path: creditsPurchaseConstants.routes.CREDITS_PURCHASE_DATE_OF_BIRTH,
  handler: handlers.post
}]
