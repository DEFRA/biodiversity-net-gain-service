import constants from '../../utils/constants.js'
import { validateDate, dateClasses, validateAndParseISOString, getFullISOString, processRegistrationTask } from '../../utils/helpers.js'

const ID = 'habitatWorksStartDate'

const handlers = {
  get: async (request, h) => {
    processRegistrationTask(request, {
      taskTitle: 'Habitat information',
      title: 'Add habitat management and monitoring details'
    }, {
      inProgressUrl: constants.routes.HABITAT_WORKS_START_DATE
    })
    const { day, month, year } = validateAndParseISOString(request.yar.get(constants.redisKeys.HABITAT_WORKS_START_DATE_KEY))
    return h.view(constants.views.HABITAT_WORKS_START_DATE, {
      dateClasses,
      day,
      month,
      year
    })
  },
  post: async (request, h) => {
    const { day, month, year, context } = validateDate(request.payload, ID, 'start date of the habitat enhancement works', constants.minStartDates.HABITAT_WORKS_MIN_START_DATE)
    if (context.err) {
      return h.view(constants.views.HABITAT_WORKS_START_DATE, {
        day,
        month,
        year,
        dateClasses,
        ...context
      })
    } else {
      request.yar.set(constants.redisKeys.HABITAT_WORKS_START_DATE_KEY, getFullISOString(day, month, year))
      return h.redirect(constants.routes.MANAGEMENT_MONITORING_START_DATE)
    }
  }
}

export default [{
  method: 'GET',
  path: constants.routes.HABITAT_WORKS_START_DATE,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.HABITAT_WORKS_START_DATE,
  handler: handlers.post
}]
