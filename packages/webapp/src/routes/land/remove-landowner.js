import constants from '../../utils/constants.js'
import { validateIdGetSchemaOptional } from '../../utils/helpers.js'

const handlers = {
  get: async (request, h) => {
    const { id } = request.query
    const landownerConversationConvenants = request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_LANDOWNER_CONSERVATION_CONVENANTS)
    if (landownerConversationConvenants.length === 0) {
      return h.redirect(constants.routes.NEED_ADD_ALL_LANDOWNERS)
    }
    let landownerToRemove
    let landownerToRemoveText
    if (id) {
      landownerToRemove = landownerConversationConvenants[id]
      if (landownerToRemove.type === 'individual') {
        landownerToRemoveText = `${landownerToRemove.firstName} ${landownerToRemove.lastName}`
      } else {
        landownerToRemoveText = landownerToRemove.organisationName
      }
    }
    return h.view(constants.views.REMOVE_LANDOWNER, {
      landownerToRemoveText
    })
  },
  post: async (request, h) => {
    const { id } = request.query
    const { landownerToRemove } = request.payload
    let landownerToRemoveText
    const landownerConversationConvenants = request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_LANDOWNER_CONSERVATION_CONVENANTS)
    if (!landownerToRemove) {
      const idToRemove = landownerConversationConvenants[id]
      if (idToRemove.type === 'individual') {
        landownerToRemoveText = `${idToRemove.firstName} ${idToRemove.lastName}`
      } else {
        landownerToRemoveText = idToRemove.organisationName
      }
      return h.view(constants.views.REMOVE_LANDOWNER, {
        landownerToRemoveText,
        err: [{
          text: 'Select yes if you want to remove landowner or leaseholder',
          href: '#legalPartyBodyToRemove'
        }]
      })
    }
    if (landownerToRemove === 'yes') {
      landownerConversationConvenants.splice(id, 1)
      request.yar.set(constants.redisKeys.LEGAL_AGREEMENT_LANDOWNER_CONSERVATION_CONVENANTS, landownerConversationConvenants)
    }
    const isCombinedCase = (request?._route?.path || '').startsWith('/combined-case')
    if (landownerConversationConvenants.length === 0) { return h.redirect(isCombinedCase ? constants.reusedRoutes.COMBINED_CASE_NEED_ADD_ALL_LANDOWNERS : constants.routes.NEED_ADD_ALL_LANDOWNERS) }
    return h.redirect(isCombinedCase ? constants.reusedRoutes.COMBINED_CASE_CHECK_LANDOWNERS : constants.routes.CHECK_LANDOWNERS)
  }
}

export default [{
  method: 'GET',
  path: constants.routes.REMOVE_LANDOWNER,
  handler: handlers.get,
  options: validateIdGetSchemaOptional
}, {
  method: 'POST',
  path: constants.routes.REMOVE_LANDOWNER,
  handler: handlers.post,
  options: validateIdGetSchemaOptional
}]
