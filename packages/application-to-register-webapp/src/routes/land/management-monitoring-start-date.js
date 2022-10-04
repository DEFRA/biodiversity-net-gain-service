import constants from '../../utils/constants.js'

const DAY = 'managementMonitoringStartDate-day'
const MONTH = 'managementMonitoringStartDate-month'
const YEAR = 'managementMonitoringStartDate-year'

const handlers = {
  get: async (_request, h) => h.view(constants.views.MANAGEMENT_MONITORING_START_DATE),
  post: async (request, h) => {
    const day = request.payload[DAY]
    const month = request.payload[MONTH]
    const year = request.payload[YEAR]
    const context = {}
    validateDate(context, day, month, year)
    const date = new Date(`${year}-${month}-${day}`)
    const habitatWorksStartDate = new Date(request.yar.get(constants.redisKeys.HABITAT_WORKS_START_DATE_KEY))
    if (date < habitatWorksStartDate) {
      context.err = [{
        text: 'Start date of the 30 year management and monitoring period must be the same as or after the date the habitat enhancement works begin',
        href: `#${DAY}`
      }]
    }
    if (context.err) {
      return h.view(constants.views.MANAGEMENT_MONITORING_START_DATE, {
        day,
        month,
        year,
        ...context
      })
    } else {
      request.yar.set(constants.redisKeys.MANAGEMENT_MONITORING_START_DATE_KEY, date.toISOString())
      return h.redirect(`/${constants.views.MANAGEMENT_MONITORING_START_DATE}`)
    }
  }
}

const validateDate = (context, day, month, year) => {
  if (!day && !month && !year) {
    context.err = [{
      text: 'Enter the date the 30 year management and monitoring period will start',
      href: `#${DAY}`
    }]
  } else if (!day) {
    context.err = [{
      text: 'Start date must include a day',
      href: `#${DAY}`
    }]
  } else if (!month) {
    context.err = [{
      text: 'Start date must include a month',
      href: `#${MONTH}`
    }]
  } else if (!year) {
    context.err = [{
      text: 'Start date must include a year',
      href: `#${YEAR}`
    }]
  } else if (isNaN(Date.parse(`${year}-${month}-${day}`))) {
    context.err = [{
      text: 'Start date must be a real date',
      href: `#${DAY}`
    }]
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
