import constants from '../../utils/constants.js'
import { processRegistrationTask, getLegalAgreementDocumentType } from '../../utils/helpers.js'

const handlers = {
  get: async (request, h) => {
    processRegistrationTask(request, {
      taskTitle: 'Legal information',
      title: 'Legal party remove'
    }, {
      inProgressUrl: constants.routes.LEGAL_PARTY_REMOVE
    })

    const { orgId } = request.query

    const legalAgreementParties = request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_PARTIES)
    const orgToRemove = legalAgreementParties[orgId]

    return h.view(constants.views.LEGAL_PARTY_REMOVE, {
      orgToRemove
    })
  },
  post: async (request, h) => {
    const { orgId } = request.query
    const { legalPartyRemove } = request.payload
    const legalAgreementParties = request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_PARTIES)

    if (legalPartyRemove === 'yes') {
      legalAgreementParties.splice(orgId, 1)
      request.yar.set(constants.redisKeys.LEGAL_AGREEMENT_PARTIES, legalAgreementParties)
    }
    return h.redirect(constants.routes.LEGAL_PARTY_LIST)
  }
}

export default [{
  method: 'GET',
  path: constants.routes.LEGAL_PARTY_REMOVE,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.LEGAL_PARTY_REMOVE,
  handler: handlers.post
}]
