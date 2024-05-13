import constants from '../../utils/constants.js'
import application from '../../utils/application.js'
import applicationValidation from '../../utils/application-validation.js'
import { getTaskList } from '../../journey-validation/task-list-generator.js'
import getOrganisationDetails from '../../utils/get-organisation-details.js'
import { postJson } from '../../utils/http.js'

const handlers = {
  get: async (request, h) => {
    const { canSubmit } = getTaskList(constants.applicationTypes.REGISTRATION, request.yar)

    if (!canSubmit) {
      return h.redirect(constants.routes.REGISTER_LAND_TASK_LIST)
    }

    return request.yar.get(constants.redisKeys.APPLICATION_REFERENCE) !== undefined &&
      request.yar.get(constants.redisKeys.APPLICATION_REFERENCE) !== null
      ? h.view(constants.views.LAND_CHOOSE_PAYMENT, {})
      : h.redirect('/')
  },
  post: async (request, h) => {
    if (!request.payload.paymentType) {
      const err = [{
        text: 'You must choose a payment type',
        href: '#paymentType'
      }]
      return h.view(constants.views.LAND_CHOOSE_PAYMENT, { err })
    }

    request.yar.set(constants.redisKeys.PAYMENT_TYPE, request.payload.paymentType)
    if (request.payload.paymentType === 'bacs') {
      request.yar.set(constants.redisKeys.GOV_PAY_REFERENCE, '')
    } else {
      // Should redirect to gov pay where constants.redisKeys.GOV_PAY_REFERENCE etc (below) can be set
      // using gov pay information from the database record
      request.yar.set(constants.redisKeys.GOV_PAY_REFERENCE, 'mocked-gov-pay-reference')
      request.yar.set(constants.redisKeys.GOV_PAY_PAYMENT_DATE, new Date())
      request.yar.set(constants.redisKeys.GOV_PAY_PAYMENT_STATUS, 'mocked-paid')
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
  path: constants.routes.LAND_CHOOSE_PAYMENT,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.LAND_CHOOSE_PAYMENT,
  handler: handlers.post
}]
