import constants from '../../utils/constants.js'
import { validateDate, dateClasses } from '../../utils/helpers.js'
import moment from 'moment'

const ID = 'managementMonitoringStartDate'

const handlers = {
  get: async (request, h) => {
    const date = request.yar.get(constants.redisKeys.MANAGEMENT_MONITORING_START_DATE_KEY) && moment(request.yar.get(constants.redisKeys.MANAGEMENT_MONITORING_START_DATE_KEY))
    return h.view(constants.views.MANAGEMENT_MONITORING_START_DATE, {
      dateClasses,
      day: date && date.format('DD'),
      month: date && date.format('MM'),
      year: date && date.format('YYYY')
    })
  },
  post: async (request, h) => {
    const { day, month, year, context } = validateDate(request.payload, ID, 'date the 30 year management and monitoring period will start')
    const date = moment.utc(`${year}-${month}-${day}`)
    const habitatWorksStartDate = moment(request.yar.get(constants.redisKeys.HABITAT_WORKS_START_DATE_KEY))
    if (!context.err && date < habitatWorksStartDate) {
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
      request.yar.set(constants.redisKeys.MANAGEMENT_MONITORING_START_DATE_KEY, date.toISOString())
      return h.redirect(request.yar.get(constants.redisKeys.REFERER, true) || constants.routes.MANAGEMENT_MONITORING_START_DATE)
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
