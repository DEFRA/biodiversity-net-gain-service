import developerApplication from '../../utils/developer-application.js'
import developerApplicationValidation from '../../utils/developer-application-validation.js'
import { postJson } from '../../utils/http.js'
import constants from '../../utils/constants.js'
import getOrganisationDetails from '../../utils/get-organisation-details.js'
import { getTaskList } from '../../journey-validation/task-list-generator.js'
import getApplicationDetails from '../../utils/get-developer-check-and-submit-details.js'

const handlers = {
  get: (request, h) => {
    const appSubmitted = request.yar.get(constants.redisKeys.DEVELOPER_APPLICATION_SUBMITTED)

    if (appSubmitted) {
      return h.redirect(constants.routes.MANAGE_BIODIVERSITY_GAINS)
    }

    const { canSubmit } = getTaskList(constants.applicationTypes.ALLOCATION, request.yar)

    if (!canSubmit) {
      return h.redirect(constants.routes.DEVELOPER_TASKLIST)
    }

    const claims = request.auth.credentials.account.idTokenClaims
    const { currentOrganisation } = getOrganisationDetails(claims)

    return h.view(constants.views.DEVELOPER_CHECK_AND_SUBMIT, {
      ...getApplicationDetails(request, request.yar, currentOrganisation),
      backLink: constants.routes.DEVELOPER_TASKLIST
    })
  },
  post: async (request, h) => {
    if (request.payload.termsAndConditionsConfirmed !== 'Yes') {
      const err = [{
        text: 'You must confirm you have read the terms and conditions',
        href: '#termsAndConditionsConfirmed'
      }]
      return h.view(constants.views.DEVELOPER_CHECK_AND_SUBMIT, { ...getApplicationDetails(request, request.yar, request.auth.credentials.account), err })
    }

    const { value, error } = developerApplicationValidation.validate(developerApplication(request.yar, request.auth.credentials.account))
    if (error) {
      throw new Error(error)
    }

    const result = await postJson(`${constants.AZURE_FUNCTION_APP_URL}/processdeveloperapplication`, value)
    request.yar.set(constants.redisKeys.DEVELOPER_APP_REFERENCE, result.allocationReference)
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
