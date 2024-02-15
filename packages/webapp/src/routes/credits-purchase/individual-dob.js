import constants from '../../utils/constants.js'
import {
  dateClasses,
  validateAndParseISOString,
  validateDate
} from '../../utils/helpers.js'

export default [{
  method: 'GET',
  path: constants.routes.PURCHASE_CREDITS_INDIVIDUAL_DOB,
  handler: (_request, h) => {
    const { day, month, year } = validateAndParseISOString(_request.yar.get(constants.redisKeys.PURCHASE_CREDITS_INDIVIDUAL_DOB))

    return h.view(constants.views.PURCHASE_CREDITS_INDIVIDUAL_DOB, {
      dateClasses,
      day,
      month,
      year
    })
  }
}, {
  method: 'POST',
  path: constants.routes.PURCHASE_CREDITS_INDIVIDUAL_DOB,
  handler: (request, h) => {
    const ID = 'dob'
    const { day, month, year, dateAsISOString, context } = validateDate(request.payload, ID, 'individual DOB', 'date of birth', true)
    if (context.err) {
      return h.view(constants.views.PURCHASE_CREDITS_INDIVIDUAL_DOB, {
        day,
        month,
        year,
        dateClasses,
        ...context
      })
    }
    request.yar.set(constants.redisKeys.PURCHASE_CREDITS_INDIVIDUAL_DOB, dateAsISOString)
    return h.redirect(constants.routes.PURCHASE_CREDITS_INDIVIDUAL_NATIONALITY)
  }
}]
