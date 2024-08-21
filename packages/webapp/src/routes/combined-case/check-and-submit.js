import constants from '../../utils/constants.js'
import { getTaskList } from '../../journey-validation/task-list-generator.js'
import application from '../../utils/combined-case-application.js'
import getRegistrationDetails from '../../utils/get-land-check-and-submit-details.js'
import getDeveloperDetails from '../../utils/get-developer-check-and-submit-details.js'
import combinedCaseApplicationValidation from '../../utils/combined-case-application-validation.js'
import { postJson } from '../../utils/http.js'
import getOrganisationDetails from '../../utils/get-organisation-details.js'

const handlers = {
  get: (request, h) => {
    // console.log('request:::', JSON.stringify(request.yar._store, (key, value) => {
    //   if (typeof value === 'object' && value !== null) {
    //     return value
    //   }
    //   return value
    // }, 2))

    // const metricData = request.yar.get(constants.redisKeys.METRIC_DATA)
    // console.log('metricData:::', JSON.stringify(metricData, null, 2))

    const allocatedHabitatData = request.yar.get(constants.redisKeys.DEVELOPER_METRIC_DATA)
    console.log('allocatedHabitatData:::', JSON.stringify(allocatedHabitatData, null, 2))

    const appSubmitted = request.yar.get(constants.redisKeys.COMBINED_CASE_APPLICATION_SUBMITTED)

    if (appSubmitted) {
      return h.redirect(constants.routes.MANAGE_BIODIVERSITY_GAINS)
    }

    const { canSubmit } = getTaskList(constants.applicationTypes.COMBINED_CASE, request.yar)

    if (!canSubmit) {
      return h.redirect(constants.routes.COMBINED_CASE_TASK_LIST)
    }

    const applicationDetails = application(request.yar, request.auth.credentials.account).combinedCase
    const claims = request.auth.credentials.account.idTokenClaims
    const { currentOrganisation } = getOrganisationDetails(claims)
    return h.view(
      constants.views.COMBINED_CASE_CHECK_AND_SUBMIT,
      {
        ...getRegistrationDetails(request, applicationDetails),
        ...getDeveloperDetails(request, request.yar, currentOrganisation)
      }
    )
  },
  post: async (request, h) => {
    const combinedCaseApplication = application(request.yar, request.auth.credentials.account)
    console.log('Combined case application:::', JSON.stringify(combinedCaseApplication, null, 2))
    const applicationDetails = combinedCaseApplication.combinedCase
    console.log('Application details from post request:::', JSON.stringify(applicationDetails, null, 2))

    if (request.payload.termsAndConditionsConfirmed !== 'Yes') {
      const claims = request.auth.credentials.account.idTokenClaims
      const { currentOrganisation } = getOrganisationDetails(claims)
      const err = [{
        text: 'You must confirm you have read the terms and conditions',
        href: '#termsAndConditionsConfirmed'
      }]
      return h.view(constants.views.COMBINED_CASE_CHECK_AND_SUBMIT,
        {
          ...getRegistrationDetails(request, applicationDetails),
          ...getDeveloperDetails(request, request.yar, currentOrganisation),
          err
        })
    }

    const { value, error } = combinedCaseApplicationValidation.validate(combinedCaseApplication)
    if (error) {
      throw new Error(error)
    }

    const result = await postJson(`${constants.AZURE_FUNCTION_APP_URL}/processcombinedcaseapplication`, value)
    console.log('Result from processcombinedcaseapplication:::', JSON.stringify(result, null, 2))
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
