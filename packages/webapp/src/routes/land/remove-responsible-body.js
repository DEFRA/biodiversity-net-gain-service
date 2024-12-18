import constants from '../../utils/constants.js'
import { validateIdGetSchemaOptional } from '../../utils/helpers.js'

const handlers = {
  get: async (request, h) => {
    const { id } = request.query
    const legalAgreementResponsibleBodies = request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_RESPONSIBLE_BODIES)
    if (legalAgreementResponsibleBodies.length === 0) {
      return h.redirect(constants.routes.NEED_ADD_ALL_RESPONSIBLE_BODIES)
    }
    let legalPartyBodyToRemoveText
    if (id) { legalPartyBodyToRemoveText = legalAgreementResponsibleBodies[id].responsibleBodyName }
    return h.view(constants.views.REMOVE_RESPONSIBLE_BODY, {
      legalPartyBodyToRemoveText
    })
  },
  post: async (request, h) => {
    const { id } = request.query
    const { legalPartyBodyToRemove } = request.payload
    const legalAgreementResponsibleBodies = request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_RESPONSIBLE_BODIES)
    if (!legalPartyBodyToRemove) {
      const legalPartyBodyToRemoveText = legalAgreementResponsibleBodies[id].responsibleBodyName
      return h.view(constants.views.REMOVE_RESPONSIBLE_BODY, {
        legalPartyBodyToRemoveText,
        err: [{
          text: 'Select yes if you want to remove responsible body',
          href: '#legalPartyBodyToRemove'
        }]
      })
    }
    if (legalPartyBodyToRemove === 'yes') {
      legalAgreementResponsibleBodies.splice(id, 1)
      request.yar.set(constants.redisKeys.LEGAL_AGREEMENT_RESPONSIBLE_BODIES, legalAgreementResponsibleBodies)
    }
    const isCombinedCase = (request?._route?.path || '').startsWith('/combined-case')
    if (legalAgreementResponsibleBodies.length === 0) { return h.redirect(isCombinedCase ? constants.reusedRoutes.COMBINED_CASE_NEED_ADD_ALL_RESPONSIBLE_BODIES : constants.routes.NEED_ADD_ALL_RESPONSIBLE_BODIES) }
    return h.redirect(isCombinedCase ? constants.reusedRoutes.COMBINED_CASE_CHECK_RESPONSIBLE_BODIES : constants.routes.CHECK_RESPONSIBLE_BODIES)
  }
}

export default [{
  method: 'GET',
  path: constants.routes.REMOVE_RESPONSIBLE_BODY,
  handler: handlers.get,
  options: validateIdGetSchemaOptional
}, {
  method: 'POST',
  path: constants.routes.REMOVE_RESPONSIBLE_BODY,
  handler: handlers.post,
  options: validateIdGetSchemaOptional
}]
