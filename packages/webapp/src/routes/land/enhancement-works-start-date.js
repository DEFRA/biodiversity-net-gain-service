import constants from '../../utils/constants.js'
import {
  checkApplicantDetails,
  dateClasses,
  processRegistrationTask,
  validateAndParseISOString,
  validateDate
} from '../../utils/helpers.js'

const handlers = {
  get: async (request, h) => {
    processRegistrationTask(request, {
      taskTitle: 'Legal information',
      title: 'Add enhancement start date'
    }, {
      inProgressUrl: constants.routes.ENHANCEMENT_WORKS_START_DATE
    })
    const { day, month, year } = validateAndParseISOString(request.yar.get(constants.redisKeys.ENHANCEMENT_WORKS_START_DATE_KEY))
    const enhancementWorkStartDateOption = request.yar.get(constants.redisKeys.ENHANCEMENT_WORKS_START_DATE_OPTION)
    return h.view(constants.views.ENHANCEMENT_WORKS_START_DATE, {
      dateClasses,
      day,
      month,
      year,
      enhancementWorkStartDateOption
    })
  },
  post: async (request, h) => {
    const ID = 'enhancementWorkStartDate'
    const { enhancementWorkStartDateOption } = request.payload
    const { day, month, year, dateAsISOString, context } = validateDate(request.payload, ID, 'start date of the enhancement work', 'Start date', true)
    if (!enhancementWorkStartDateOption) {
      return h.view(constants.views.ENHANCEMENT_WORKS_START_DATE, {
        day,
        month,
        year,
        dateClasses,
        enhancementWorkStartDateOption,
        err: [{
          text: 'Select yes if the habitat enhancement works have started',
          href: '#enhancementWorkStartDateOption'
        }]
      })
    }
    if (enhancementWorkStartDateOption === 'yes') {
      if (context.err) {
        return h.view(constants.views.ENHANCEMENT_WORKS_START_DATE, {
          day,
          month,
          year,
          dateClasses,
          enhancementWorkStartDateOption,
          ...context
        })
      }
      request.yar.set(constants.redisKeys.ENHANCEMENT_WORKS_START_DATE_KEY, dateAsISOString)
    } else {
      request.yar.set(constants.redisKeys.ENHANCEMENT_WORKS_START_DATE_KEY, null)
    }

    request.yar.set(constants.redisKeys.ENHANCEMENT_WORKS_START_DATE_OPTION, enhancementWorkStartDateOption)
    return h.redirect(request.yar.get(constants.redisKeys.REFERER, true) || constants.routes.LEGAL_AGREEMENT_END_DATE)
  }
}
export default [{
  method: 'GET',
  path: constants.routes.ENHANCEMENT_WORKS_START_DATE,
  handler: handlers.get,
  config: {
    pre: [checkApplicantDetails]
  }
}, {
  method: 'POST',
  path: constants.routes.ENHANCEMENT_WORKS_START_DATE,
  handler: handlers.post
}]
