import constants from '../../utils/constants.js'
import application from '../../utils/application.js'
import applicationValidation from '../../utils/application-validation.js'
import { postJson } from '../../utils/http.js'
import {
  listArray,
  boolToYesNo,
  dateToString,
  hideClass,
  getAllLandowners,
  getLegalAgreementDocumentType,
  getNameAndRoles
} from '../../utils/helpers.js'
import geospatialOrLandBoundaryContext from './helpers/geospatial-or-land-boundary-context.js'

const handlers = {
  get: async (request, h) => {
    return h.view(constants.views.CHECK_AND_SUBMIT, {
      application: application(request.yar, request.auth.credentials.account).landownerGainSiteRegistration,
      ...getContext(request)
    })
  },
  post: async (request, h) => {
    const { value, error } = applicationValidation.validate(application(request.yar, request.auth.credentials.account))
    if (error) {
      throw new Error(error)
    }
    const result = await postJson(`${constants.AZURE_FUNCTION_APP_URL}/processapplication`, value)
    request.yar.set(constants.redisKeys.APPLICATION_REFERENCE, result.gainSiteReference)
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
    legalAgreementParties: request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_PARTIES) && getNameAndRoles(request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_PARTIES)),
    ...geospatialOrLandBoundaryContext(request)
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
