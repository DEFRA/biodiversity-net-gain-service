import constants from '../../utils/constants.js'
import { getTaskList } from '../../journey-validation/task-list-generator.js'
import application from '../../utils/combined-case-application.js'
import getRegistrationDetails from '../../utils/get-land-check-and-submit-details.js'
import combinedCaseApplicationValidation from '../../utils/combined-case-application-validation.js'
import { postJson } from '../../utils/http.js'

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

    const applicationDetails = application(request.yar, request.auth.credentials.account).combinedCase
    console.log(JSON.stringify(applicationDetails, null, 2))

    return h.view(constants.views.COMBINED_CASE_CHECK_AND_SUBMIT, getRegistrationDetails(request, applicationDetails))
  },
  post: async (request, h) => {
    const combinedCaseApplication = application(request.yar, request.auth.credentials.account)
    const applicationDetails = combinedCaseApplication.combinedCase

    if (request.payload.termsAndConditionsConfirmed !== 'Yes') {
      const err = [{
        text: 'You must confirm you have read the terms and conditions',
        href: '#termsAndConditionsConfirmed'
      }]
      return h.view(constants.views.COMBINED_CASE_CHECK_AND_SUBMIT, { ...getRegistrationDetails(request, applicationDetails), err })
    }

    const { value, error } = combinedCaseApplicationValidation.validate(combinedCaseApplication)
    if (error) {
      throw new Error(error)
    }

    const result = await postJson(`${constants.AZURE_FUNCTION_APP_URL}/processcombinedcaseapplication`, value)
    request.yar.set(constants.redisKeys.COMBINED_CASE_APPLICATION_REFERENCE, result.applicationReference)
    return h.redirect(constants.routes.APPLICATION_SUBMITTED)
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
