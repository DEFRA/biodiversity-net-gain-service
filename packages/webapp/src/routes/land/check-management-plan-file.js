import constants from '../../utils/constants.js'
import path from 'path'
import { blobStorageConnector } from '@defra/bng-connectors-lib'
import { processRegistrationTask } from '../../utils/helpers.js'

const handlers = {
  get: async (request, h) => {
    processRegistrationTask(request, {
      taskTitle: 'Habitat information',
      title: 'Add habitat management and monitoring details'
    }, {
      inProgressUrl: constants.routes.CHECK_MANAGEMENT_PLAN
    })
    return h.view(constants.views.CHECK_MANAGEMENT_PLAN, getContext(request))
  },
  post: async (request, h) => {
    const checkManagementPlan = request.payload.checkManagementPlan
    const managementPlanLocation = request.yar.get(constants.redisKeys.MANAGEMENT_PLAN_LOCATION)
    request.yar.set(constants.redisKeys.MANAGEMENT_PLAN_CHECKED, checkManagementPlan)
    if (checkManagementPlan === 'no') {
      // delete the file from blob storage
      const config = {
        containerName: 'trusted',
        blobName: managementPlanLocation
      }
      await blobStorageConnector.deleteBlobIfExists(config)
      request.yar.clear(constants.redisKeys.MANAGEMENT_PLAN_LOCATION)
      return h.redirect(constants.routes.UPLOAD_MANAGEMENT_PLAN)
    } else if (checkManagementPlan === 'yes') {
      return h.redirect(request.yar.get(constants.redisKeys.REFERER, true) || constants.routes.HABITAT_WORKS_START_DATE)
    } else {
      return h.view(constants.views.CHECK_MANAGEMENT_PLAN, {
        ...getContext(request),
        err: [{
          text: 'Select yes if this is the correct file',
          href: '#check-upload-correct-yes'
        }]
      })
    }
  }
}

const getContext = request => {
  const fileLocation = request.yar.get(constants.redisKeys.MANAGEMENT_PLAN_LOCATION)
  return {
    filename: fileLocation === null ? '' : path.parse(fileLocation).base,
    fileSize: request.yar.get(constants.redisKeys.MANAGEMENT_PLAN_FILE_SIZE),
    fileLocation
  }
}

export default [{
  method: 'GET',
  path: constants.routes.CHECK_MANAGEMENT_PLAN,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.CHECK_MANAGEMENT_PLAN,
  handler: handlers.post
}]
