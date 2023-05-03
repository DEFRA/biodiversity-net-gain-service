// THIS is just a placeholder route the ticket hasn't come in to sprint yet so is subject to change.
import constants from '../../utils/constants.js'
import path from 'path'
import { boolToYesNo, listArray, processRegistrationTask, getAllLandowners, checkApplicantDetails } from '../../utils/helpers.js'
const handlers = {
  get: async (request, h) => {
    processRegistrationTask(request, {
      taskTitle: 'Land information',
      title: 'Add land ownership details'
    }, {
      inProgressUrl: constants.routes.CHECK_OWNERSHIP_DETAILS
    })
    const landownerNames = getAllLandowners(request.yar)
    const consent = request.yar.get(constants.redisKeys.LANDOWNER_CONSENT_KEY) === 'true'
    const hideConsent = (request.yar.get(constants.redisKeys.ROLE_KEY) === 'Landowner' && request.yar.get(constants.redisKeys.LANDOWNERS)?.length === 0)
    const fileName = getOwnershipFileName(request.yar.get(constants.redisKeys.LAND_OWNERSHIP_LOCATION))
    return h.view(constants.views.CHECK_OWNERSHIP_DETAILS, { landownerNames, consent, fileName, hideConsent, boolToYesNo, listArray })
  },
  post: async (request, h) => {
    processRegistrationTask(request, { taskTitle: 'Land information', title: 'Add land ownership details' }, { status: constants.COMPLETE_REGISTRATION_TASK_STATUS })
    return h.redirect(constants.routes.REGISTER_LAND_TASK_LIST)
  }
}

function getOwnershipFileName (fileLocation) {
  return path.parse(fileLocation).base
}

export default [{
  method: 'GET',
  path: constants.routes.CHECK_OWNERSHIP_DETAILS,
  handler: handlers.get,
  config: {
    pre: [checkApplicantDetails]
  }
}, {
  method: 'POST',
  path: constants.routes.CHECK_OWNERSHIP_DETAILS,
  handler: handlers.post
}]
