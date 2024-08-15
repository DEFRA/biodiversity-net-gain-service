import constants from '../../utils/constants.js'
import application from '../../utils/application.js'
import applicationValidation from '../../utils/application-validation.js'
import { postJson } from '../../utils/http.js'
import getOrganisationDetails from '../../utils/get-organisation-details.js'
import { getTaskList } from '../../journey-validation/task-list-generator.js'
import getRegistrationDetails from '../../utils/get-land-check-and-submit-details.js'

const handlers = {
  get: async (request, h) => {
    const appSubmitted = request.yar.get(constants.redisKeys.LAND_APPLICATION_SUBMITTED)

    if (appSubmitted) {
      return h.redirect(constants.routes.MANAGE_BIODIVERSITY_GAINS)
    }

    const { canSubmit } = getTaskList(constants.applicationTypes.REGISTRATION, request.yar)

    if (!canSubmit) {
      return h.redirect(constants.routes.REGISTER_LAND_TASK_LIST)
    }

    const applicationDetails = application(request.yar, request.auth.credentials.account).landownerGainSiteRegistration

    return request.yar.get(constants.redisKeys.APPLICATION_REFERENCE) !== undefined &&
      request.yar.get(constants.redisKeys.APPLICATION_REFERENCE) !== null
      ? h.view(constants.views.CHECK_AND_SUBMIT,
        getRegistrationDetails(request, applicationDetails)
      )
      : h.redirect('/')
  },
  post: async (request, h) => {
    if (request.payload.termsAndConditionsConfirmed !== 'Yes') {
      const err = [{
        text: 'You must confirm you have read the terms and conditions',
        href: '#termsAndConditionsConfirmed'
      }]

      const applicationDetails = application(request.yar, request.auth.credentials.account).landownerGainSiteRegistration

      return h.view(constants.views.CHECK_AND_SUBMIT, { ...getRegistrationDetails(request, applicationDetails), err })
    }

    const { value, error } = applicationValidation.validate(application(request.yar, request.auth.credentials.account))
    if (error) {
      throw new Error(error)
    }
    const { currentOrganisationId: organisationId } = getOrganisationDetails(request.auth.credentials.account.idTokenClaims)
    value.organisationId = organisationId
    const result = await postJson(`${constants.AZURE_FUNCTION_APP_URL}/processapplication`, value)
    request.yar.set(constants.redisKeys.APPLICATION_REFERENCE, result.gainSiteReference)
    return h.redirect(constants.routes.APPLICATION_SUBMITTED)
  }
}

export default [{
  method: 'GET',
  path: constants.routes.CHECK_AND_SUBMIT,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.CHECK_AND_SUBMIT,
  handler: handlers.post
}]
