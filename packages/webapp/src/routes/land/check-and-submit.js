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
  getLandowners,
  getDateString,
  getFileName,
  getLocalPlanningAuthorities
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
  return {
    listArray,
    boolToYesNo,
    dateToString,
    hideClass,
    application: applicationDetails,
    hideConsent: (request.yar.get(constants.redisKeys.LANDOWNERS)?.length === 0),
    changeLandownersHref: constants.routes.ADD_LANDOWNERS,
    routes: constants.routes,
    landownerNames: getAllLandowners(request.yar),
    legalAgreementType: request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_DOCUMENT_TYPE) &&
    getLegalAgreementDocumentType(request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_DOCUMENT_TYPE)),
    legalAgreementFileNames: getLegalAgreementFileNamesForCheckandSubmit(applicationDetails.files),
    responsibleBodies: getResponsibleBodies(request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_RESPONSIBLE_BODIES)),
    landowners: getLandowners(request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_LANDOWNER_CONSERVATION_CONVENANTS)),
    habitatPlanIncludedLegalAgreementYesNo: request.yar.get(constants.redisKeys.HABITAT_PLAN_LEGAL_AGREEMENT_DOCUMENT_INCLUDED_YES_NO),
    getFileNameByType,
    HabitatPlanFileName: getFileNameByType(applicationDetails.files, 'habitat-plan'),
    localLandChargeFileName: getFileNameByType(applicationDetails.files, 'local-land-charge'),
    HabitatWorksStartDate: getDateString(request.yar.get(constants.redisKeys.ENHANCEMENT_WORKS_START_DATE_KEY), 'start date'),
    HabitatWorksEndDate: getDateString(request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_END_DATE_KEY), 'end date'),
    localPlanningAuthorities: getLocalPlanningAuthorities(request.yar.get(constants.redisKeys.PLANNING_AUTHORTITY_LIST)),
    landownershipFilesRows: getLandOwnershipRows(request.yar.get(constants.redisKeys.LAND_OWNERSHIP_PROOFS)),
    ...geospatialOrLandBoundaryContext(request)
  }
}
const getLegalAgreementFileNamesForCheckandSubmit = (legalAgreementFiles) => {
  const filenames = legalAgreementFiles
    .filter(file => file.fileType === 'legal-agreement' && file.fileName)
    .map(file => getFileName(file.fileName))
  return filenames.join('<br>')
}
const getFileNameByType = (files, desiredType) => {
  const file = files.find(file => file.fileType === desiredType)
  return file.fileName
}

const getLandOwnershipRows = (landOwnershipFileNames) => {
  const rows = []
  if (landOwnershipFileNames) {
    for (const item of landOwnershipFileNames) {
      rows.push(
        {
          key: {
            text: 'Proof of land ownership file uploaded'
          },
          value: {
            html: '<span data-testid="proof-land-ownership-file-name-value">' + item + '</span>'
          },
          actions: {
            items: [
              {
                href: constants.routes.LAND_OWNERSHIP_PROOF_LIST,
                text: 'Change',
                visuallyHiddenText: ' land boundary file'
              }
            ]
          }
        }
      )
    }
  }
  return rows
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
