import constants from '../../utils/constants.js'
import { getReferrer, setReferrer } from '../../utils/helpers.js'

const handlers = {
  get: async (request, h) => {
    setReferrer(request, constants.redisKeys.LAND_OWNERSHIP_KEY)
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
      const referredFrom = getReferrer(request, constants.redisKeys.LAND_OWNERSHIP_KEY, true)
      if (constants.REFERRAL_PAGE_LIST.includes(referredFrom)) {
        return h.redirect(constants.routes.CHECK_OWNERSHIP_DETAILS)
      }
      return h.redirect(constants.routes.LANDOWNER_CONSENT)
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
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.ADD_LANDOWNERS,
  handler: handlers.post
}]
