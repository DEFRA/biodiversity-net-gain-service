import constants from '../../utils/constants.js'
import { validateDate, dateClasses } from '../../utils/helpers.js'

const ID = 'habitatWorksStartDate'

const handlers = {
  get: async (request, h) => {
    const date = request.yar.get(constants.redisKeys.HABITAT_WORKS_START_DATE_KEY) && new Date(request.yar.get(constants.redisKeys.HABITAT_WORKS_START_DATE_KEY))
    return h.view(constants.views.HABITAT_WORKS_START_DATE, {
      dateClasses,
      day: date && date.getDate(),
      month: date && date.getMonth() + 1,
      year: date && date.getFullYear()
    })
  },
  post: async (request, h) => {
    const day = request.payload[`${ID}-day`]
    const month = request.payload[`${ID}-month`]
    const year = request.payload[`${ID}-year`]
    const context = {}
    validateDate(context, day, month, year, ID, 'start date of the habitat enhancement works')
    const date = new Date(`${year}-${month}-${day}`)
    if (context.err) {
      return h.view(constants.views.HABITAT_WORKS_START_DATE, {
        day,
        month,
        year,
        dateClasses,
        ...context
      })
    } else {
      request.yar.set(constants.redisKeys.HABITAT_WORKS_START_DATE_KEY, date.toISOString())
      return h.redirect(`/${constants.views.MANAGEMENT_MONITORING_START_DATE}`)
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
