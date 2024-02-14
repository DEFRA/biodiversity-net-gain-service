import constants from '../../utils/constants.js'

const handlers = {
  get: async (request, h) => {
    return h.view(constants.views.DEVELOPER_LANDOWNER_OR_LEASEHOLDER)
  }
}

export default [{
  method: 'GET',
  path: constants.routes.DEVELOPER_LANDOWNER_OR_LEASEHOLDER,
  handler: handlers.get
}]
