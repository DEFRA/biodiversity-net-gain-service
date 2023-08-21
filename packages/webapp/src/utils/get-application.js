import constants from './constants.js'
import { postJson } from './http.js'

const getAllocation = async (request, h) => {
  return getApplication(request, h, constants.applicationTypes.ALLOCATION)
}

const getRegistration = async (request, h, config) => {
  return getApplication(request, h, constants.applicationTypes.REGISTRATION)
}

const getApplication = async (request, h, applicationType) => {
  // Get session for values
  const session = await postJson(`${constants.AZURE_FUNCTION_APP_URL}/getapplicationsession`, {
    applicationReference: request.params.path,
    contactId: request.auth.credentials.account.idTokenClaims.contactId,
    applicationType
  })

  if (Object.keys(session).length === 0) {
    return h.redirect(applicationType === constants.applicationTypes.REGISTRATION ? constants.routes.BIODIVERSITY_GAIN_SITES : constants.routes.DEVELOPER_DEVELOPMENT_PROJECTS)
  } else {
    // Restore session to Yar object
    request.yar.reset()
    request.yar.set(session)

    // Redirect to task list
    return h.redirect(applicationType === constants.applicationTypes.REGISTRATION ? constants.routes.REGISTER_LAND_TASK_LIST : constants.routes.DEVELOPER_TASKLIST)
  }
}

export { getAllocation, getRegistration }
