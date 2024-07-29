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
  getFileHeaderPrefix,
  getFileName,
  getLocalPlanningAuthorities
} from '../../utils/helpers.js'
import geospatialOrLandBoundaryContext from './helpers/geospatial-or-land-boundary-context.js'
import applicationInformationContext from './helpers/applicant-information.js'
import getOrganisationDetails from '../../utils/get-organisation-details.js'
import { getTaskList } from '../../journey-validation/task-list-generator-v5.js'

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

    return request.yar.get(constants.redisKeys.APPLICATION_REFERENCE) !== undefined &&
      request.yar.get(constants.redisKeys.APPLICATION_REFERENCE) !== null
      ? h.view(constants.views.CHECK_AND_SUBMIT, {
        ...getContext(request)
      })
      : h.redirect('/')
  },
  post: async (request, h) => {
    if (request.payload.termsAndConditionsConfirmed !== 'Yes') {
      const err = [{
        text: 'You must confirm you have read the terms and conditions',
        href: '#termsAndConditionsConfirmed'
      }]
      return h.view(constants.views.CHECK_AND_SUBMIT, { ...getContext(request), err })
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

const getContext = request => {
  const applicationDetails = application(request.yar, request.auth.credentials.account).landownerGainSiteRegistration
  const legalAgreementFileNames = getCombinedFileNamesByType(applicationDetails.files, 'legal-agreement')
  const legalAgreementFileHeaderPrefix = getFileHeaderPrefix(legalAgreementFileNames)
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
    ...geospatialOrLandBoundaryContext(request),
    ...applicationInformationContext(request.yar),
    landownershipFilesRows: getLandOwnershipRows(applicationDetails),
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

const getLandOwnershipRows = (applicationDetails) => {
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
              href: constants.routes.LAND_OWNERSHIP_PROOF_LIST,
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

export default [{
  method: 'GET',
  path: constants.routes.CHECK_AND_SUBMIT,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.CHECK_AND_SUBMIT,
  handler: handlers.post
}]
