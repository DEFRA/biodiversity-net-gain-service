import constants from './constants.js'
import creditsPurchaseConstants from './credits-purchase-constants.js'
import { postJson } from './http.js'
import Boom from '@hapi/boom'
import saveApplicationSessionIfNeeded from './save-application-session-if-needed.js'
import getOrganisationDetails from './get-organisation-details.js'

const applicationTypeRoutes = {
  [constants.applicationTypes.REGISTRATION]: constants.routes.REGISTER_LAND_TASK_LIST,
  [constants.applicationTypes.ALLOCATION]: constants.routes.DEVELOPER_TASKLIST,
  [constants.applicationTypes.CREDITS_PURCHASE]: creditsPurchaseConstants.routes.CREDITS_PURCHASE_TASK_LIST,
  [constants.applicationTypes.COMBINED_CASE]: constants.routes.COMBINED_CASE_TASK_LIST
}

const getDevelopmentProject = async (request, h) => getApplication(request, h, constants.applicationTypes.ALLOCATION)

const getRegistration = async (request, h) => getApplication(request, h, constants.applicationTypes.REGISTRATION)

const getCreditsPurchase = async (request, h) => getApplication(request, h, constants.applicationTypes.CREDITS_PURCHASE)

const getCombinedCase = async (request, h) => getApplication(request, h, constants.applicationTypes.COMBINED_CASE)

const getApplication = async (request, h, applicationType) => {
  if (request.params.path) {
    // Get session for values
    const { currentOrganisationId: organisationId } = getOrganisationDetails(request.auth.credentials.account.idTokenClaims)
    const session = await getSession(
      request.params.path,
      request.auth.credentials.account.idTokenClaims.contactId,
      applicationType
    )

    if (Object.keys(session).length === 0) {
      return noSession(request, h, applicationType)
    } else if (session['organisation-id'] !== organisationId) {
      return orgError(request, h, applicationType)
    } else {
      // Save data for the current application that hasn't been saved already
      // and reset the session before continuing.
      await saveApplicationSessionIfNeeded(request.yar, true)
      // Delete any value of JOURNEY_START_ANSWER_ID as this is not relevant when reloading an application
      delete session[constants.redisKeys.JOURNEY_START_ANSWER_ID]
      // Restore session to Yar object.
      request.yar.set(session)

      // Redirect to task list or dashboard if unknown applicationType
      const route = applicationTypeRoutes[applicationType]
      if (route) {
        return h.redirect(route)
      }

      return h.redirect('/')
    }
  } else {
    return Boom.badRequest('Application reference is missing')
  }
}

const noSession = (request, h, applicationType) => {
  if (applicationType === constants.applicationTypes.REGISTRATION) {
    return h.redirect(constants.routes.CANNOT_VIEW_APPLICATION)
  } else {
    return Boom.badRequest(`${applicationType} with reference ${request.params.path} does not exist`)
  }
}

const orgError = (request, h, applicationType) => {
  if (applicationType === constants.applicationTypes.REGISTRATION) {
    return h.redirect(`${constants.routes.CANNOT_VIEW_APPLICATION}?orgError=true`)
  } else {
    return Boom.badRequest(`${applicationType} with reference ${request.params.path} does not exist`)
  }
}

const getApplicationSession = async (request, applicationReference, contactId, applicationType) => {
  const session = await getSession(applicationReference, contactId, applicationType)
  request.yar.set(session)
}

const getSession = (applicationReference, contactId, applicationType) => {
  return postJson(`${constants.AZURE_FUNCTION_APP_URL}/getapplicationsession`, {
    applicationReference,
    contactId,
    applicationType
  })
}

export {
  getDevelopmentProject,
  getRegistration,
  getCreditsPurchase,
  getApplicationSession,
  getCombinedCase,
  getApplication
}
