import constants from '../../utils/constants.js'
import path from 'path'
import {
  processRegistrationTask,
  getResponsibleBodies,
  getDateString,
  listArray,
  getLegalAgreementDocumentType,
  getLandowners
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
    habitatPlanSeperateDocumentYesNo: request.yar.get(constants.redisKeys.HABITAT_PLAN_LEGAL_AGREEMENT_DOCUMENT_INCLUDED_YES_NO),
    HabitatPlanFileName: getFileName(request.yar.get(constants.redisKeys.HABITAT_PLAN_LOCATION)),
    HabitatWorksStartDate: getDateString(request.yar.get(constants.redisKeys.ENHANCEMENT_WORKS_START_DATE_KEY), 'start date'),
    HabitatWorksEndDate: getDateString(request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_END_DATE_KEY), 'end date')
  }
}

const getFileName = fileLocation => fileLocation ? path.parse(fileLocation).base : ''

const getLegalAgreementFileNames = (legalAgreementFiles) => {
  if (!legalAgreementFiles) return ''
  const filenames = legalAgreementFiles.map(file => getFileName(file.location))
  return filenames.join('<br>')
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
