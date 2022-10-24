import constants from '../../utils/constants.js'

const handlers = {
  get: async (_request, h) => h.view(constants.views.ADD_GRID_REFERENCE),
  post: async (request, h) => {
    const gridReference = request.payload.gridReference.replace(' ', '')
    const err = validateGridReference(gridReference)

    if (err) {
      return h.view(constants.views.ADD_GRID_REFERENCE, {
        gridReference: request.payload.gridReference,
        err: [{
          text: err,
          href: '#gridReference'
        }]
      })
    } else {
      request.yar.set(constants.redisKeys.LAND_BOUNDARY_GRID_REFERENCE, gridReference)
      return h.redirect(constants.routes.ADD_HECTARES)
    }
  }
}

const validateGridReference = gridReference => {
  if (gridReference.length === 0) {
    return 'Enter the grid reference'
  }
  if (gridReference.length < 6 || gridReference.length > 14) {
    return 'Grid reference must be between 6 and 14 characters'
  }
  if (!constants.gridReferenceRegEx.test(gridReference)) {
    return 'Grid reference must start with two letters, followed by only numbers and spaces, like SE 170441'
  }
  return ''
}

export default [{
  method: 'GET',
  path: constants.routes.ADD_GRID_REFERENCE,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.ADD_GRID_REFERENCE,
  handler: handlers.post
}]
