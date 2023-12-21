import constants from '../../utils/constants.js'
import {
  processRegistrationTask,
  getResponsibleBodies,
  getDateString,
  listArray,
  getLegalAgreementDocumentType,
  getLandowners,
  hideClass,
  getLegalAgreementFileNames,
  getLocalPlanningAuthorities,
  getFileName
} from '../../utils/helpers.js'

const handlers = {
  get: async (request, h) => {
    processRegistrationTask(request, {
      taskTitle: 'Legal information',
      title: 'Add legal agreement details'
    }, {
      inProgressUrl: constants.routes.CHECK_LEGAL_AGREEMENT_DETAILS
    })
    return h.view(constants.views.CHECK_LEGAL_AGREEMENT_DETAILS, {
      listArray,
      ...getContext(request)
    })
  },
  post: async (request, h) => {
    processRegistrationTask(request, { taskTitle: 'Legal information', title: 'Add legal agreement details' }, { status: constants.COMPLETE_REGISTRATION_TASK_STATUS })
    return h.redirect(constants.routes.REGISTER_LAND_TASK_LIST)
  }
}

const getContext = request => {
  return {
    legalAgreementType: getLegalAgreementDocumentType(request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_DOCUMENT_TYPE)),
    legalAgreementFileNames: getLegalAgreementFileNames(request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_FILES)),
    responsibleBodies: getResponsibleBodies(request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_RESPONSIBLE_BODIES)),
    landowners: getLandowners(request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_LANDOWNER_CONSERVATION_CONVENANTS)),
    habitatPlanIncludedLegalAgreementYesNo: request.yar.get(constants.redisKeys.HABITAT_PLAN_LEGAL_AGREEMENT_DOCUMENT_INCLUDED_YES_NO),
    HabitatPlanFileName: getFileName(request.yar.get(constants.redisKeys.HABITAT_PLAN_LOCATION)),
    HabitatWorksStartDate: getDateString(request.yar.get(constants.redisKeys.ENHANCEMENT_WORKS_START_DATE_KEY), 'start date'),
    HabitatWorksEndDate: getDateString(request.yar.get(constants.redisKeys.HABITAT_ENHANCEMENTS_END_DATE_KEY), 'end date'),
    localPlanningAuthorities: getLocalPlanningAuthorities(request.yar.get(constants.redisKeys.PLANNING_AUTHORTITY_LIST)),
    hideClass
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
