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

    const legalAgreementParties = request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_PARTIES)
    const legalAgreementType = getLegalAgreementDocumentType(
      request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_DOCUMENT_TYPE))?.toLowerCase()
    const { ADD_LEGAL_AGREEMENT_PARTIES, LEGAL_PARTY_REMOVE } = constants.routes

    return h.view(constants.views.LEGAL_PARTY_LIST, {
      legalAgreementParties,
      legalAgreementType,
      routes: { ADD_LEGAL_AGREEMENT_PARTIES, LEGAL_PARTY_REMOVE }
    })
  },
  post: async (request, h) => {
    const { addAnotherLegalParty } = request.payload

    const legalAgreementParties = request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_PARTIES)
    const legalAgreementType = getLegalAgreementDocumentType(
      request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_DOCUMENT_TYPE))?.toLowerCase()

    if (!addAnotherLegalParty) {
      return h.view(constants.views.LEGAL_PARTY_LIST, {
        legalAgreementParties,
        legalAgreementType,
        routes: constants.routes,
        err: [{
          text: 'Select yes if you need to add another legal party',
          href: '#addAnotherLegalParty'
        }]
      })
    }

    if (addAnotherLegalParty === 'yes') {
      return h.redirect(constants.routes.ADD_LEGAL_AGREEMENT_PARTIES)
    }

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
