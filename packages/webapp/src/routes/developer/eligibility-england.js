import constants from '../../utils/constants.js'

const href = '#eligibility-yes'
const handlers = {
  get: async (_request, h) => h.view(constants.views.DEVELOPER_ELIGIBILITY_ENGLAND),
  post: async (request, h) => {
    const eligibilityEngValue = request.payload.eligibilityEngValue
    request.yar.set(constants.redisKeys.DEVELOPER_ELIGIBILITY_ENGLAND_VALUE, eligibilityEngValue)
    if (eligibilityEngValue === 'yes') {
      return h.redirect(constants.routes.DEVELOPER_ELIGIBILITY_LO_CONSENT)
    } else if (eligibilityEngValue === 'no' || eligibilityEngValue === 'not-sure') {
      return h.redirect(constants.routes.DEVELOPER_ELIGIBILITY_NO)
    } else {
      return h.view(constants.views.DEVELOPER_ELIGIBILITY_ENGLAND, {
        ...getContext(request),
        err: [
          {
            text: 'You need to select an option',
            href
          }
        ]
      })
    }
  }
}

const getContext = request => ({
  selectedEligibility: request.yar.get(constants.redisKeys.DEVELOPER_ELIGIBILITY_ENGLAND_VALUE)
})

export default [{
  method: 'GET',
  path: constants.routes.DEVELOPER_ELIGIBILITY_ENGLAND,
  handler: handlers.get
}]
