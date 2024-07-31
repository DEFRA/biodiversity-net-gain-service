import constants from '../../utils/constants.js'
import geospatialOrLandBoundaryContext from './helpers/geospatial-or-land-boundary-context.js'
import { REGISTRATIONCONSTANTS } from '../../journey-validation/registration/task-sections.js'
import { getIndividualTaskStatus, getNextStep } from '../../journey-validation/task-list-generator.js'
const handlers = {
  get: async (request, h) => {
    const registrationTaskStatus = getIndividualTaskStatus(request.yar, REGISTRATIONCONSTANTS.SITE_BOUNDARY)
    if (registrationTaskStatus !== 'COMPLETED') {
      return h.redirect(constants.routes.REGISTER_LAND_TASK_LIST)
    }
    return h.view(constants.views.CHECK_LAND_BOUNDARY_DETAILS, {
      ...geospatialOrLandBoundaryContext(request),
      isGeosptialDisabled: process.env.ENABLE_ROUTE_SUPPORT_FOR_GEOSPATIAL === 'Y',
      routes: constants.routes
    })
  },
  post: async (request, h) => {
    return getNextStep(request, h)
  }
}

export default [{
  method: 'GET',
  path: constants.routes.CHECK_LAND_BOUNDARY_DETAILS,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.CHECK_LAND_BOUNDARY_DETAILS,
  handler: handlers.post
}]
