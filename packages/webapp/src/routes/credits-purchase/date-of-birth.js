import creditsPurchaseConstants from '../../utils/credits-purchase-constants.js'
import {
  dateClasses,
  validateAndParseISOString,
  validateDate
} from '../../utils/helpers.js'

const dayErrorMessage = 'Enter the day as a number. The day is a number between 1 and 31'
const monthErrorMessage = 'Enter the month as a number. The month is a number between 1 and 12'
const yearErrorMessage = 'Enter the year as a number. The year is a number, like 1998, or 2021'

const replaceErrorMessages = context => {
  const errText = context.err[0].text

  if (errText.includes('must include a day')) {
    context.err[0].text = dayErrorMessage
  }

  if (errText.includes('must include a month')) {
    context.err[0].text = monthErrorMessage
  }

  if (errText.includes(' must include a year')) {
    context.err[0].text = yearErrorMessage
  }

  if (errText.includes('Enter the')) {
    context.err[0].text = dayErrorMessage
    context.err[0].dayError = true
    delete context.err[0].dateError
  }
}

const handlers = {
  get: (request, h) => {
    const { day, month, year } = validateAndParseISOString(request.yar.get(creditsPurchaseConstants.redisKeys.CREDITS_PURCHASE_DATE_OF_BIRTH))

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
    const { day, month, year, dateAsISOString, context } = validateDate(request.payload, ID, '', 'Date of birth', true)

    if (context.err) {
      replaceErrorMessages(context)
      return h.view(creditsPurchaseConstants.views.CREDITS_PURCHASE_DATE_OF_BIRTH, {
        day,
        month,
        year,
        dateClasses,
        ...context,
        backLink: creditsPurchaseConstants.routes.CREDITS_PURCHASE_MIDDLE_NAME
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
