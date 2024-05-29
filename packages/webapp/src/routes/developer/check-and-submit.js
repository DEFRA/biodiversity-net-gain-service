import developerApplication from '../../utils/developer-application.js'
import developerApplicationValidation from '../../utils/developer-application-validation.js'
import { postJson } from '../../utils/http.js'
import constants from '../../utils/constants.js'
import getOrganisationDetails from '../../utils/get-organisation-details.js'
import {
  extractAllocationHabitatsByGainSiteNumber,
  initialCapitalization
} from '../../utils/helpers.js'
import path from 'path'
import { getTaskList } from '../../journey-validation/task-list-generator.js'

const getApplicationDetails = (session, currentOrganisation) => {
  const metricData = session.get(constants.redisKeys.DEVELOPER_METRIC_DATA)
  const gainSiteNumber = session.get(constants.redisKeys.BIODIVERSITY_NET_GAIN_NUMBER)
  const allHabitats = []
  const habitatDetails = extractAllocationHabitatsByGainSiteNumber(metricData, gainSiteNumber)
  habitatDetails.forEach(h => {
    const unit = h.unit.substring(h.unit.indexOf('(') + 1, h.unit.indexOf(')'))
    h.items.forEach(r => {
      r.amount = `${r.amount} ${unit}`
      allHabitats.push(r)
    })
  })
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
  const clientsName = session.get(constants.redisKeys.DEVELOPER_CLIENTS_NAME)?.value
  return {
    applicantInfo: {
      actingForClient: developerIsAgent ? 'Yes' : 'No',
      actingForClientChangeUrl: constants.routes.DEVELOPER_AGENT_ACTING_FOR_CLIENT,
      confirmed: session.get(constants.redisKeys.DEVELOPER_DEFRA_ACCOUNT_DETAILS_CONFIRMED),
      confirmedChangeUrl: constants.routes.DEVELOPER_CHECK_DEFRA_ACCOUNT_DETAILS,
      landownerOrLeaseholder: developerIsLandowner ? 'Yes' : 'No',
      landownerOrLeaseholderChangeUrl: constants.routes.DEVELOPER_LANDOWNER_OR_LEASEHOLDER,
      clientType: clientType ? initialCapitalization(clientType) : null,
      clientTypeChangeUrl: developerIsAgent ? constants.routes.DEVELOPER_CLIENT_INDIVIDUAL_ORGANISATION : constants.routes.DEVELOPER_APPLICATION_BY_INDIVIDUAL_OR_ORGANISATION,
      clientsName: clientsName ? `${clientsName?.firstName} ${clientsName?.lastName}` : '',
      clientsNameChangeUrl: constants.routes.DEVELOPER_CLIENTS_NAME,
      writtenAuthorisation: session.get(constants.redisKeys.DEVELOPER_WRITTEN_AUTHORISATION_FILE_NAME),
      writtenAuthorisationChangeUrl: constants.routes.DEVELOPER_CHECK_WRITTEN_AUTHORISATION_FILE,
      showWrittenAuth: developerIsAgent,
      landownerConsent: session.get(constants.redisKeys.DEVELOPER_CONSENT_TO_USE_GAIN_SITE_FILE_NAME),
      landownerConsentChangeUrl: constants.routes.DEVELOPER_CHECK_CONSENT_TO_USE_GAIN_SITE_FILE,
      showLandownerConsent: !developerIsLandowner
    },
    developmentInfo: {
      planningDecisionNoticeFile: planningDecisionNoticeFileName,
      planningDecisionNoticeFileChangeUrl: constants.routes.DEVELOPER_CHECK_PLANNING_DECISION_NOTICE_FILE,
      metricFileName: session.get(constants.redisKeys.DEVELOPER_METRIC_FILE_NAME),
      metricFileNameUrl: constants.routes.DEVELOPER_CHECK_UPLOAD_METRIC,
      bngNumber: gainSiteNumber,
      bngNumberChangeUrl: constants.routes.DEVELOPER_BNG_NUMBER,
      projectName: session.get(constants.redisKeys.DEVELOPER_DEVELOPMENT_NAME),
      projectNameChangeUrl: constants.routes.DEVELOPER_DEVELOPMENT_PROJECT_INFORMATION,
      localAuthority: session.get(constants.redisKeys.DEVELOPER_PLANNING_AUTHORITY_LIST),
      localAuthorityChangeUrl: constants.routes.DEVELOPER_DEVELOPMENT_PROJECT_INFORMATION,
      planningRef: session.get(constants.redisKeys.DEVELOPER_PLANNING_APPLICATION_REF),
      planningRefChangeUrl: constants.routes.DEVELOPER_DEVELOPMENT_PROJECT_INFORMATION,
      habitats
    }
  }
}

const handlers = {
  get: (request, h) => {
    const { canSubmit } = getTaskList(constants.applicationTypes.ALLOCATION, request.yar)

    if (!canSubmit) {
      return h.redirect(constants.routes.DEVELOPER_TASKLIST)
    }

    const claims = request.auth.credentials.account.idTokenClaims
    const { currentOrganisation } = getOrganisationDetails(claims)

    return h.view(constants.views.DEVELOPER_CHECK_AND_SUBMIT, {
      ...getApplicationDetails(request.yar, currentOrganisation),
      backLink: constants.routes.DEVELOPER_TASKLIST
    })
  },
  post: async (request, h) => {
    const { value, error } = developerApplicationValidation.validate(developerApplication(request.yar, request.auth.credentials.account))
    if (error) {
      throw new Error(error)
    }

    const result = await postJson(`${constants.AZURE_FUNCTION_APP_URL}/processdeveloperapplication`, value)
    request.yar.set(constants.redisKeys.DEVELOPER_APP_REFERENCE, result.gainSiteReference)
    return h.redirect(constants.routes.DEVELOPER_CONFIRMATION)
  }
}

export default [
  {
    method: 'GET',
    path: constants.routes.DEVELOPER_CHECK_AND_SUBMIT,
    handler: handlers.get
  },
  {
    method: 'POST',
    path: constants.routes.DEVELOPER_CHECK_AND_SUBMIT,
    handler: handlers.post
  }
]
