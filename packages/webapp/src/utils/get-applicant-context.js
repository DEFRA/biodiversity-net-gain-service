import constants from './constants.js'

const getApplicantContext = (account, session) => {
  const isAgent = isApplicantAnAgent(session)
  const accountInfo = account.idTokenClaims
  const currentOrganisation = accountInfo?.relationships?.find(r => r?.startsWith(accountInfo?.currentRelationshipId))?.split(':')[1]
  const currentUser = `${accountInfo.firstName} ${accountInfo.lastName}`
  // If the applicant is an agent, the individual or organisation the agent is representing has not been captured yet.
  // Similarly, no organisation is present if the applicant is representing themselves.
  const applicantDetails = !isAgent && currentOrganisation ? `${currentUser} for ${currentOrganisation}` : currentUser
  const confirmationText = `My Defra account details are up to date and I will be applying as ${applicantDetails}`
  const representing = currentOrganisation || `Myself (${applicantDetails})`
  const subject = currentOrganisation || currentUser
  const applicantContext = {
    confirmationText,
    representing,
    subject
  }

  if (!isAgent) {
    applicantContext.applicationSpecificGuidance = getApplicantSpecificGuidance(currentOrganisation)
  }

  if (currentOrganisation) {
    applicantContext.organisation = currentOrganisation
  }

  return applicantContext
}

const getApplicantSpecificGuidance = organisation => {
  let applicationSpecificGuidance
  // Just return static text from this function as organisation names need formatting in bold.
  // Even though no formatting is required for applications made by individuals representing themselves,
  // only static text is returned here in the interest of consistency.
  if (organisation) {
    applicationSpecificGuidance = ', the landowner or leaseholder you represent must be named on the legal agreement to apply.'
  } else {
    applicationSpecificGuidance = 'must be named as a landowner or leaseholder on the legal agreement to apply.'
  }
  return applicationSpecificGuidance
}
const isApplicantAnAgent = session => {
  // If a landowner type is not present in the session the user is acting as an agent.
  // Consider refactoring this logic when functionality for BNGP-3611 is available.
  const landownerType = session.get(constants.redisKeys.LANDOWNER_TYPE)
  const isLandowner = Boolean(landownerType)
  return !isLandowner
}

export default getApplicantContext
