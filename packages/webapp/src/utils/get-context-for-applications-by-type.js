import constants from './constants.js'
import { getFormattedDateTime } from './helpers.js'
import { postJson } from './http.js'

const getContextForAllocations = (contactId, organisationId) => getContext(contactId, organisationId, constants.applicationTypes.ALLOCATION)

const getContextForRegistrations = (contactId, organisationId) => getContext(contactId, organisationId, constants.applicationTypes.REGISTRATION)

const getContextForCreditsPurchase = (contactId, organisationId) => getContext(contactId, organisationId, constants.applicationTypes.CREDITS_PURCHASE)

const getContextForCombinedCase = (contactId, organisationId) => getContext(contactId, organisationId, constants.applicationTypes.COMBINED_CASE)

const getContext = async (contactId, organisationId, applicationType) => {
  return {
    applications: await getApplications(contactId, organisationId, applicationType)
  }
}

const formatApplication = application => {
  return {
    ...application,
    lastUpdated: getFormattedDateTime(application.lastUpdated)
  }
}

const getApplications = async (contactId, organisationId, applicationType) => {
  const applications = await postJson(`${constants.AZURE_FUNCTION_APP_URL}/getapplications`, {
    contactId,
    organisationId,
    applicationType
  })
  return Array.isArray(applications) && applications.map(application => formatApplication(application))
}

export {
  getContextForAllocations,
  getContextForRegistrations,
  getContextForCreditsPurchase,
  getContextForCombinedCase
}
