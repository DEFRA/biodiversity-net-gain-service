import constants from '../../utils/constants.js'
import { processRegistrationTask } from '../../utils/helpers.js'

const handlers = {
  get: async (request, h) => {
    processRegistrationTask(request, {
      taskTitle: 'Legal information',
      title: 'Legal party remove'
    }, {
      inProgressUrl: constants.routes.LEGAL_PARTY_REMOVE
    })

    const { orgId } = request.query

    const legalAgreementParties = request.yar.get(constants.cacheKeys.LEGAL_AGREEMENT_PARTIES)
    const orgToRemove = legalAgreementParties[orgId]

    return h.view(constants.views.LEGAL_PARTY_REMOVE, {
      orgToRemove
    })
  },
  post: async (request, h) => {
    const { orgId } = request.query
    const { legalPartyRemove } = request.payload
    const legalAgreementParties = request.yar.get(constants.cacheKeys.LEGAL_AGREEMENT_PARTIES)

    if (!legalPartyRemove) {
      const orgToRemove = legalAgreementParties[orgId]

      return h.view(constants.views.LEGAL_PARTY_REMOVE, {
        orgToRemove,
        err: [{
          text: 'Select yes if you want to remove legal party',
          href: '#legalPartyRemove'
        }]
      })
    }

    if (legalPartyRemove === 'yes') {
      legalAgreementParties.splice(orgId, 1)
      request.yar.set(constants.cacheKeys.LEGAL_AGREEMENT_PARTIES, legalAgreementParties)
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
