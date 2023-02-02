import constants from '../../utils/constants.js'
import moment from 'moment'
import { dateClasses, validateDate, processRegistrationTask } from '../../utils/helpers.js'

const handlers = {
  get: async (request, h) => {
    processRegistrationTask(request, {
      taskTitle: 'Legal information',
      title: 'Add legal agreement details'
    }, {
      inProgressUrl: constants.routes.LEGAL_AGREEMENT_START_DATE
    })
    let date
    if (request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_START_DATE_KEY)) {
      date = request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_START_DATE_KEY) && moment(request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_START_DATE_KEY))
    }
    return h.view(constants.views.LEGAL_AGREEMENT_START_DATE, {
      dateClasses,
      day: date?.format('DD'),
      month: date?.format('MM'),
      year: date?.format('YYYY')
    })
  },
  post: async (request, h) => {
    const ID = 'legalAgreementStartDate'
    const { day, month, year, context } = validateDate(request.payload, ID, 'start date of the legal agreement')
    const date = moment.utc(`${year}-${month}-${day}`)

    if (context.err) {
      return h.view(constants.views.LEGAL_AGREEMENT_START_DATE, {
        day,
        month,
        year,
        dateClasses,
        ...context
      })
    } else {
      request.yar.set(constants.redisKeys.LEGAL_AGREEMENT_START_DATE_KEY, date.toISOString())
      return h.redirect(request.yar.get(constants.redisKeys.REFERER, true) || constants.routes.CHECK_LEGAL_AGREEMENT_DETAILS)
    }
  }
}
export default [{
  method: 'GET',
  path: constants.routes.LEGAL_AGREEMENT_START_DATE,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.LEGAL_AGREEMENT_START_DATE,
  handler: handlers.post
}]
