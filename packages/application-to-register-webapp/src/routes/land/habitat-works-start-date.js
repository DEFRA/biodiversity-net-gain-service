import constants from '../../utils/constants.js'

const handlers = {
  get: async (_request, h) => h.view(constants.views.HABITAT_WORKS_START_DATE),
  post: async (request, h) => {
    const day = request.payload['habitatWorksStartDate-day']
    const month = request.payload['habitatWorksStartDate-month']
    const year = request.payload['habitatWorksStartDate-year']
    const context = {}
    validateDate(context, day, month, year)
    const date = new Date(`${year}-${month}-${day}`)
    if (context.err) {
      return h.view(constants.views.HABITAT_WORKS_START_DATE, context)
    } else {
      request.yar.set(constants.redisKeys.HABITAT_WORKS_START_DATE_KEY, date.toISOString())
      return h.redirect(`/${constants.views.MANAGEMENT_MONITORING_START_DATE}`)
    }
  }
}

const validateDate = (context, day, month, year) => {
  if (!day && !month && !year) {
    context.err = [{
      text: 'Enter the start date of the habitat enhancement works',
      href: '#habitatWorksStartDate-day'
    }]
  } else if (!day) {
    context.err = [{
      text: 'Start date must include a day',
      href: '#habitatWorksStartDate-day'
    }]
  } else if (!month) {
    context.err = [{
      text: 'Start date must include a month',
      href: '#habitatWorksStartDate-month'
    }]
  } else if (!year) {
    context.err = [{
      text: 'Start date must include a year',
      href: '#habitatWorksStartDate-year'
    }]
  } else if (isNaN(Date.parse(`${year}-${month}-${day}`))) {
    context.err = [{
      text: 'Start date must be a real date',
      href: '#habitatWorksStartDate-day'
    }]
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
