import constants from './constants.js'
import { extractAllocationHabitatsByGainSiteNumber, initialCapitalization } from './helpers.js'
import path from 'path'
import getApplicantContext from './get-applicant-context.js'

const formatHabitatDetails = (habitatDetails) => {
  const allHabitats = []
  habitatDetails.forEach(h => {
    const unit = h.unit.substring(h.unit.indexOf('(') + 1, h.unit.indexOf(')'))
    h.items.forEach(r => {
      r.amount = `${r.amount} ${unit}`
      allHabitats.push(r)
    })
  })
  return allHabitats
}

const getClientTypeNameisLandowner = (clientType) => {
  let clientTypeNameisLandowner
  if (clientType) {
    if (clientType === constants.individualOrOrganisationTypes.INDIVIDUAL) {
      clientTypeNameisLandowner = 'Individual landowner or leaseholder'
    } else {
      clientTypeNameisLandowner = initialCapitalization(clientType)
    }
  } else {
    clientTypeNameisLandowner = null
  }
  return clientTypeNameisLandowner
}

const getClientsNameLabel = (clientType) => {
  let clientsNameLabel = 'Client\'s name'
  if (clientType && (clientType === constants.individualOrOrganisationTypes.ORGANISATION)) {
    clientsNameLabel = 'Client\'s organisation name'
  }
  return clientsNameLabel
}

const getClientsName = (clientType, session) => {
  if (!clientType) return ''

  if (clientType === constants.individualOrOrganisationTypes.INDIVIDUAL) {
    const developerClientsName = session.get(constants.redisKeys.DEVELOPER_CLIENTS_NAME)?.value
    if (developerClientsName) {
      const { firstName, lastName } = developerClientsName
      if (firstName && lastName) {
        return `${firstName} ${lastName}`
      }
    }
    return ''
  }

  return session.get(constants.redisKeys.DEVELOPER_CLIENTS_ORGANISATION_NAME) || ''
}

const getClientsNameChangeUrl = (clientType) => {
  return clientType === constants.individualOrOrganisationTypes.INDIVIDUAL
    ? constants.routes.DEVELOPER_CLIENTS_NAME
    : constants.routes.DEVELOPER_CLIENTS_ORGANISATION_NAME
}

