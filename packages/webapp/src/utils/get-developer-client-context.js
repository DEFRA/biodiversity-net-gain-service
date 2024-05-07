import constants from './constants.js'

const getDeveloperClientContext = session => {
  const isIndividualOrOrganisation = session.get(constants.cacheKeys.DEVELOPER_CLIENT_INDIVIDUAL_ORGANISATION)
  const clientsName = session.get(constants.cacheKeys.DEVELOPER_CLIENTS_NAME)
  const clientsOrganisationName = session.get(constants.cacheKeys.DEVELOPER_CLIENTS_ORGANISATION_NAME)
  const isIndividual = isIndividualOrOrganisation === constants.individualOrOrganisationTypes.INDIVIDUAL

  const context = {
    isIndividual,
    clientsName,
    clientsOrganisationName
  }

  return context
}

export default getDeveloperClientContext
