import constants from '../../utils/constants.js'

const handlers = {
  get: async (_request, h) => h.view(constants.views.REGISTERED_LANDOWNER),
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
    request.yar.set(constants.cacheKeys.REGISTERED_LANDOWNER_ONLY, selection)
    if (JSON.parse(selection)) {
      request.yar.set(constants.cacheKeys.LANDOWNERS, [])
      return h.redirect(request.yar.get(constants.cacheKeys.REFERER, true) || constants.routes.LAND_OWNERSHIP_PROOF_LIST)
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
