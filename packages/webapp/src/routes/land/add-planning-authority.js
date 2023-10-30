import constants from '../../utils/constants.js'
import {
  processRegistrationTask,
  getLegalAgreementDocumentType
} from '../../utils/helpers.js'

const handlers = {
  get: async (request, h) => {
    processRegistrationTask(request, {
      taskTitle: 'Legal information',
      title: 'Add legal agreement details'
    }, {
      inProgressUrl: constants.routes.ADD_PLANNING_AUTHORITY
    })
    const { id } = request.query
    const legalAgreementType = getLegalAgreementDocumentType(
      request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_DOCUMENT_TYPE))?.toLowerCase()
    const lpaList = request.yar.get(constants.redisKeys.PLANNING_AUTHORTITY_LIST)
    let localPlanningAuthority
    if (id) {
      localPlanningAuthority = lpaList[id]
    }
    return h.view(constants.views.ADD_PLANNING_AUTHORITY, {
      localPlanningAuthority,
      legalAgreementType
    })
  },
  post: async (request, h) => {
    const { id } = request.query
    const { localPlanningAuthority } = request.payload
    const selectedLpa = Array.isArray(localPlanningAuthority) ? localPlanningAuthority[0] : localPlanningAuthority
    if (!selectedLpa) {
      const localPlanningAuthorityNameErr = [{
        text: 'Enter a local planning authority',
        href: 'localPlanningAuthority'
      }]
      return h.view(constants.views.ADD_PLANNING_AUTHORITY, {
        err: Object.values(localPlanningAuthorityNameErr),
        localPlanningAuthorityNameErr
      })
    }
    const lpaList = request.yar.get(constants.redisKeys.PLANNING_AUTHORTITY_LIST) ?? []
    if (id) {
      lpaList.splice(id, 1, selectedLpa)
    } else {
      lpaList.push(selectedLpa)
    }
    request.yar.set(constants.redisKeys.PLANNING_AUTHORTITY_LIST, lpaList)
    return h.redirect(constants.routes.CHECK_PLANNING_AUTHORITIES)
  }
}

export default [{
  method: 'GET',
  path: constants.routes.ADD_PLANNING_AUTHORITY,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.ADD_PLANNING_AUTHORITY,
  handler: handlers.post
}]
