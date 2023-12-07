import constants from '../../utils/constants.js'
import { processRegistrationTask, validateIdGetSchemaOptional } from '../../utils/helpers.js'

const handlers = {
  get: async (request, h) => {
    processRegistrationTask(request, {
      taskTitle: 'Legal information',
      title: 'Legal party remove'
    }, {
      inProgressUrl: constants.routes.REMOVE_LOCAL_PLANNING_AUTHORITY
    })
    const { id } = request.query
    const planningAuthorityList = request.yar.get(constants.redisKeys.PLANNING_AUTHORTITY_LIST)
    const planningAuthToRemove = id && planningAuthorityList[id]
    return h.view(constants.views.REMOVE_LOCAL_PLANNING_AUTHORITY, {
      planningAuthToRemove
    })
  },
  post: async (request, h) => {
    const { id } = request.query
    const { planningAuthToRemove } = request.payload
    const planningAuthorityList = request.yar.get(constants.redisKeys.PLANNING_AUTHORTITY_LIST)
    if (!planningAuthToRemove) {
      const localAuthorityNameToRemove = planningAuthorityList[id]
      return h.view(constants.views.REMOVE_LOCAL_PLANNING_AUTHORITY, {
        localAuthorityNameToRemove,
        err: [{
          text: `Select yes if you want to remove ${localAuthorityNameToRemove} as a local planning authority`,
          href: '#planningAuthToRemove'
        }]
      })
    }
    if (planningAuthToRemove === 'yes') {
      planningAuthorityList.splice(id, 1)
      request.yar.set(constants.redisKeys.LEGAL_AGREEMENT_PARTIES, planningAuthorityList)
    }
    return h.redirect(constants.routes.CHECK_PLANNING_AUTHORITIES)
  }
}

export default [{
  method: 'GET',
  path: constants.routes.REMOVE_LOCAL_PLANNING_AUTHORITY,
  handler: handlers.get,
  options: validateIdGetSchemaOptional
}, {
  method: 'POST',
  path: constants.routes.REMOVE_LOCAL_PLANNING_AUTHORITY,
  handler: handlers.post,
  options: validateIdGetSchemaOptional
}]
