import constants from '../../utils/constants.js'
import {
  getResponsibleBodies,
  getDateString,
  listArray,
  getLegalAgreementDocumentType,
  getLandowners,
  hideClass,
  getLegalAgreementFileNames,
  getFileHeaderPrefix,
  getLocalPlanningAuthorities,
  getFileName
} from '../../utils/helpers.js'
import { REGISTRATIONCONSTANTS } from '../../journey-validation/registration/task-sections.js'
import { getIndividualTaskStatus, getNextStep } from '../../journey-validation/task-list-generator.js'
const handlers = {
  get: async (request, h) => {
    const registrationTaskStatus = getIndividualTaskStatus(request.yar, REGISTRATIONCONSTANTS.LEGAL_AGREEMENT)
    if (registrationTaskStatus !== 'COMPLETED') {
      const isCombinedCase = (request?._route?.path || '').startsWith('/combined-case')
      return isCombinedCase
        ? h.redirect(constants.routes.COMBINED_CASE_TASK_LIST)
        : h.redirect(constants.routes.REGISTER_LAND_TASK_LIST)
    }
    return h.view(constants.views.CHECK_LEGAL_AGREEMENT_DETAILS, {
      listArray,
      ...getContext(request)
    })
  },
  post: async (request, h) => {
    return getNextStep(request, h)
  }
}

const getContext = request => {
  const applicationType = request.yar.get(constants.redisKeys.APPLICATION_TYPE)
  const isCombinedCase = applicationType === constants.applicationTypes.COMBINED_CASE
  const hrefPath = isCombinedCase ? '/combined-case' : '/land'
  const legalAgreementFileNames = getLegalAgreementFileNames(request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_FILES))
  const legalAgreementFileHeaderPrefix = getFileHeaderPrefix(legalAgreementFileNames)
  return {
    legalAgreementType: getLegalAgreementDocumentType(request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_DOCUMENT_TYPE)),
    legalAgreementFileNames: legalAgreementFileNames.join('<br>'),
    legalAgreementFileHeaderPrefix,
    responsibleBodies: getResponsibleBodies(request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_RESPONSIBLE_BODIES)),
    anyOtherLO: request.yar.get(constants.redisKeys.ANY_OTHER_LANDOWNERS_CHECKED),
    landowners: getLandowners(request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_LANDOWNER_CONSERVATION_CONVENANTS)),
    habitatPlanIncludedLegalAgreementYesNo: request.yar.get(constants.redisKeys.HABITAT_PLAN_LEGAL_AGREEMENT_DOCUMENT_INCLUDED_YES_NO),
    HabitatPlanFileName: getFileName(request.yar.get(constants.redisKeys.HABITAT_PLAN_LOCATION)),
    HabitatWorksStartDate: getDateString(request.yar.get(constants.redisKeys.ENHANCEMENT_WORKS_START_DATE_KEY), 'start date'),
    HabitatWorksEndDate: getDateString(request.yar.get(constants.redisKeys.HABITAT_ENHANCEMENTS_END_DATE_KEY), 'end date'),
    localPlanningAuthorities: getLocalPlanningAuthorities(request.yar.get(constants.redisKeys.PLANNING_AUTHORTITY_LIST)),
    hideClass,
    hrefPath
  }
}

export default [{
  method: 'GET',
  path: constants.routes.CHECK_LEGAL_AGREEMENT_DETAILS,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.CHECK_LEGAL_AGREEMENT_DETAILS,
  handler: handlers.post
}]
