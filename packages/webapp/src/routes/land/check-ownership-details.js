// THIS is just a placeholder route the ticket hasn't come in to sprint yet so is subject to change.
import constants from '../../utils/constants.js'
import path from 'path'
import { boolToYesNo, processCompletedRegistrationTask } from '../../utils/helpers.js'
const handlers = {
  get: async (request, h) => {
    const name = request.yar.get(constants.redisKeys.FULL_NAME)
    const consent = request.yar.get(constants.redisKeys.LANDOWNER_CONSENT_KEY) === 'true'
    const hideConsent = (request.yar.get(constants.redisKeys.ROLE_KEY) === 'Landowner' && request.yar.get(constants.redisKeys.LANDOWNERS)?.length === 0)
    const fileName = getOwneershipFileName(request.yar.get(constants.redisKeys.LAND_OWNERSHIP_LOCATION))
    return h.view(constants.views.CHECK_OWNERSHIP_DETAILS, { name, consent, fileName, boolToYesNo, hideConsent })
  },
  post: async (request, h) => {
    processCompletedRegistrationTask(request, { taskTitle: 'Land information', title: 'Add land ownership details' })
    return h.redirect(constants.routes.REGISTER_LAND_TASK_LIST)
  }
}

function getOwneershipFileName (fileLocation) {
  return path.parse(fileLocation).base
}

export default [{
  method: 'GET',
  path: constants.routes.CHECK_OWNERSHIP_DETAILS,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.CHECK_OWNERSHIP_DETAILS,
  handler: handlers.post
}]
