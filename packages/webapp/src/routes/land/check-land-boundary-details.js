import constants from '../../utils/constants.js'
import { processCompletedRegistrationTask } from '../../utils/helpers.js'
import geospatialOrLandBoundaryContext from './helpers/geospatial-or-land-boundary-context.js'

const handlers = {
  get: async (request, h) => h.view(constants.views.CHECK_LAND_BOUNDARY_DETAILS, geospatialOrLandBoundaryContext(request)),
  post: async (request, h) => {
    processCompletedRegistrationTask(request, { taskTitle: 'Land information', title: 'Add land boundary details' })
    return h.redirect(constants.routes.REGISTER_LAND_TASK_LIST)
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
