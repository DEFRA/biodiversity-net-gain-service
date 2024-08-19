import constants from './constants.js'
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
  getFileHeaderPrefix,
  getFileName,
  getLocalPlanningAuthorities
} from './helpers.js'
import landBoundaryContext from '../routes/land/helpers/land-boundary-context.js'
import applicationInformationContext from '../routes/land/helpers/applicant-information.js'

const getRegistrationDetails = (request, applicationDetails) => {
  const legalAgreementFileNames = getCombinedFileNamesByType(applicationDetails.files, 'legal-agreement')
  const legalAgreementFileHeaderPrefix = getFileHeaderPrefix(legalAgreementFileNames)
  const applicationType = request.yar.get(constants.redisKeys.APPLICATION_TYPE)
  return {
    listArray,
    boolToYesNo,
    dateToString,
    hideClass,
    application: applicationDetails,
    hideConsent: (request.yar.get(constants.redisKeys.LANDOWNERS)?.length === 0),
    changeLandownersHref: constants.routes.ADD_LANDOWNERS,
    routes: constants.routes,
    reusedRoutes: constants.reusedRoutes,
    landownerNames: getAllLandowners(request.yar),
    legalAgreementType: request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_DOCUMENT_TYPE) &&
    getLegalAgreementDocumentType(request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_DOCUMENT_TYPE)),
    legalAgreementFileNames: legalAgreementFileNames.join('<br>'),
    legalAgreementFileHeaderPrefix,
    responsibleBodies: getResponsibleBodies(request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_RESPONSIBLE_BODIES)),
    landowners: getLandowners(request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_LANDOWNER_CONSERVATION_CONVENANTS)),
    habitatPlanIncludedLegalAgreementYesNo: request.yar.get(constants.redisKeys.HABITAT_PLAN_LEGAL_AGREEMENT_DOCUMENT_INCLUDED_YES_NO),
    getFileNameByType,
    HabitatPlanFileName: getFileNameByType(applicationDetails.files, 'habitat-plan'),
    localLandChargeFileName: getFileNameByType(applicationDetails.files, 'local-land-charge'),
    HabitatWorksStartDate: getDateString(request.yar.get(constants.redisKeys.ENHANCEMENT_WORKS_START_DATE_KEY), 'start date'),
    HabitatWorksEndDate: getDateString(request.yar.get(constants.redisKeys.HABITAT_ENHANCEMENTS_END_DATE_KEY), 'end date'),
    localPlanningAuthorities: getLocalPlanningAuthorities(request.yar.get(constants.redisKeys.PLANNING_AUTHORTITY_LIST)),
    ...landBoundaryContext(request),
    ...applicationInformationContext(request.yar),
    landownershipFilesRows: getLandOwnershipRows(applicationDetails, applicationType),
    anyOtherLO: request.yar.get(constants.redisKeys.ANY_OTHER_LANDOWNERS_CHECKED)
  }
}
const getCombinedFileNamesByType = (legalAgreementFiles, fileType) => {
  const filenames = legalAgreementFiles
    .filter(file => file.fileType === fileType && file.fileName)
    .map(file => getFileName(file.fileName))
  return filenames
}
const getFileNameByType = (files, desiredType) => {
  const file = files.find(file => file.fileType === desiredType)
  return file ? file.fileName : ''
}

const getLandOwnershipRows = (applicationDetails, applicationType) => {
  const isCombinedCase = applicationType === constants.applicationTypes.COMBINED_CASE
  const changeHref = isCombinedCase ? constants.reusedRoutes.COMBINED_CASE_LAND_OWNERSHIP_PROOF_LIST : constants.routes.LAND_OWNERSHIP_PROOF_LIST
  const landOwnershipFileNames = getCombinedFileNamesByType(applicationDetails.files, 'land-ownership')
  const rows = []
  if (landOwnershipFileNames.length > 0) {
    const fileText = getFileHeaderPrefix(landOwnershipFileNames)
    rows.push(
      {
        key: {
          text: `Proof of land ownership ${fileText} uploaded`
        },
        value: {
          html: '<span data-testid="proof-land-ownership-file-name-value">' + landOwnershipFileNames.join('<br>') + '</span>'
        },
        actions: {
          items: [
            {
              href: changeHref,
              text: 'Change',
              visuallyHiddenText: ' land boundary file'
            }
          ]
        }
      }
    )
  }
  return rows
}

export default getRegistrationDetails
