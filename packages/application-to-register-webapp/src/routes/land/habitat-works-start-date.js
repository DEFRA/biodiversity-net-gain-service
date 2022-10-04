import constants from '../../utils/constants.js'
import { validateDate } from '../../utils/helpers.js'

const ID = 'habitatWorksStartDate'

const handlers = {
  get: async (_request, h) => h.view(constants.views.HABITAT_WORKS_START_DATE),
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
