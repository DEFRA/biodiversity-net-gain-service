import constants from './constants.js'
import { getFormattedDate } from './helpers.js'
import { postJson } from './http.js'

const getContextForAllocations = async request => getContext(request, constants.applicationTypes.ALLOCATION)

const getContextForRegistrations = async request => getContext(request, constants.applicationTypes.REGISTRATION)

const getContext = async (request, applicationType) => {
  const contactId = request.auth.credentials.account.idTokenClaims.contactId
  return {
    applications: await getApplications(contactId, applicationType)
  }
}

const formatApplication = application => {
  application.lastUpdated = getFormattedDate(application.lastUpdated)
}

const getApplications = async (contactId, applicationType) => {
  const applications = await postJson(`${constants.AZURE_FUNCTION_APP_URL}/getapplications`, {
    contactId,
    applicationType
  })

  applications.map(application => formatApplication(application))
  return applications
}

export { getContextForAllocations, getContextForRegistrations }
