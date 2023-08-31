import constants from './constants.js'
import { getFormattedDate } from './helpers.js'
import { postJson } from './http.js'

const getContextForAllocations = async contactId => getContext(contactId, constants.applicationTypes.ALLOCATION)

const getContextForRegistrations = async contactId => getContext(contactId, constants.applicationTypes.REGISTRATION)

const getContext = async (contactId, applicationType) => {
  return {
    applications: await getApplications(contactId, applicationType)
  }
}

const formatApplication = application => {
  return {
    ...application,
    lastUpdated: getFormattedDate(application.lastUpdated)
  }
}

const getApplications = async (contactId, applicationType) => {
  const applications = await postJson(`${constants.AZURE_FUNCTION_APP_URL}/getapplications`, {
    contactId,
    applicationType
  })
  return applications.map(application => formatApplication(application))
}

export { getContextForAllocations, getContextForRegistrations }
