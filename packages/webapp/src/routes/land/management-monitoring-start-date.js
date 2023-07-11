import constants from '../../utils/constants.js'
import {
  checkApplicantDetails,
  dateClasses,
  getMinDateCheckError,
  isDate1LessThanDate2,
  processRegistrationTask,
  validateAndParseISOString,
  validateDate
} from '../../utils/helpers.js'

const ID = 'managementMonitoringStartDate'

const handlers = {
  get: async (request, h) => {
    processRegistrationTask(request, {
      taskTitle: 'Habitat information',
      title: 'Add habitat management and monitoring details'
    }, {
      inProgressUrl: constants.routes.MANAGEMENT_MONITORING_START_DATE
    })
    const { day, month, year } = validateAndParseISOString(request.yar.get(constants.redisKeys.MANAGEMENT_MONITORING_START_DATE_KEY))
    return h.view(constants.views.MANAGEMENT_MONITORING_START_DATE, {
      dateClasses,
      day,
      month,
      year
    })
  },
  post: async (request, h) => {
    const { day, month, year, dateAsISOString, context } = validateDate(request.payload, ID, 'date the 30 year management and monitoring period will start')
    if (!context.err) {
      context.err = getMinDateCheckError(dateAsISOString, ID, constants.minStartDates.MANAGEMENT_MONITORING_MIN_START_DATE)
    }
    if (context.err) {
      return h.view(constants.views.MANAGEMENT_MONITORING_START_DATE, {
        day,
        month,
        year,
        dateClasses,
        ...context
      })
    } else {
      request.yar.set(constants.redisKeys.MANAGEMENT_MONITORING_START_DATE_KEY, dateAsISOString)
      return h.redirect(request.yar.get(constants.redisKeys.REFERER, true) || constants.routes.CHECK_MANAGEMENT_MONITORING_DETAILS)
    }
  }
}

export default [{
  method: 'GET',
  path: constants.routes.MANAGEMENT_MONITORING_START_DATE,
  handler: handlers.get,
  config: {
    pre: [checkApplicantDetails]
  }
}, {
  method: 'POST',
  path: constants.routes.MANAGEMENT_MONITORING_START_DATE,
  handler: handlers.post
}]
