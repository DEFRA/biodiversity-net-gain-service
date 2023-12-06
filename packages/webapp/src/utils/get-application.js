import constants from './constants.js'
import { postJson } from './http.js'
import Boom from '@hapi/boom'
import saveApplicationSessionIfNeeded from './save-application-session-if-needed.js'
import getApplicantContext from './get-applicant-context.js'

const getDevelopmentProject = async (request, h) => getApplication(request, h, constants.applicationTypes.ALLOCATION)

const getRegistration = async (request, h) => getApplication(request, h, constants.applicationTypes.REGISTRATION)

const getApplication = async (request, h, applicationType) => {
  if (request.params.path) {
    // Get session for values
    const { organisationId } = getApplicantContext(request.auth.credentials.account, request.yar)
    const session = await postJson(`${constants.AZURE_FUNCTION_APP_URL}/getapplicationsession`, {
      applicationReference: request.params.path,
      contactId: request.auth.credentials.account.idTokenClaims.contactId,
      organisationId,
      applicationType
    })

    if (Object.keys(session).length === 0) {
      return Boom.badRequest(`${applicationType} with reference ${request.params.path} does not exist`)
    } else {
      // Save data for the current application that hasn't been saved already
      // and reset the session before continuing.
      await saveApplicationSessionIfNeeded(request.yar, true)
      // Restore session to Yar object.
      request.yar.set(session)

      // Redirect to task list
      return h.redirect(applicationType === constants.applicationTypes.REGISTRATION ? constants.routes.REGISTER_LAND_TASK_LIST : constants.routes.DEVELOPER_TASKLIST)
    }
  } else {
    return Boom.badRequest('Application reference is missing')
  }
}

const getApplicationSession = async (request, applicationReference, contactId, applicationType) => {
  const session = await postJson(`${constants.AZURE_FUNCTION_APP_URL}/getapplicationsession`, {
    applicationReference,
    contactId,
    applicationType
  })
  request.yar.set(session)
}

export { getDevelopmentProject, getRegistration, getApplicationSession }
