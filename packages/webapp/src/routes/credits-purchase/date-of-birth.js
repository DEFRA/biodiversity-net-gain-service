import creditsPurchaseConstants from '../../utils/credits-purchase-constants.js'
import {
  dateClasses,
  validateAndParseISOString,
  validateDate, getValidReferrerUrl
} from '../../utils/helpers.js'

const handlers = {
  get: (request, h) => {
    const { day, month, year } = validateAndParseISOString(request.yar.get(creditsPurchaseConstants.redisKeys.CREDITS_PURCHASE_DATE_OF_BIRTH))

    const errors = request.yar.get('errors') || null
    request.yar.clear('errors')

    return h.view(creditsPurchaseConstants.views.CREDITS_PURCHASE_DATE_OF_BIRTH, {
      dateClasses,
      day,
      month,
      year,
      err: errors,
      backLink: creditsPurchaseConstants.routes.CREDITS_PURCHASE_MIDDLE_NAME
    })
  },
  post: (request, h) => {
    const ID = 'dob'
    const { day, month, year, dateAsISOString, context } = validateDate(request.payload, ID, 'date of birth, for example 31 3 1980', 'Date of birth', true)

    if (context.err) {
      request.yar.set('errors', context.err)
      request.yar.set('formData', { day, month, year })
      return h.redirect(creditsPurchaseConstants.routes.CREDITS_PURCHASE_DATE_OF_BIRTH)
    }

    request.yar.set(creditsPurchaseConstants.redisKeys.CREDITS_PURCHASE_DATE_OF_BIRTH, dateAsISOString)

    const referrerUrl = getValidReferrerUrl(request.yar, creditsPurchaseConstants.CREDITS_PURCHASE_CDD_VALID_REFERRERS)
    return h.redirect(referrerUrl || creditsPurchaseConstants.routes.CREDITS_PURCHASE_NATIONALITY)
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
