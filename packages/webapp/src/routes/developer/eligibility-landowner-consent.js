import constants from '../../utils/constants.js'
import { checked } from '../../utils/helpers.js'

const href = '#writtenConsentYes'
const handlers = {
  get: async (request, h) => h.view(constants.views.DEVELOPER_ELIGIBILITY_LO_CONSENT, {
    ...getContext(request),
    checked
  }),
  post: async (request, h) => {
    const eligibilityLOConsentValue = request.payload.eligibilityLOConsentValue
    request.yar.set(constants.redisKeys.DEVELOPER_WRITTEN_CONTENT_VALUE, eligibilityLOConsentValue)
    if (!eligibilityLOConsentValue) {
      return h.view(constants.views.DEVELOPER_ELIGIBILITY_LO_CONSENT, {
        ...getContext(request),
        checked,
        err: [
          {
            text: 'You need to select an option',
            href
          }
        ]
      })
    }
    return h.redirect(constants.routes.DEVELOPER_ELIGIBILITY_METRIC)
  }
}

const getContext = request => ({
  hasWrittenConsent: request.yar.get(constants.redisKeys.DEVELOPER_WRITTEN_CONTENT_VALUE)
})

export default [{
  method: 'GET',
  path: constants.routes.DEVELOPER_ELIGIBILITY_LO_CONSENT,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.DEVELOPER_ELIGIBILITY_LO_CONSENT,
  handler: handlers.post
}]
