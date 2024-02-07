import constants from '../../utils/constants.js'

const handlers = {
  get: async (request, h) => {
    const isLandowner =
      request.yar.get(constants.redisKeys.DEVELOPER_LANDOWNER_OR_LEASEHOLDER_VALUE)
    return h.view(constants.views.DEVELOPER_LANDOWNER_OR_LEASEHOLDER, { isLandowner })
  },
  post: async (request, h) => {
    const selection = request.payload.isLandowner

    if (!selection) {
      return h.view(constants.views.DEVELOPER_LANDOWNER_OR_LEASEHOLDER, {
        err: [{
          text: 'Select yes if you\'re the landowner or leaseholder',
          href: '#landownerOnly'
        }]
      })
    }
    request.yar.set(constants.redisKeys.DEVELOPER_LANDOWNER_OR_LEASEHOLDER_VALUE, selection)
    if (selection === constants.DEVELOPER_IS_LANDOWNER_OR_LEASEHOLDER.YES) {
      return h.redirect(request.yar.get(constants.redisKeys.REFERER, true) || constants.routes.DEVELOPER_UPLOAD_CONSENT_TO_USE_GAIN_SITE)
    } else {
      return h.redirect(constants.routes.DEVELOPER_CLIENT_INDIVIDUAL_ORGANISATION)
    }
  }
}

export default [{
  method: 'GET',
  path: constants.routes.DEVELOPER_LANDOWNER_OR_LEASEHOLDER,
  handler: handlers.get
},
{
  method: 'POST',
  path: constants.routes.DEVELOPER_LANDOWNER_OR_LEASEHOLDER,
  handler: handlers.post
}]
