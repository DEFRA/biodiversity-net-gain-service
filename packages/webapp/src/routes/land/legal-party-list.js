import constants from '../../utils/constants.js'
import { processRegistrationTask, getLegalAgreementDocumentType } from '../../utils/helpers.js'

const handlers = {
  get: async (request, h) => {
    processRegistrationTask(request, {
        taskTitle: 'Legal information',
        title: 'Legal party list'
      }, {
        inProgressUrl: constants.routes.LEGAL_PARTY_LIST
      })

      const partySelectionData = request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_PARTIES)
      const legalAgreementType = getLegalAgreementDocumentType(
        request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_DOCUMENT_TYPE))?.toLowerCase()

      return h.view(constants.views.LEGAL_PARTY_LIST, {
        partySelectionData,
        legalAgreementType,
        routes: constants.routes
      })
  },
  post: async (request, h) => {
    const partySelectionData = request.payload

    if (request.payload.addAnotherLegalParty === 'yes') {
        partySelectionData.addAnotherLegalParty = 'yes'
    } else {
        partySelectionData.addAnotherLegalParty = 'no'
    }

    request.yar.set(constants.redisKeys.ADD_LEGAL_AGREEMENT_PARTIES, partySelectionData)
      return h.redirect(constants.routes.LEGAL_AGREEMENT_START_DATE)
  }
}

export default [{
  method: 'GET',
  path: constants.routes.LEGAL_PARTY_LIST,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.LEGAL_PARTY_LIST,
  handler: handlers.post
}]
