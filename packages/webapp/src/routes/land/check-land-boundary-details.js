import constants from '../../utils/constants.js'
import { processCompletedRegistrationTask } from '../../utils/helpers.js'
import path from 'path'

const handlers = {
  get: async (request, h) => h.view(constants.views.CHECK_LAND_BOUNDARY_DETAILS, getContext(request)),
  post: async (request, h) => {
    processCompletedRegistrationTask(request, { taskTitle: 'Land information', title: 'Add land boundary details' })
    return h.redirect(constants.routes.REGISTER_LAND_TASK_LIST)
  }
}

const getContext = request => {
  return {
    landBoundaryFileName: getLegalLandBoundaryFileName(request),
    gridReference: request.yar.get(constants.redisKeys.LAND_BOUNDARY_GRID_REFERENCE),
    areaInHectare: (parseFloat(request.yar.get(constants.redisKeys.LAND_BOUNDARY_HECTARES)) || '0') + ' ha'
  }
}

const getLegalLandBoundaryFileName = request => {
  const fileLocation = request.yar.get(constants.redisKeys.LAND_BOUNDARY_LOCATION)
  return fileLocation ? path.parse(fileLocation).base : ''
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
