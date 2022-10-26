import constants from '../../utils/constants.js'
import moment from 'moment'
import { dateClasses, getReferrer, setReferrer, validateDate } from '../../utils/helpers.js'

const handlers = {
  get: async (request, h) => {
    setReferrer(request, constants.redisKeys.LEGAL_AGREEMENT_PARTIES_KEY)
    const referredFrom = getReferrer(request, constants.redisKeys.LEGAL_AGREEMENT_PARTIES_KEY, false)
    let date
    if (constants.REFERRAL_PAGE_LIST.includes(referredFrom)) {
      date = request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_START_DATE_KEY) && moment(request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_START_DATE_KEY))
    }
    return h.view(constants.views.LEGAL_AGREEMENT_START_DATE, {
      dateClasses,
      day: date?.format('DD'),
      month: date?.format('MM'),
      year: date?.format('YYYY')
    })
  },
  post: async (request, h) => {
    const ID = 'legalAgreementStartDate'
    const { day, month, year, context } = validateDate(request.payload, ID, 'start date of the legal agreement')
    const date = moment(`${year}-${month}-${day}`)

    if (context.err) {
      return h.view(constants.views.LEGAL_AGREEMENT_START_DATE, {
        day,
        month,
        year,
        dateClasses,
        ...context
      })
    } else {
      request.yar.set(constants.redisKeys.LEGAL_AGREEMENT_START_DATE_KEY, date.toISOString())
      const referredFrom = getReferrer(request, constants.redisKeys.LEGAL_AGREEMENT_PARTIES_KEY)
      if (constants.REFERRAL_PAGE_LIST.includes(referredFrom)) {
        return h.redirect(`/${constants.views.LEGAL_AGREEMENT_SUMMARY}`)
      }
      return h.redirect(`/${constants.views.LEGAL_AGREEMENT_SUMMARY}`)
    }
  }
}
export default [{
  method: 'GET',
  path: constants.routes.LEGAL_AGREEMENT_START_DATE,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.LEGAL_AGREEMENT_START_DATE,
  handler: handlers.post
}]
