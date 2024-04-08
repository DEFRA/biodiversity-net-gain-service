import {
  getProjectNameByApplicationReference,
  updateProjectName
} from './db-queries.js'
const redisKeys = {
  contactId: 'contact-id',
  applicationType: 'application-type',
  organisationId: 'organisation-id'
}

const setApplicationReference = (applicationType) => {
  const referenceMap = {
    registration: 'application-reference',
    allocation: 'developer-app-reference',
    creditspurchase: 'credits-purchase-application-reference'
  }
  return referenceMap[applicationType.toLowerCase()] || redisKeys.applicationReference
}
const prepareParams = (applicationSession) => {
  const baseParams = [
    applicationSession[redisKeys.contactId],
    applicationSession[redisKeys.applicationType],
    applicationSession[redisKeys.organisationId]
  ]
  return baseParams
}

// Helper to check and update the project name if needed
const checkAndUpdateProjectName = async (db, applicationSession, sessionProjectName) => {
  if (!sessionProjectName) {
    return
  }
  const isCreditsPurchase = applicationSession[redisKeys.applicationType] === 'CreditsPurchase'
  if (!isCreditsPurchase) {
    return
  }
  const applicationReferenceResult = await getProjectNameByApplicationReference(db, [applicationSession[redisKeys.applicationReference]])
  const projectName = applicationReferenceResult.rows[0]?.project_name
  if ((sessionProjectName || projectName) && sessionProjectName !== projectName) {
    await updateProjectName(db, [applicationSession[redisKeys.applicationReference], sessionProjectName])
  }
}

export {
  redisKeys,
  setApplicationReference,
  checkAndUpdateProjectName,
  prepareParams
}
