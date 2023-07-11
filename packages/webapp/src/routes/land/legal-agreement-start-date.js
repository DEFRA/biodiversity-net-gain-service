import constants from '../../utils/constants.js'
import {
  checkApplicantDetails,
  dateClasses,
  getMinDateCheckError,
  processRegistrationTask,
  validateAndParseISOString,
  validateDate,
  getLegalAgreementDocumentType
} from '../../utils/helpers.js'

const handlers = {
  get: async (request, h) => {
    processRegistrationTask(request, {
      taskTitle: 'Legal information',
      title: 'Add legal agreement details'
    }, {
      inProgressUrl: constants.routes.LEGAL_AGREEMENT_START_DATE
    })
    const { day, month, year } = validateAndParseISOString(request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_START_DATE_KEY))
    const documentType = request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_DOCUMENT_TYPE)?.toLowerCase()

    return h.view(constants.views.LEGAL_AGREEMENT_START_DATE, {
      dateClasses,
      day,
      month,
      year,
      legalAgreementType: getLegalAgreementDocumentType(documentType)
    })
  },
  post: async (request, h) => {
    const ID = 'legalAgreementStartDate'
    const { day, month, year, dateAsISOString, context } = validateDate(request.payload, ID, 'start date of the legal agreement')
    if (!context.err) {
      context.err = getMinDateCheckError(dateAsISOString, ID, constants.minStartDates.LEGAL_AGREEMENT_MIN_START_DATE)
    }

    if (context.err) {
      return h.view(constants.views.LEGAL_AGREEMENT_START_DATE, {
        day,
        month,
        year,
        dateClasses,
        ...context
      })
    } else {
      request.yar.set(constants.redisKeys.LEGAL_AGREEMENT_START_DATE_KEY, dateAsISOString)
      return h.redirect(request.yar.get(constants.redisKeys.REFERER, true) || constants.routes.CHECK_LEGAL_AGREEMENT_DETAILS)
    }
  }
}
export default [{
  method: 'GET',
  path: constants.routes.LEGAL_AGREEMENT_START_DATE,
  handler: handlers.get,
  config: {
    pre: [checkApplicantDetails]
  }
}, {
  method: 'POST',
  path: constants.routes.LEGAL_AGREEMENT_START_DATE,
  handler: handlers.post
}]
