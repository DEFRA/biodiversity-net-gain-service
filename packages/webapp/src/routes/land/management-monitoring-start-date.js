import constants from '../../utils/constants.js'
import { validateDate, dateClasses, validateAndParseISOString, isDate1LessThanDate2, getFullISOString, processRegistrationTask } from '../../utils/helpers.js'

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
    const { day, month, year, context } = validateDate(request.payload, ID, 'date the 30 year management and monitoring period will start', constants.minStartDates.MANAGEMENT_MONITORING_MIN_START_DATE)
    const habitatWorksStartDate = request.yar.get(constants.redisKeys.HABITAT_WORKS_START_DATE_KEY)
    const startDate = getFullISOString(day, month, year)
    if (!context.err && isDate1LessThanDate2(startDate, habitatWorksStartDate)) {
      context.err = [{
        text: 'Start date of the 30 year management and monitoring period must be the same as or after the date the habitat enhancement works begin',
        href: `#${ID}-day`,
        dateError: true
      }]
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
      request.yar.set(constants.redisKeys.MANAGEMENT_MONITORING_START_DATE_KEY, getFullISOString(day, month, year))
      return h.redirect(request.yar.get(constants.redisKeys.REFERER, true) || constants.routes.CHECK_MANAGEMENT_MONITORING_DETAILS)
    }
  }
}

export default [{
  method: 'GET',
  path: constants.routes.MANAGEMENT_MONITORING_START_DATE,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.MANAGEMENT_MONITORING_START_DATE,
  handler: handlers.post
}]
