import constants from './constants.js'
import saveApplicationSessionIfNeeded from './save-application-session-if-needed.js'

const newDevelopmentProject = async (request, h) => newApplication(request, h, constants.applicationTypes.ALLOCATION)

const newRegistration = async (request, h) => {
  return newApplication(request, h, constants.applicationTypes.REGISTRATION)
}

const newApplication = async (request, h, applicationType) => {
  await saveApplicationSessionIfNeeded(request.yar, true)
  request.yar.set(constants.redisKeys.APPLICATION_TYPE, applicationType)
  return h.redirect(applicationType === constants.applicationTypes.REGISTRATION ? constants.routes.REGISTER_LAND_TASK_LIST : constants.routes.DEVELOPER_TASKLIST)
}

export { newDevelopmentProject, newRegistration }
