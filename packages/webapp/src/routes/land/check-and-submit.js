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
  getResponsibleBodies,
  getDesiredFilenameFromRedisLocation,
  getLandowners,
  getDateString
} from '../../utils/helpers.js'
import geospatialOrLandBoundaryContext from './helpers/geospatial-or-land-boundary-context.js'

const handlers = {
  get: async (request, h) => {
    return request.yar.get(constants.redisKeys.APPLICATION_REFERENCE) !== null
      ? h.view(constants.views.CHECK_AND_SUBMIT, {
        ...getContext(request)
      })
      : h.redirect(constants.routes.START)
  },
  post: async (request, h) => {
    const { value, error } = applicationValidation.validate(application(request.yar, request.auth.credentials.account))
    if (error) {
      throw new Error(error)
    }
    const result = await postJson(`${constants.AZURE_FUNCTION_APP_URL}/processapplication`, value)
    request.yar.set(constants.redisKeys.APPLICATION_REFERENCE, result.gainSiteReference)
    return h.redirect(constants.routes.APPLICATION_SUBMITTED)
  }
}

const getContext = request => {
  const applicationDetails = application(request.yar, request.auth.credentials.account).landownerGainSiteRegistration
  console.log(applicationDetails.files)
  return {
    listArray,
    boolToYesNo,
    dateToString,
    hideClass,
    application: applicationDetails,
    hideConsent: (request.yar.get(constants.redisKeys.ROLE_KEY) === 'Landowner' && request.yar.get(constants.redisKeys.LANDOWNERS)?.length === 0),
    changeLandownersHref: request.yar.get(constants.redisKeys.ROLE_KEY) === 'Landowner' ? constants.routes.REGISTERED_LANDOWNER : constants.routes.ADD_LANDOWNERS,
    routes: constants.routes,
    landownerNames: getAllLandowners(request.yar),
    legalAgreementType: request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_DOCUMENT_TYPE) &&
      getLegalAgreementDocumentType(request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_DOCUMENT_TYPE)),
    legalAgreementFileNames: getLegalAgreementFileNames(applicationDetails.files),
    responsibleBodies: getResponsibleBodies(request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_RESPONSIBLE_BODIES)),
    landowners: getLandowners(request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_LANDOWNER_CONSERVATION_CONVENTS)),
    habitatPlanSeperateDocumentYesNo: request.yar.get(constants.redisKeys.HABITAT_PLAN_SEPERATE_DOCUMENT_YES_NO),
    getFileNameByType,
    HabitatWorksStartDate: getDateString(request.yar.get(constants.redisKeys.ENHANCEMENT_WORKS_START_DATE_KEY), 'start date'),
    HabitatWorksEndDate: getDateString(request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_END_DATE_KEY), 'end date'),

    ...geospatialOrLandBoundaryContext(request)
  }
}

const getFileNameByType = (files, desiredType) => {
  const file = files.find(file => file.fileType === desiredType)
  return file ? file.fileName : 'File not found'
}

const getLegalAgreementFileNames = (files) => {
  const fileNames = files
    .filter(file => file.fileType === 'legal-agreement' && file.fileName)
    .map(file => getDesiredFilenameFromRedisLocation(file.fileName))

  // Join fileNames with '<br>' and return the resulting string
  return fileNames.join('<br>')
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
