import developerApplication from '../../utils/developer-application.js'
import developerApplicationValidation from '../../utils/developer-application-validation.js'
import { postJson } from '../../utils/http.js'
import constants from '../../utils/constants.js'
import getOrganisationDetails from '../../utils/get-organisation-details.js'
import {
  habitatTypeAndConditionMapper
} from '../../utils/helpers.js'
import path from 'path'

const getApplicationDetails = (session, currentOrganisation) => {
  const metricData = session.get(constants.redisKeys.DEVELOPER_METRIC_DATA)
  const habitat = habitatTypeAndConditionMapper(['d1'], metricData)
  const habitats = (habitat[0]?.items || []).map(item => {
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
  const fileLocation = session.get(constants.redisKeys.DEVELOPER_PLANNING_DECISION_NOTICE_LOCATION)
  const planningDecisionNoticeFileName = fileLocation === null ? '' : path.parse(fileLocation).base

  return {
    applicantInfo: {
      actingForClient: session.get(constants.redisKeys.DEVELOPER_IS_AGENT),
      actingForClientChangeUrl: constants.routes.DEVELOPER_AGENT_ACTING_FOR_CLIENT,
      confirmed: session.get(constants.redisKeys.DEVELOPER_DEFRA_ACCOUNT_DETAILS_CONFIRMED),
      confirmedChangeUrl: constants.routes.DEVELOPER_CHECK_DEFRA_ACCOUNT_DETAILS
    },
    developmentInfo: {
      planningDecisionNoticeFile: planningDecisionNoticeFileName,
      planningDecisionNoticeFileChangeUrl: constants.routes.DEVELOPER_UPLOAD_PLANNING_DECISION_NOTICE,
      metricFileName: session.get(constants.redisKeys.DEVELOPER_METRIC_FILE_NAME),
      metricFileNameUrl: constants.routes.DEVELOPER_UPLOAD_METRIC,
      bngNumber: session.get(constants.redisKeys.BIODIVERSITY_NET_GAIN_NUMBER),
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