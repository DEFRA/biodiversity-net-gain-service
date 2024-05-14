import constants from '../../utils/constants.js'
import {
  dateClasses,
  validateAndParseISOString,
  validateDate,
  getValidReferrerUrl
} from '../../utils/helpers.js'

const handlers = {
  get: async (request, h) => {
    const { day, month, year } = validateAndParseISOString(request.yar.get(constants.redisKeys.HABITAT_ENHANCEMENTS_END_DATE_KEY))
    const habitatEnhancementsEndDateOption = request.yar.get(constants.redisKeys.HABITAT_ENHANCEMENTS_END_DATE_OPTION)
    return h.view(constants.views.HABITAT_ENHANCEMENTS_END_DATE, {
      dateClasses,
      day,
      month,
      year,
      habitatEnhancementsEndDateOption
    })
  },
  post: async (request, h) => {
    const ID = 'habitatEnhancementsEndDate'
    const { habitatEnhancementsEndDateOption } = request.payload
    const { day, month, year, dateAsISOString, context } = validateDate(request.payload, ID, 'end date of the requirement to create and maintain habitat enhancements', 'End date')
    if (!habitatEnhancementsEndDateOption) {
      return h.view(constants.views.HABITAT_ENHANCEMENTS_END_DATE, {
        day,
        month,
        year,
        dateClasses,
        habitatEnhancementsEndDateOption,
        err: [{
          text: 'Select yes if the requirement to create and maintain habitat enhancements has an end date',
          href: '#habitatEnhancementsEndDateOption'
        }]
      })
    }
    if (habitatEnhancementsEndDateOption === 'yes') {
      if (context.err) {
        return h.view(constants.views.HABITAT_ENHANCEMENTS_END_DATE, {
          day,
          month,
          year,
          dateClasses,
          habitatEnhancementsEndDateOption,
          ...context
        })
      }
      request.yar.set(constants.redisKeys.HABITAT_ENHANCEMENTS_END_DATE_KEY, dateAsISOString)
    } else {
      request.yar.set(constants.redisKeys.HABITAT_ENHANCEMENTS_END_DATE_KEY, null)
    }
    request.yar.set(constants.redisKeys.HABITAT_ENHANCEMENTS_END_DATE_OPTION, habitatEnhancementsEndDateOption)
    const referrerUrl = getValidReferrerUrl(request.yar, constants.LAND_LEGAL_AGREEMENT_VALID_REFERRERS)
    return h.redirect(referrerUrl || constants.routes.CHECK_LEGAL_AGREEMENT_DETAILS)
  }
}

export default [{
  method: 'GET',
  path: constants.routes.HABITAT_ENHANCEMENTS_END_DATE,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.HABITAT_ENHANCEMENTS_END_DATE,
  handler: handlers.post
}]