const getApplicationDetails = (request, session, currentOrganisation) => {
  const isCombinedCase = (request?._route?.path || '').startsWith('/combined-case')
  const metricData = session.get(constants.redisKeys.DEVELOPER_METRIC_DATA)
  const gainSiteNumber = session.get(constants.redisKeys.BIODIVERSITY_NET_GAIN_NUMBER)
  const habitatDetails = extractAllocationHabitatsByGainSiteNumber(metricData, gainSiteNumber)
  const allHabitats = formatHabitatDetails(habitatDetails)
  const habitats = (allHabitats || []).map(item => {
    return [
      {
        classes: 'govuk-body-s govuk-!-display-block govuk-!-margin-top-0 govuk-!-margin-bottom-0',
        value: item?.header
      },
      {
        classes: 'govuk-body-m govuk-!-display-block govuk-!-margin-top-0 govuk-!-margin-bottom-0',
        value: item?.description
      },
      {
        classes: 'govuk-body-s govuk-!-display-block govuk-!-margin-top-0 govuk-!-margin-bottom-0 app-secondary-text-colour',
        value: item?.condition
      },
      {
        classes: false,
        value: item?.amount
      }
    ]
  })

  const developerIsAgent = session.get(constants.redisKeys.DEVELOPER_IS_AGENT) === constants.APPLICANT_IS_AGENT.YES
  const developerIsLandowner = session.get(constants.redisKeys.DEVELOPER_LANDOWNER_OR_LEASEHOLDER) === constants.DEVELOPER_IS_LANDOWNER_OR_LEASEHOLDER.YES
  const fileLocation = session.get(constants.redisKeys.DEVELOPER_PLANNING_DECISION_NOTICE_LOCATION)
  const planningDecisionNoticeFileName = fileLocation === null ? '' : path.parse(fileLocation).base
  const clientType = developerIsAgent
    ? session.get(constants.redisKeys.DEVELOPER_CLIENT_INDIVIDUAL_ORGANISATION)
    : session.get(constants.redisKeys.DEVELOPER_LANDOWNER_TYPE)
  const clientTypeNameisAgent = clientType ? initialCapitalization(clientType) : null
  const clientTypeNameisLandowner = getClientTypeNameisLandowner(clientType)
  const { subject } = getApplicantContext(request.auth.credentials.account, session)
  const clientsNameLabel = getClientsNameLabel(clientType)
  const clientsName = getClientsName(clientType, session)
  const clientsNameChangeUrl = getClientsNameChangeUrl(clientType)
  const matchedHabitatItems = (request.yar.get(constants.redisKeys.COMBINED_CASE_ALLOCATION_HABITATS_PROCESSING) || []).map(item => {
    return [
      {
        classes: 'govuk-body-s govuk-!-display-block govuk-!-margin-top-0 govuk-!-margin-bottom-0',
        value: item?.state
      },
      {
        classes: 'govuk-body-m govuk-!-display-block govuk-!-margin-top-0 govuk-!-margin-bottom-0',
        value: item?.habitatType
      },
      {
        classes: 'govuk-body-s govuk-!-display-block govuk-!-margin-top-0 govuk-!-margin-bottom-0 app-secondary-text-colour',
        value: item?.condition
      },
      {
        classes: false,
        value: `${item?.size} ${item?.measurementUnits}`
      }
    ]
  })

  return {
    applicantInfo: {
      actingForClient: developerIsAgent ? 'Yes' : 'No',
      actingForClientChangeUrl: constants.routes.DEVELOPER_AGENT_ACTING_FOR_CLIENT,
      confirmed: session.get(constants.redisKeys.DEVELOPER_DEFRA_ACCOUNT_DETAILS_CONFIRMED),
      confirmedChangeUrl: constants.routes.DEVELOPER_CHECK_DEFRA_ACCOUNT_DETAILS,
      accountDetails: session.get(constants.redisKeys.DEVELOPER_DEFRA_ACCOUNT_DETAILS_CONFIRMED) ? `Yes, apply as ${subject}` : 'No',
      landownerOrLeaseHolderTitle: developerIsAgent ? 'Client is a landowner or leaseholder' : 'Applying as landowner or leaseholder',
      landownerOrLeaseholder: developerIsLandowner ? 'Yes' : 'No',
      landownerOrLeaseholderChangeUrl: constants.routes.DEVELOPER_LANDOWNER_OR_LEASEHOLDER,
      clientTypeTitle: developerIsAgent ? 'Client is an individual or organisation' : 'Applying as individual or organisation',
      clientType: developerIsAgent ? clientTypeNameisAgent : clientTypeNameisLandowner,
      clientTypeChangeUrl: developerIsAgent ? constants.routes.DEVELOPER_CLIENT_INDIVIDUAL_ORGANISATION : constants.routes.DEVELOPER_APPLICATION_BY_INDIVIDUAL_OR_ORGANISATION,
      clientsNameLabel,
      clientsName,
      clientsNameChangeUrl,
      showClientsName: developerIsAgent,
      writtenAuthorisation: session.get(constants.redisKeys.DEVELOPER_WRITTEN_AUTHORISATION_FILE_NAME),
      writtenAuthorisationChangeUrl: constants.routes.DEVELOPER_CHECK_WRITTEN_AUTHORISATION_FILE,
      showWrittenAuth: developerIsAgent,
      landownerConsent: session.get(constants.redisKeys.DEVELOPER_CONSENT_TO_USE_GAIN_SITE_FILE_NAME),
      landownerConsentChangeUrl: constants.routes.DEVELOPER_CHECK_CONSENT_TO_USE_GAIN_SITE_FILE,
      showLandownerConsent: !developerIsLandowner,
      showDefraAccountAgent: developerIsAgent,
      showDefraAccount: !developerIsAgent
    },
    developmentInfo: {
      planningDecisionNoticeFile: planningDecisionNoticeFileName,
      planningDecisionNoticeFileChangeUrl: isCombinedCase ? constants.reusedRoutes.COMBINED_CASE_CHECK_PLANNING_DECISION_NOTICE_FILE : constants.routes.DEVELOPER_CHECK_PLANNING_DECISION_NOTICE_FILE,
      metricFileName: session.get(constants.redisKeys.DEVELOPER_METRIC_FILE_NAME),
      metricFileNameUrl: isCombinedCase ? constants.reusedRoutes.COMBINED_CASE_CHECK_UPLOAD_METRIC : constants.routes.DEVELOPER_CHECK_UPLOAD_METRIC,
      bngNumber: gainSiteNumber,
      bngNumberChangeUrl: constants.routes.DEVELOPER_BNG_NUMBER,
      projectName: session.get(constants.redisKeys.DEVELOPER_DEVELOPMENT_NAME),
      projectNameChangeUrl: isCombinedCase ? constants.reusedRoutes.COMBINED_CASE_DEVELOPMENT_PROJECT_INFORMATION : constants.routes.DEVELOPER_DEVELOPMENT_PROJECT_INFORMATION,
      localAuthority: session.get(constants.redisKeys.DEVELOPER_PLANNING_AUTHORITY_LIST),
      localAuthorityChangeUrl: isCombinedCase ? constants.reusedRoutes.COMBINED_CASE_DEVELOPMENT_PROJECT_INFORMATION :constants.routes.DEVELOPER_DEVELOPMENT_PROJECT_INFORMATION,
      planningRef: session.get(constants.redisKeys.DEVELOPER_PLANNING_APPLICATION_REF),
      planningRefChangeUrl: isCombinedCase ? constants.reusedRoutes.COMBINED_CASE_DEVELOPMENT_PROJECT_INFORMATION : constants.routes.DEVELOPER_DEVELOPMENT_PROJECT_INFORMATION,
      habitats,
      matchedHabitatItems,
      matchHabitatsChangeUrl: constants.routes.COMBINED_CASE_MATCH_HABITATS
    }
  }
}

export default getApplicationDetails
