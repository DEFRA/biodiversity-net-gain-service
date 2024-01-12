import constants from './constants.js'

const getOrganisationDetails = claims => {
  const currentRelationshipDetails = claims?.relationships?.find(r => r?.toLowerCase()?.startsWith(claims?.currentRelationshipId?.toLowerCase()))?.split(':')
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

export default getOrganisationDetails
