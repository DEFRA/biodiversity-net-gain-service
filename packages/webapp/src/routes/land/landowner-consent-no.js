import constants from '../../utils/constants.js'

export default {
  method: 'GET',
  path: constants.routes.LANDOWNER_CONSENT_NO,
  handler: (_request, h) => h.view(constants.views.LANDOWNER_CONSENT_NO)
}
