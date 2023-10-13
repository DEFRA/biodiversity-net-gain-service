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
    const { localPlanningAuthority } = request.payload

    if (!localPlanningAuthority) {
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
    lpaList.push(localPlanningAuthority)

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
