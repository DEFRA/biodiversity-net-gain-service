import constants from '../../utils/constants.js'
import { getLegalAgreementDocumentType } from '../../utils/helpers.js'
import { getNextStep } from '../../journey-validation/task-list-generator-v5.js'

const handlers = {
  get: async (request, h) => {
    const legalAgreementType = getLegalAgreementDocumentType(
      request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_DOCUMENT_TYPE))?.toLowerCase()
    return h.view(constants.views.LANDOWNER_INDIVIDUAL_ORGANISATION, {
      legalAgreementType
    })
  },
  post: async (request, h) => {
    const { individualOrOrganisation } = request.payload
    const legalAgreementType = getLegalAgreementDocumentType(
      request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_DOCUMENT_TYPE))?.toLowerCase()
    if (!individualOrOrganisation) {
      return h.view(constants.views.LANDOWNER_INDIVIDUAL_ORGANISATION, {
        legalAgreementType,
        err: [{
          text: 'Select if the landowner or leaseholder is an individual or organisation',
          href: '#individualOrOrganisation'
        }]
      })
    }
    return getNextStep(request, h)
  }
}

export default [{
  method: 'GET',
  path: constants.routes.LANDOWNER_INDIVIDUAL_ORGANISATION,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.LANDOWNER_INDIVIDUAL_ORGANISATION,
  handler: handlers.post
}]
