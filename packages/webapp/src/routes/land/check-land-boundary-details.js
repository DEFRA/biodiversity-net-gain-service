import constants from '../../utils/constants.js'
import geospatialOrLandBoundaryContext from './helpers/geospatial-or-land-boundary-context.js'
import { REGISTRATIONCONSTANTS } from '../../journey-validation/registration/task-sections.js'
import { getIndividualTaskStatus, getNextStep } from '../../journey-validation/task-list-generator.js'
const handlers = {
  get: async (request, h) => {
    const registrationTaskStatus = getIndividualTaskStatus(request.yar, REGISTRATIONCONSTANTS.SITE_BOUNDARY)
    const isCombinedCase = (request?._route?.path || '').startsWith('/combined-case')
    if (registrationTaskStatus !== 'COMPLETED') {
      if (isCombinedCase) {
        return h.redirect(constants.routes.COMBINED_CASE_TASK_LIST)
      } else {
        return h.redirect(constants.routes.REGISTER_LAND_TASK_LIST)
      }
    }
    return h.view(constants.views.CHECK_LAND_BOUNDARY_DETAILS, {
      ...geospatialOrLandBoundaryContext(request),
      urlPath: isCombinedCase ? '/combined-case' : '/land',
      addGridRefHref: isCombinedCase ? constants.reusedRoutes.COMBINED_CASE_ADD_GRID_REFERENCE : constants.routes.ADD_GRID_REFERENCE,
      addHectaresHref: isCombinedCase ? constants.reusedRoutes.COMBINED_CASE_ADD_HECTARES : constants.routes.ADD_HECTARES
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
