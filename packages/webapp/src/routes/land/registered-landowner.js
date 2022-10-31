import constants from '../../utils/constants.js'

const handlers = {
  get: async (request, h) => {
    const yesChecked = request.yar.get(constants.redisKeys.REGISTERED_LANDOWNER_ONLY) === 'true'
    const noChecked = request.yar.get(constants.redisKeys.REGISTERED_LANDOWNER_ONLY) === 'false'
    return h.view(constants.views.REGISTERED_LANDOWNER, {
      yesChecked,
      noChecked
    })
  },
  post: async (request, h) => {
    const selection = request.payload.landownerOnly
    if (!selection) {
      return h.view(constants.views.REGISTERED_LANDOWNER, {
        err: [{
          text: 'Select yes if you\'re the only registered landowner',
          href: '#landownerOnly'
        }]
      })
    }
    request.yar.set(constants.redisKeys.REGISTERED_LANDOWNER_ONLY, selection)
    if (JSON.parse(selection)) {
      request.yar.set(constants.redisKeys.LANDOWNERS, [])
      return h.redirect(request.yar.get(constants.redisKeys.REFERER, true) || constants.routes.CHECK_OWNERSHIP_DETAILS)
    } else {
      return h.redirect(constants.routes.ADD_LANDOWNERS)
    }
  }
}

export default [{
  method: 'GET',
  path: constants.routes.REGISTERED_LANDOWNER,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.REGISTERED_LANDOWNER,
  handler: handlers.post
}]
