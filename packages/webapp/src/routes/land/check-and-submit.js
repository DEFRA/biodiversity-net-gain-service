import constants from '../../utils/constants.js'
import application from '../../utils/application.js'
import applicationValidation from '../../utils/application-validation.js'
import { postJson } from '../../utils/http.js'
import { listArray, boolToYesNo, dateToString, hideClass, getAllLandowners, getLegalAgreementDocumentType, getNameAndRoles } from '../../utils/helpers.js'

const functionAppUrl = process.env.AZURE_FUNCTION_APP_URL || 'http://localhost:7071/api'

const handlers = {
  get: async (request, h) => {
    return h.view(constants.views.CHECK_AND_SUBMIT, {
      application: application(request.yar).landownerGainSiteRegistration,
      ...getContext(request)
    })
  },
  post: async (request, h) => {
    const { value, error } = applicationValidation.validate(application(request.yar))
    if (error) throw new Error(error)
    const result = await postJson(`${functionAppUrl}/processapplication`, value)
    request.yar.set(constants.redisKeys.GAIN_SITE_REFERENCE, result.gainSiteReference)
    return h.redirect(constants.routes.REGISTRATION_SUBMITTED)
  }
}

const getContext = request => {
  return {
    listArray,
    boolToYesNo,
    dateToString,
    hideClass,
    hideConsent: (request.yar.get(constants.redisKeys.ROLE_KEY) === 'Landowner' && request.yar.get(constants.redisKeys.LANDOWNERS)?.length === 0),
    changeLandownersHref: request.yar.get(constants.redisKeys.ROLE_KEY) === 'Landowner' ? constants.routes.REGISTERED_LANDOWNER : constants.routes.ADD_LANDOWNERS,
    routes: constants.routes,
    landownerNames: getAllLandowners(request.yar),
    legalAgreementType: request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_DOCUMENT_TYPE) &&
      getLegalAgreementDocumentType(request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_DOCUMENT_TYPE)),
    legalAgreementParties: request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_PARTIES) && getNameAndRoles(request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_PARTIES))
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
