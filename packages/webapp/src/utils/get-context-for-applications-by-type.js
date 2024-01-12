import constants from './constants.js'
import { getFormattedDate } from './helpers.js'
import { postJson } from './http.js'

const getContextForAllocations = (contactId, organisationId) => getContext(contactId, organisationId, constants.applicationTypes.ALLOCATION)

const getContextForRegistrations = (contactId, organisationId) => getContext(contactId, organisationId, constants.applicationTypes.REGISTRATION)

const getContext = async (contactId, organisationId, applicationType) => {
  return {
    applications: await getApplications(contactId, organisationId, applicationType)
  }
}

const formatApplication = application => {
  return {
    ...application,
    lastUpdated: getFormattedDate(application.lastUpdated)
  }
}

const getApplications = async (contactId, organisationId, applicationType) => {
  const applications = await postJson(`${constants.AZURE_FUNCTION_APP_URL}/getapplications`, {
    contactId,
    organisationId,
    applicationType
  })
  return applications.map(application => formatApplication(application))
}

export { getContextForAllocations, getContextForRegistrations }
