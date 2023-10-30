import constants from '../../utils/constants.js'
import {
  dateClasses,
  processRegistrationTask,
  validateAndParseISOString,
  validateDate
} from '../../utils/helpers.js'

const handlers = {
  get: async (request, h) => {
    processRegistrationTask(request, {
      taskTitle: 'Legal information',
      title: 'Add legal agreement details'
    }, {
      inProgressUrl: constants.routes.LEGAL_AGREEMENT_END_DATE
    })
    const { day, month, year } = validateAndParseISOString(request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_END_DATE_KEY))
    const legalAgreementEndDateOption = request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_END_DATE_OPTION)
    return h.view(constants.views.LEGAL_AGREEMENT_END_DATE, {
      dateClasses,
      day,
      month,
      year,
      legalAgreementEndDateOption
    })
  },
  post: async (request, h) => {
    const ID = 'legalAgreementEndDate'
    const { legalAgreementEndDateOption } = request.payload
    const { day, month, year, dateAsISOString, context } = validateDate(request.payload, ID, 'end date of the legal agreement', 'End date')
    if (!legalAgreementEndDateOption) {
      return h.view(constants.views.LEGAL_AGREEMENT_END_DATE, {
        day,
        month,
        year,
        dateClasses,
        legalAgreementEndDateOption,
        err: [{
          text: 'Select yes if the legal agreement has an end date',
          href: '#legalAgreementEndDateOption'
        }]
      })
    }
    if (legalAgreementEndDateOption === 'yes') {
      if (context.err) {
        return h.view(constants.views.LEGAL_AGREEMENT_END_DATE, {
          day,
          month,
          year,
          dateClasses,
          legalAgreementEndDateOption,
          ...context
        })
      }
      request.yar.set(constants.redisKeys.LEGAL_AGREEMENT_END_DATE_KEY, dateAsISOString)
    } else {
      request.yar.set(constants.redisKeys.LEGAL_AGREEMENT_END_DATE_KEY, null)
    }
    request.yar.set(constants.redisKeys.LEGAL_AGREEMENT_END_DATE_OPTION, legalAgreementEndDateOption)
    return h.redirect(request.yar.get(constants.redisKeys.REFERER, true) || constants.routes.CHECK_LEGAL_AGREEMENT_DETAILS)
  }
}

export default [{
  method: 'GET',
  path: constants.routes.LEGAL_AGREEMENT_END_DATE,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.LEGAL_AGREEMENT_END_DATE,
  handler: handlers.post
}]
