import constants from '../../utils/constants.js'
import { getTaskList } from '../../journey-validation/task-list-generator.js'
import application from '../../utils/combined-case-application.js'
import getRegistrationDetails from '../../utils/get-land-check-and-submit-details.js'
import getDeveloperDetails from '../../utils/get-developer-check-and-submit-details.js'
import combinedCaseApplicationValidation from '../../utils/combined-case-application-validation.js'
import { postJson } from '../../utils/http.js'
import getOrganisationDetails from '../../utils/get-organisation-details.js'
import { getMatchedHabitatsHtml } from '../../utils/combined-case/helpers.js'

const handlers = {
  get: (request, h) => {
    const appSubmitted = request.yar.get(constants.redisKeys.COMBINED_CASE_APPLICATION_SUBMITTED)

    if (appSubmitted) {
      return h.redirect(constants.routes.MANAGE_BIODIVERSITY_GAINS)
    }

    const { canSubmit } = getTaskList(constants.applicationTypes.COMBINED_CASE, request.yar)

    if (!canSubmit) {
      return h.redirect(constants.routes.COMBINED_CASE_TASK_LIST)
    }

    request.yar.set(constants.redisKeys.CHECK_AND_SUBMIT_JOURNEY_ROUTE, constants.routes.COMBINED_CASE_CHECK_AND_SUBMIT)

    const applicationDetails = application(request.yar, request.auth.credentials.account).combinedCase
    const claims = request.auth.credentials.account.idTokenClaims
    const { currentOrganisation } = getOrganisationDetails(claims)
    const matchedHabitats = getMatchedHabitatsHtml(request.yar.get(constants.redisKeys.COMBINED_CASE_ALLOCATION_HABITATS_PROCESSING))

    return h.view(
      constants.views.COMBINED_CASE_CHECK_AND_SUBMIT,
      {
        ...getRegistrationDetails(request, applicationDetails),
        ...getDeveloperDetails(request, request.yar, currentOrganisation),
        matchedHabitats
      }
    )
  },
  post: async (request, h) => {
    const combinedCaseApplication = application(request.yar, request.auth.credentials.account)
    const applicationDetails = combinedCaseApplication.combinedCase

    if (request.payload.termsAndConditionsConfirmed !== 'Yes') {
      const claims = request.auth.credentials.account.idTokenClaims
      const { currentOrganisation } = getOrganisationDetails(claims)
      const matchedHabitats = getMatchedHabitatsHtml(request.yar.get(constants.redisKeys.COMBINED_CASE_ALLOCATION_HABITATS_PROCESSING))
      const err = [{
        text: 'You must confirm you have read the terms and conditions',
        href: '#termsAndConditionsConfirmed'
      }]
      return h.view(constants.views.COMBINED_CASE_CHECK_AND_SUBMIT,
        {
          ...getRegistrationDetails(request, applicationDetails),
          ...getDeveloperDetails(request, request.yar, currentOrganisation),
          matchedHabitats,
          err
        })
    }

    const { value, error } = combinedCaseApplicationValidation.validate(combinedCaseApplication)
    if (error) {
      throw new Error(error)
    }

    const result = await postJson(`${constants.AZURE_FUNCTION_APP_URL}/processcombinedcaseapplication`, value)
    request.yar.set(constants.redisKeys.COMBINED_CASE_APPLICATION_REFERENCE, result.applicationReference)
    return h.redirect(constants.routes.COMBINED_CASE_CONFIRMATION)
  }
}

export default [
  {
    method: 'GET',
    path: constants.routes.COMBINED_CASE_CHECK_AND_SUBMIT,
    handler: handlers.get
  },
  {
    method: 'POST',
    path: constants.routes.COMBINED_CASE_CHECK_AND_SUBMIT,
    handler: handlers.post
  }
]
