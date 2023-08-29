import constants from '../../utils/constants.js'
import { processRegistrationTask, getFormattedDate, checkApplicantDetails } from '../../utils/helpers.js'
import path from 'path'

const handlers = {
  get: async (request, h) => {
    processRegistrationTask(request, {
      taskTitle: 'Habitat information',
      title: 'Add habitat management and monitoring details'
    }, {
      inProgressUrl: constants.routes.CHECK_MANAGEMENT_MONITORING_DETAILS
    })
    return h.view(constants.views.CHECK_MANAGEMENT_MONITORING_DETAILS, getContext(request))
  },
  post: async (request, h) => {
    processRegistrationTask(request, {
      taskTitle: 'Habitat information',
      title: 'Add habitat management and monitoring details'
    }, {
      status: constants.COMPLETE_REGISTRATION_TASK_STATUS
    })
    return h.redirect(constants.routes.REGISTER_LAND_TASK_LIST)
  }
}

const getContext = request => {
  return {
    managementFileName: getManagementFileName(request),
    managementMonitoringStartDate: getFormattedDate(request.yar.get(constants.redisKeys.MANAGEMENT_MONITORING_START_DATE_KEY))
  }
}

function getManagementFileName (request) {
  const fileLocation = request.yar.get(constants.redisKeys.MANAGEMENT_PLAN_LOCATION)
  return path.parse(fileLocation).base
}

export default [{
  method: 'GET',
  path: constants.routes.CHECK_MANAGEMENT_MONITORING_DETAILS,
  handler: handlers.get,
  config: {
    pre: [checkApplicantDetails]
  }
}, {
  method: 'POST',
  path: constants.routes.CHECK_MANAGEMENT_MONITORING_DETAILS,
  handler: handlers.post
}]
