import constants from '../../utils/constants.js'

const handlers = {
  get: async (request, h) => {
    const landowners = request.yar.get(constants.redisKeys.LANDOWNERS)
    const role = request.yar.get(constants.redisKeys.ROLE_KEY)
    return h.view(constants.views.ADD_LANDOWNERS, {
      landowners,
      role,
      landownersJSON: JSON.stringify(landowners)
    })
  },
  post: async (request, h) => {
    const landowners = request.payload.landowners || []
    // if last name is blank then delete
    if (landowners.length > 0 && landowners[landowners.length - 1] === '') {
      landowners.pop()
    }

    if (landowners.length === 0 || landowners.filter(item => item.length === 0).length > 0) {
      const err = [{
        text: 'Enter the full name of the landowner',
        href: '#landowners'
      }]
      return h.view(constants.views.ADD_LANDOWNERS, {
        landowners,
        err,
        landownersJSON: JSON.stringify(landowners)
      })
    } else {
      request.yar.set(constants.redisKeys.LANDOWNERS, landowners)
      return h.redirect(constants.routes.LANDOWNER_CONSENT)
    }
  }
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
