import constants from '../../utils/constants.js'
import { processCompletedRegistrationTask } from '../../utils/helpers.js'
import path from 'path'
import moment from 'moment'

const handlers = {
  get: async (request, h) => {
    const context = await getContext(request)
    return h.view(constants.views.CHECK_MANAGEMENT_MONITORING_SUMMARY, context)
  },
  post: async (request, h) => {
    processCompletedRegistrationTask(request, { taskTitle: 'Habitat information', title: 'Add habitat management and monitoring details' })
    return h.redirect(constants.routes.REGISTER_LAND_TASK_LIST)
  }
}

const getContext = async request => {
  return {
    managementFileName: getManagementFileName(request),
    habitatWorkStartDate: getFormattedDate(request.yar.get(constants.redisKeys.HABITAT_WORKS_START_DATE_KEY)),
    managementMonitoringStartDate: getFormattedDate(request.yar.get(constants.redisKeys.MANAGEMENT_MONITORING_START_DATE_KEY))
  }
}

function getManagementFileName (request) {
  const fileLocation = request.yar.get(constants.redisKeys.MANAGEMENT_PLAN_LOCATION)
  return path.parse(fileLocation).base
}

function getFormattedDate (dateString) {
  const date = moment(dateString)

  return date.toDate().toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric'
  })
}

export default [{
  method: 'GET',
  path: constants.routes.CHECK_MANAGEMENT_MONITORING_SUMMARY,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.CHECK_MANAGEMENT_MONITORING_SUMMARY,
  handler: handlers.post
}]
