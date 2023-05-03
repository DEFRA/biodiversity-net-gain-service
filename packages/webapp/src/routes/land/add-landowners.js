import constants from '../../utils/constants.js'
import { checkApplicantDetails, processRegistrationTask } from '../../utils/helpers.js'

const handlers = {
  get: async (request, h) => {
    processRegistrationTask(request, {
      taskTitle: 'Land information',
      title: 'Add land ownership details'
    }, {
      inProgressUrl: constants.routes.ADD_LANDOWNERS
    })
    const landowners = request.yar.get(constants.redisKeys.LANDOWNERS)
    const role = request.yar.get(constants.redisKeys.ROLE_KEY)
    return h.view(constants.views.ADD_LANDOWNERS, {
      landowners,
      role,
      landownersJSON: JSON.stringify(landowners)
    })
  },
  post: async (request, h) => {
    let landowners = request.payload.landowners || ['']
    landowners = Array.isArray(landowners) ? landowners : [landowners]
    if (landowners.length === 0 || landowners.filter(item => item.length < 2).length > 0) {
      const err = validateLandowners(landowners)
      return h.view(constants.views.ADD_LANDOWNERS, {
        landowners,
        err,
        landownersJSON: JSON.stringify(landowners)
      })
    } else {
      request.yar.set(constants.redisKeys.LANDOWNERS, landowners)
      return h.redirect(request.yar.get(constants.redisKeys.REFERER, true) || constants.routes.LANDOWNER_CONSENT)
    }
  }
}

const validateLandowners = landowners => {
  const err = []
  landowners.forEach((item, i) => {
    if (item.length < 2) {
      err.push({
        text: 'Enter the full name of the landowner',
        href: `#landowners-${i}`
      })
    }
  })
  return err
}

export default [{
  method: 'GET',
  path: constants.routes.ADD_LANDOWNERS,
  handler: handlers.get,
  config: {
    pre: [checkApplicantDetails]
  }
}, {
  method: 'POST',
  path: constants.routes.ADD_LANDOWNERS,
  handler: handlers.post
}]
