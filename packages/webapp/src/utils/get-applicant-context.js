import constants from './constants.js'

const getApplicantContext = (account, session) => {
  const isAgent = isApplicantAnAgent(session)
  const claims = account.idTokenClaims
  const { noOrganisationsLinkedToDefraAccount, currentOrganisationId, currentOrganisation } = getOrganisationDetails(claims)
  const currentUser = `${claims.firstName} ${claims.lastName}`
  // If the applicant is an agent, the individual or organisation the agent is representing has not been captured yet.
  // Similarly, no organisation is present if the applicant is representing themselves.
  const applicantDetails = !isAgent && currentOrganisation ? `${currentUser} for ${currentOrganisation}` : currentUser
  const confirmationText = `My Defra account details are up to date and I will be applying as ${applicantDetails}`
  const representing = currentOrganisation || `Myself (${applicantDetails})`
  const subject = currentOrganisation || currentUser
  const applicantContext = {
    confirmationText,
    noOrganisationsLinkedToDefraAccount,
    representing,
    subject
  }

  if (!isAgent) {
    applicantContext.applicationSpecificGuidance = getApplicantSpecificGuidance(currentOrganisation)
  }

  if (currentOrganisationId) {
    applicantContext.organisationId = currentOrganisationId
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
  const isAgent = session.get(constants.redisKeys.IS_AGENT)
  return isAgent === constants.APPLICANT_IS_AGENT.YES
}

const getOrganisationDetails = claims => {
  const currentRelationshipDetails = claims?.relationships?.find(r => r?.startsWith(claims?.currentRelationshipId))?.split(':')
  const currentOrganisationId = currentRelationshipDetails[1]
  const currentOrganisation = currentRelationshipDetails[2]
  const enrolmentCount = claims.enrolmentCount
  const signInType = currentRelationshipDetails[4]

  // If the user has not signed in as an employee of an organisation and has only one enrolment then no organisations are
  // associated with their Defra account.
  const noOrganisationsLinkedToDefraAccount = signInType !== constants.signInTypes.EMPLOYEE && enrolmentCount === 1

  const organisationDetails = {
    noOrganisationsLinkedToDefraAccount
  }

  if (currentOrganisationId) {
    organisationDetails.currentOrganisationId = currentOrganisationId
  }

  if (currentOrganisation) {
    organisationDetails.currentOrganisation = currentOrganisation
  }

  return organisationDetails
}

export default getApplicantContext
