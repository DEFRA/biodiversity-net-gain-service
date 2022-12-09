import constants from '../../utils/constants.js'
import { checked } from '../../utils/helpers.js'

const handlers = {
  get: async (request, h) => {
    const inEngland = request.yar.get(constants.redisKeys.ELIGIBILITY_SITE_IN_ENGLAND)
    return h.view(constants.views.ELIGIBILITY_SITE_IN_ENGLAND, {
      inEngland,
      checked
    })
  },
  post: async (request, h) => {
    const inEngland = request.payload.inEngland
    if (!inEngland) {
      return h.view(constants.views.ELIGIBILITY_SITE_IN_ENGLAND, {
        checked,
        err: [{
          text: 'Select yes if the biodiversity gain site is in England',
          href: '#inEngland'
        }]
      })
    }
    request.yar.set(constants.redisKeys.ELIGIBILITY_SITE_IN_ENGLAND, inEngland)
    if (inEngland === 'Yes') {
      return h.redirect(constants.routes.ELIGIBILITY_CONSENT)
    } else {
      return h.redirect(constants.routes.ELIGIBILITY_CANNOT_CONTINUE)
    }
  }
}

export default [{
  method: 'GET',
  path: constants.routes.ELIGIBILITY_SITE_IN_ENGLAND,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.ELIGIBILITY_SITE_IN_ENGLAND,
  handler: handlers.post
}]
