import constants from '../../credits/constants.js'

const handlers = {
  get: async (request, h) => {
    return h.view(constants.views.ESTIMATOR_CREDITS_TERM_AND_CONDITIONS)
  },
  post: async (request, h) => {
    const consent = request.payload.termsAndConditions
    if (!consent) {
      return h.view(constants.views.ESTIMATOR_CREDITS_TERM_AND_CONDITIONS, {
        err: [{
          text: 'Check the box to confirm you have read the Ts and Cs',
          href: '#termsAndConditions'
        }]
      })
    } else {
      request.yar.set(constants.redisKeys.CREDITS_TERMS_AND_CONDITIONS, consent)
      return h.redirect(constants.routes.ESTIMATOR_CREDITS_CHECK_YOUR_ANSWERS)
    }
  }
}

export default [{
  method: 'GET',
  path: constants.routes.ESTIMATOR_CREDITS_TERM_AND_CONDITIONS,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.ESTIMATOR_CREDITS_TERM_AND_CONDITIONS,
  handler: handlers.post
}]
