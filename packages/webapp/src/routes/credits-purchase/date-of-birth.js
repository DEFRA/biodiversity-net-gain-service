import creditsPurchaseConstants from '../../utils/credits-purchase-constants.js'
import {
  dateClasses,
  validateAndParseISOString,
  validateDate
} from '../../utils/helpers.js'

const handlers = {
  get: (request, h) => {
    const { day, month, year } = validateAndParseISOString(request.yar.get(creditsPurchaseConstants.redisKeys.CREDITS_PURCHASE_DATE_OF_BIRTH))

    return h.view(creditsPurchaseConstants.views.CREDITS_PURCHASE_DATE_OF_BIRTH, {
      dateClasses,
      day,
      month,
      year
    })
  },
  post: (request, h) => {
    const ID = 'dob'
    const { day, month, year, dateAsISOString, context } = validateDate(request.payload, ID, 'individual DOB', 'date of birth', true)
    if (context.err) {
      return h.view(creditsPurchaseConstants.views.CREDITS_PURCHASE_DATE_OF_BIRTH, {
        day,
        month,
        year,
        dateClasses,
        ...context
      })
    }
    request.yar.set(creditsPurchaseConstants.redisKeys.CREDITS_PURCHASE_DATE_OF_BIRTH, dateAsISOString)
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
